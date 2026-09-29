import type { VercelRequest,VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { requireSession } from '../_lib/auth';
export default async function handler(req:VercelRequest,res:VercelResponse){
  const s=requireSession(req,res); if(!s)return;
  const role=(await db().query('SELECT role FROM users WHERE id=$1 AND tenant_id=$2',[s.userId,s.tenantId])).rows[0]?.role;if(!role)return res.status(401).json({error:'Sessão inválida.'});
  try{
    if(req.method==='GET'){
      const [u,services,pros,bookings,users]=await Promise.all([
        db().query(`SELECT u.id,u.name,u.email,u.phone,u.role,u.tenant_id,(SELECT p.id FROM professionals p WHERE p.user_id=u.id AND p.tenant_id=u.tenant_id LIMIT 1) professional_id,t.slug,t.name tenant_name,t.phone tenant_phone,t.whatsapp,t.email tenant_email,t.address,t.description,t.instagram,t.logo_url,t.cover_url,t.open_time,t.close_time,t.booking_interval,t.cancellation_hours,t.off_days,t.theme,t.qr_color,t.qr_content,t.subscription_status,t.timezone,t.loyalty_enabled,t.loyalty_target,t.loyalty_reward FROM users u JOIN tenants t ON t.id=u.tenant_id WHERE u.id=$1`,[s.userId]),
        db().query(`SELECT id,name,price,duration,description,category,is_combo \"isCombo\",combo_items \"comboItems\",active FROM services WHERE tenant_id=$1 ORDER BY name`,[s.tenantId]),
        db().query(`SELECT p.id,p.name,p.role,p.avatar,p.specialty,p.active,p.user_id \"userId\",COALESCE((SELECT json_agg(json_build_object('weekday',h.weekday,'startTime',to_char(h.start_time,'HH24:MI'),'endTime',to_char(h.end_time,'HH24:MI'),'breakStart',CASE WHEN h.break_start IS NULL THEN NULL ELSE to_char(h.break_start,'HH24:MI') END,'breakEnd',CASE WHEN h.break_end IS NULL THEN NULL ELSE to_char(h.break_end,'HH24:MI') END,'active',h.active) ORDER BY h.weekday) FROM professional_working_hours h WHERE h.professional_id=p.id),'[]'::json) "workingHours",COALESCE((SELECT json_agg(json_build_object('id',o.id,'startsAt',o.starts_at,'endsAt',o.ends_at,'reason',o.reason) ORDER BY o.starts_at) FROM professional_time_off o WHERE o.professional_id=p.id AND o.ends_at>now()),'[]'::json) "timeOff" FROM professionals p WHERE p.tenant_id=$1 ORDER BY p.name`,[s.tenantId]),
        db().query(`SELECT b.id,b.user_id "userId",u.name "userName",b.professional_id "professionalId",p.name "professionalName",b.service_id "serviceId",sv.name "serviceName",b.service_price "servicePrice",b.duration,b.date,b.time,b.status,b.payment_method "paymentMethod",b.observation,b.created_at "createdAt",b.rating_stars,b.rating_comment,b.rating_date FROM bookings b JOIN users u ON u.id=b.user_id JOIN professionals p ON p.id=b.professional_id JOIN services sv ON sv.id=b.service_id WHERE b.tenant_id=$1 ORDER BY b.date DESC,b.time DESC`,[s.tenantId]),
        role==='admin' ? db().query(`SELECT id,name,email,phone,role,loyalty_points "loyaltyPoints",created_at "createdAt",last_visit "lastVisit" FROM users WHERE tenant_id=$1 ORDER BY name`,[s.tenantId]) : Promise.resolve({rows:[]})
      ]);
      if(!u.rows[0]) return res.status(401).json({error:'Usuário não encontrado.'});
      const row=u.rows[0]; const userRow=(await db().query(`SELECT loyalty_points "loyaltyPoints",last_visit "lastVisit" FROM users WHERE id=$1`,[s.userId])).rows[0]||{};
      const user={id:row.id,name:row.name,email:row.email,phone:row.phone,role:row.role,tenant_id:row.tenant_id,professionalId:row.professional_id||undefined,...userRow};
      const settings={name:row.tenant_name,phone:row.tenant_phone||'',whatsapp:row.whatsapp||'',email:row.tenant_email||'',address:row.address||'',description:row.description||'',instagram:row.instagram||'',logoUrl:row.logo_url||'',coverUrl:row.cover_url||'',openTime:row.open_time,closeTime:row.close_time,bookingInterval:row.booking_interval,cancellationHours:row.cancellation_hours,offDays:row.off_days||[],theme:row.theme||'dark',qrColor:row.qr_color||'#0f172a',qrContent:row.qr_content||'',subscriptionStatus:row.subscription_status,timezone:row.timezone||'America/Sao_Paulo',loyaltyEnabled:row.loyalty_enabled===true,loyaltyTarget:Number(row.loyalty_target)||10,loyaltyReward:row.loyalty_reward||''};
      const mappedBookings=bookings.rows.map((b:any)=>({...b,rating:b.rating_stars?{stars:b.rating_stars,comment:b.rating_comment||'',date:b.rating_date}:undefined}));
      return res.json({currentUser:user,users:users.rows,services:services.rows,professionals:pros.rows,bookings:role==='admin'?mappedBookings:role==='barber'?mappedBookings.filter((b:any)=>b.professionalId===row.professional_id):mappedBookings.filter((b:any)=>b.userId===s.userId),settings});
    }
    if(req.method==='PUT' && req.body?.kind==='settings'){
      if(role!=='admin')return res.status(403).json({error:'Acesso restrito ao administrador.'});
      const x=req.body.settings||{};
      const interval=Number(x.bookingInterval),cancelHours=Number(x.cancellationHours);
      if(!x.name?.trim()||!/^\d{2}:\d{2}$/.test(x.openTime||'')||!/^\d{2}:\d{2}$/.test(x.closeTime||'')||x.openTime>=x.closeTime)return res.status(400).json({error:'Nome e horário de funcionamento válidos são obrigatórios.'});
      if(![15,30,60].includes(interval)||![0,2,6,24].includes(cancelHours))return res.status(400).json({error:'Regras de agenda inválidas.'});
      if(!Array.isArray(x.offDays)||x.offDays.some((d:any)=>!/^\d{4}-\d{2}-\d{2}$/.test(String(d))))return res.status(400).json({error:'Datas de ausência inválidas.'});
      await db().query(`UPDATE tenants SET name=$1,phone=$2,whatsapp=$3,email=$4,address=$5,description=$6,instagram=$7,logo_url=$8,cover_url=$9,open_time=$10,close_time=$11,booking_interval=$12,cancellation_hours=$13,off_days=$14,theme=$15,qr_color=$16,qr_content=$17,timezone=$18,loyalty_enabled=$19,loyalty_target=$20,loyalty_reward=$21,updated_at=now() WHERE id=$22`,[x.name,x.phone,x.whatsapp,x.email,x.address,x.description,x.instagram,x.logoUrl||null,x.coverUrl||null,x.openTime,x.closeTime,x.bookingInterval,x.cancellationHours,x.offDays||[],x.theme||'dark',x.qrColor||'#0f172a',x.qrContent||'',x.timezone||'America/Sao_Paulo',x.loyaltyEnabled===true,Math.min(100,Math.max(1,Number(x.loyaltyTarget)||10)),x.loyaltyReward?.trim()||null,s.tenantId]);
      return res.json({ok:true});
    }
    return res.status(405).json({error:'Método não permitido.'});
  }catch(e:any){return res.status(500).json({error:e.message||'Erro interno.'});}
}
