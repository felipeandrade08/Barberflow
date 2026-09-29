import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';
import {dbRole} from '../_lib/authorization';
import {isPastLocalSlot,localDateTimeToUtc,toMinutes,weekdayForDate} from '../_lib/scheduling';

export default async function handler(req:VercelRequest,res:VercelResponse){
  const s=requireSession(req,res); if(!s)return;
  const currentRole=await dbRole(s.userId,s.tenantId);if(!currentRole)return res.status(401).json({error:'Sessão inválida.'});
  try{
    if(req.method==='POST'){
      const x=req.body||{};
      if(!x.serviceId||!x.professionalId||!/^\d{4}-\d{2}-\d{2}$/.test(String(x.date||''))||!/^\d{2}:\d{2}$/.test(String(x.time||''))) return res.status(400).json({error:'Serviço, profissional, data e horário válidos são obrigatórios.'});
      const client=await db().connect();
      try{
        await client.query('BEGIN');
        const tenant=(await client.query('SELECT open_time,close_time,booking_interval,cancellation_hours,off_days,subscription_status,timezone FROM tenants WHERE id=$1 AND deleted_at IS NULL',[s.tenantId])).rows[0];
        if(!tenant||!['active','trialing'].includes(tenant.subscription_status)){await client.query('ROLLBACK');return res.status(403).json({error:'Agenda temporariamente indisponível.'});}
        const service=(await client.query('SELECT id,name,price,duration FROM services WHERE id=$1 AND tenant_id=$2 AND active=true',[x.serviceId,s.tenantId])).rows[0];
        if(!service){await client.query('ROLLBACK');return res.status(400).json({error:'Serviço inválido.'});}
        const professional=(await client.query('SELECT id FROM professionals WHERE id=$1 AND tenant_id=$2 AND active=true',[x.professionalId,s.tenantId])).rows[0];
        if(!professional){await client.query('ROLLBACK');return res.status(400).json({error:'Profissional inválido.'});}
        if((tenant.off_days||[]).includes(x.date)){await client.query('ROLLBACK');return res.status(409).json({error:'A barbearia não atende nesta data.'});}
        const weekday=weekdayForDate(x.date,tenant.timezone);
        const hours=(await client.query('SELECT start_time,end_time,break_start,break_end,active FROM professional_working_hours WHERE tenant_id=$1 AND professional_id=$2 AND weekday=$3',[s.tenantId,x.professionalId,weekday])).rows[0];
        if(hours&&hours.active===false){await client.query('ROLLBACK');return res.status(409).json({error:'Profissional não atende nesta data.'});}
        const openTime=String(hours?.start_time||tenant.open_time).slice(0,5),closeTime=String(hours?.end_time||tenant.close_time).slice(0,5);
        const openMinutes=toMinutes(openTime),requestedMinutes=toMinutes(x.time),endMinutes=requestedMinutes+Number(service.duration),interval=Math.max(5,Number(tenant.booking_interval)||30);
        if((requestedMinutes-openMinutes)%interval!==0){await client.query('ROLLBACK');return res.status(409).json({error:'Horário fora dos intervalos permitidos pela agenda.'});}
        if(isPastLocalSlot(x.date,x.time,tenant.timezone)){await client.query('ROLLBACK');return res.status(409).json({error:'Não é possível agendar um horário que já passou.'});}
        if(requestedMinutes<openMinutes||endMinutes>toMinutes(closeTime)){await client.query('ROLLBACK');return res.status(409).json({error:'Horário fora da jornada do profissional.'});}
        if(hours?.break_start&&hours?.break_end&&requestedMinutes<toMinutes(hours.break_end)&&endMinutes>toMinutes(hours.break_start)){await client.query('ROLLBACK');return res.status(409).json({error:'Horário coincide com o intervalo do profissional.'});}
        const slotStart=localDateTimeToUtc(x.date,x.time,tenant.timezone),slotEnd=new Date(slotStart.getTime()+Number(service.duration)*60000);
        const blocked=await client.query('SELECT id FROM professional_time_off WHERE tenant_id=$1 AND professional_id=$2 AND starts_at<$4 AND ends_at>$3 LIMIT 1',[s.tenantId,x.professionalId,slotStart,slotEnd]);
        if(blocked.rowCount){await client.query('ROLLBACK');return res.status(409).json({error:'Profissional indisponível neste período.'});}
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[String(s.tenantId)+':'+String(x.professionalId)+':'+String(x.date)]);
        const conflict=await client.query(`SELECT id FROM bookings WHERE tenant_id=$1 AND professional_id=$2 AND date=$3 AND status IN ('pending','confirmed','in_progress') AND time < $4::time + ($5||' minutes')::interval AND time + (duration||' minutes')::interval > $4::time LIMIT 1`,[s.tenantId,x.professionalId,x.date,x.time,service.duration]);
        if(conflict.rowCount){await client.query('ROLLBACK');return res.status(409).json({error:'Este horário já está ocupado.'});}
        const userId=currentRole==='admin'&&x.userId?x.userId:s.userId;
        const user=(await client.query("SELECT id FROM users WHERE id=$1 AND tenant_id=$2 AND role='client'",[userId,s.tenantId])).rows[0];
        if(!user){await client.query('ROLLBACK');return res.status(400).json({error:'Cliente inválido.'});}
        const r=await client.query(`INSERT INTO bookings(tenant_id,user_id,professional_id,service_id,service_price,duration,date,time,status,payment_method,observation) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'pending',null,$9) RETURNING id`,[s.tenantId,userId,x.professionalId,x.serviceId,service.price,service.duration,x.date,x.time,x.observation||null]);
        await client.query('COMMIT'); return res.status(201).json({id:r.rows[0].id});
      }catch(e){await client.query('ROLLBACK');throw e}finally{client.release();}
    }
    if(req.method==='PATCH'){
      const x=req.body||{}; const allowed=['pending','confirmed','in_progress','finished','cancelled'];
      if(x.status&&!allowed.includes(x.status))return res.status(400).json({error:'Status inválido.'});
      const client=await db().connect();
      try{
        await client.query('BEGIN');
        const before=(await client.query(`SELECT b.id,b.user_id,b.date,b.time,b.status,b.rating_stars,t.cancellation_hours,t.timezone,t.loyalty_enabled FROM bookings b JOIN tenants t ON t.id=b.tenant_id WHERE b.id=$1 AND b.tenant_id=$2 AND (b.user_id=$3 OR $4='admin' OR ($4='barber' AND b.professional_id=(SELECT id FROM professionals WHERE tenant_id=$2 AND user_id=$3 LIMIT 1))) FOR UPDATE`,[x.id,s.tenantId,s.userId,currentRole])).rows[0];
        if(!before){await client.query('ROLLBACK');return res.status(404).json({error:'Agendamento não encontrado.'});}
        if(x.status && x.status!==before.status){
          const transitions:Record<string,string[]>={pending:['confirmed','cancelled'],confirmed:['in_progress','cancelled'],in_progress:['finished'],finished:[],cancelled:[]};
          if(!(transitions[before.status]||[]).includes(x.status)){await client.query('ROLLBACK');return res.status(409).json({error:`Transição inválida: ${before.status} → ${x.status}.`});}
        }
        if(currentRole==='client' && x.status==='cancelled' && before.status==='finished'){await client.query('ROLLBACK');return res.status(409).json({error:'Atendimento finalizado não pode ser cancelado.'});}
        if(currentRole==='client' && x.status==='cancelled' && Number(before.cancellation_hours)>0){const start=localDateTimeToUtc(String(before.date).slice(0,10),String(before.time).slice(0,5),before.timezone);if(start.getTime()-Date.now()<Number(before.cancellation_hours)*3600000){await client.query('ROLLBACK');return res.status(409).json({error:`Cancelamento permitido até ${before.cancellation_hours}h antes do horário.`});}}
        if(currentRole==='client' && x.status && x.status!==before.status && x.status!=='cancelled') {await client.query('ROLLBACK');return res.status(403).json({error:'Cliente só pode cancelar o próprio agendamento.'});}
        if(x.paymentMethod!==undefined && !['money','pix','debit','credit',null].includes(x.paymentMethod)){await client.query('ROLLBACK');return res.status(400).json({error:'Forma de pagamento inválida.'});}
        if(currentRole==='client' && (x.paymentMethod!==undefined || x.observation!==undefined)) {await client.query('ROLLBACK');return res.status(403).json({error:'Alteração restrita ao administrador.'});}
        if(x.ratingStars!==undefined && (!Number.isInteger(x.ratingStars)||x.ratingStars<1||x.ratingStars>5)){await client.query('ROLLBACK');return res.status(400).json({error:'Avaliação deve ter entre 1 e 5 estrelas.'});}
        if(x.ratingStars!==undefined && currentRole!=='client'){await client.query('ROLLBACK');return res.status(403).json({error:'A avaliação pertence ao cliente.'});}
        if(x.ratingStars!==undefined && before.rating_stars){await client.query('ROLLBACK');return res.status(409).json({error:'Este atendimento já foi avaliado.'});}
        if(currentRole==='client' && x.ratingStars!==undefined && before.status!=='finished'){await client.query('ROLLBACK');return res.status(409).json({error:'Só é possível avaliar um atendimento finalizado.'});}
        const r=await client.query(`UPDATE bookings SET status=COALESCE($1,status),payment_method=COALESCE($2,payment_method),observation=COALESCE($3,observation),rating_stars=COALESCE($4,rating_stars),rating_comment=COALESCE($5,rating_comment),rating_date=CASE WHEN $4 IS NOT NULL THEN now() ELSE rating_date END,updated_at=now() WHERE id=$6 RETURNING *`,[x.status||null,x.paymentMethod??null,x.observation??null,x.ratingStars??null,x.ratingComment??null,x.id]);
        if(x.status==='finished'&&before.status!=='finished'&&before.loyalty_enabled===true) await client.query(`UPDATE users SET loyalty_points=COALESCE(loyalty_points,0)+1,last_visit=$1 WHERE id=$2 AND tenant_id=$3`,[before.date,before.user_id,s.tenantId]);
        await client.query('COMMIT'); return res.json({ok:true,booking:r.rows[0]});
      }catch(e){await client.query('ROLLBACK');throw e}finally{client.release();}
    }
    return res.status(405).end();
  }catch(e:any){return res.status(500).json({error:e.message||'Erro interno.'});}
}
