import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';

export default async function handler(req:VercelRequest,res:VercelResponse){
  const s=requireSession(req,res); if(!s)return;
  try{
    if(req.method==='POST'){
      const x=req.body||{};
      if(!x.serviceId||!x.professionalId||!x.date||!x.time) return res.status(400).json({error:'Serviço, profissional, data e horário são obrigatórios.'});
      const client=await db().connect();
      try{
        await client.query('BEGIN');
        const service=(await client.query('SELECT id,name,price,duration FROM services WHERE id=$1 AND tenant_id=$2 AND active=true',[x.serviceId,s.tenantId])).rows[0];
        if(!service){await client.query('ROLLBACK');return res.status(400).json({error:'Serviço inválido.'});}
        const professional=(await client.query('SELECT id FROM professionals WHERE id=$1 AND tenant_id=$2 AND active=true',[x.professionalId,s.tenantId])).rows[0];
        if(!professional){await client.query('ROLLBACK');return res.status(400).json({error:'Profissional inválido.'});}
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[String(s.tenantId)+':'+String(x.professionalId)+':'+String(x.date)]);
        const conflict=await client.query(`SELECT id FROM bookings WHERE tenant_id=$1 AND professional_id=$2 AND date=$3 AND status IN ('pending','confirmed') AND time < $4::time + ($5||' minutes')::interval AND time + (duration||' minutes')::interval > $4::time LIMIT 1`,[s.tenantId,x.professionalId,x.date,x.time,service.duration]);
        if(conflict.rowCount){await client.query('ROLLBACK');return res.status(409).json({error:'Este horário já está ocupado.'});}
        const userId=s.role==='admin'&&x.userId?x.userId:s.userId;
        const user=(await client.query('SELECT id FROM users WHERE id=$1 AND tenant_id=$2',[userId,s.tenantId])).rows[0];
        if(!user){await client.query('ROLLBACK');return res.status(400).json({error:'Cliente inválido.'});}
        const r=await client.query(`INSERT INTO bookings(tenant_id,user_id,professional_id,service_id,service_price,duration,date,time,status,payment_method,observation) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'pending',null,$9) RETURNING id`,[s.tenantId,userId,x.professionalId,x.serviceId,service.price,service.duration,x.date,x.time,x.observation||null]);
        await client.query('COMMIT'); return res.status(201).json({id:r.rows[0].id});
      }catch(e){await client.query('ROLLBACK');throw e}finally{client.release();}
    }
    if(req.method==='PATCH'){
      const x=req.body||{}; const allowed=['pending','confirmed','finished','cancelled'];
      if(x.status&&!allowed.includes(x.status))return res.status(400).json({error:'Status inválido.'});
      const client=await db().connect();
      try{
        await client.query('BEGIN');
        const before=(await client.query(`SELECT id,user_id,date,status FROM bookings WHERE id=$1 AND tenant_id=$2 AND (user_id=$3 OR $4='admin') FOR UPDATE`,[x.id,s.tenantId,s.userId,s.role])).rows[0];
        if(!before){await client.query('ROLLBACK');return res.status(404).json({error:'Agendamento não encontrado.'});}
        if(s.role!=='admin' && x.status && x.status!=='cancelled') {await client.query('ROLLBACK');return res.status(403).json({error:'Cliente só pode cancelar o próprio agendamento.'});}
        if(s.role!=='admin' && (x.paymentMethod!==undefined || x.observation!==undefined)) {await client.query('ROLLBACK');return res.status(403).json({error:'Alteração restrita ao administrador.'});}
        const r=await client.query(`UPDATE bookings SET status=COALESCE($1,status),payment_method=COALESCE($2,payment_method),observation=COALESCE($3,observation),rating_stars=COALESCE($4,rating_stars),rating_comment=COALESCE($5,rating_comment),rating_date=CASE WHEN $4 IS NOT NULL THEN now() ELSE rating_date END,updated_at=now() WHERE id=$6 RETURNING *`,[x.status||null,x.paymentMethod??null,x.observation??null,x.ratingStars??null,x.ratingComment??null,x.id]);
        if(x.status==='finished'&&before.status!=='finished') await client.query(`UPDATE users SET loyalty_points=COALESCE(loyalty_points,0)+1,last_visit=$1 WHERE id=$2 AND tenant_id=$3`,[before.date,before.user_id,s.tenantId]);
        await client.query('COMMIT'); return res.json({ok:true,booking:r.rows[0]});
      }catch(e){await client.query('ROLLBACK');throw e}finally{client.release();}
    }
    return res.status(405).end();
  }catch(e:any){return res.status(500).json({error:e.message||'Erro interno.'});}
}
