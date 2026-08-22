import type { VercelRequest,VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { requireSession } from '../_lib/auth';
export default async function handler(req:VercelRequest,res:VercelResponse){
  const s=requireSession(req,res); if(!s)return;
  try{
    if(req.method==='GET'){
      const [u,services,pros,bookings,users]=await Promise.all([
        db().query(`SELECT u.id,u.name,u.email,u.phone,u.role,u.tenant_id,t.slug,t.name tenant_name,t.phone tenant_phone,t.whatsapp,t.email tenant_email,t.address,t.description,t.instagram,t.logo_url,t.open_time,t.close_time,t.booking_interval,t.cancellation_hours,t.off_days,t.theme,t.qr_color,t.qr_content,t.subscription_status FROM users u JOIN tenants t ON t.id=u.tenant_id WHERE u.id=$1`,[s.userId]),
        db().query(`SELECT id,name,price,duration,description,image,active FROM services WHERE tenant_id=$1 ORDER BY name`,[s.tenantId]),
        db().query(`SELECT id,name,role,avatar,specialty,active FROM professionals WHERE tenant_id=$1 ORDER BY name`,[s.tenantId]),
        db().query(`SELECT b.id,b.user_id "userId",u.name "userName",b.professional_id "professionalId",p.name "professionalName",b.service_id "serviceId",sv.name "serviceName",b.service_price "servicePrice",b.duration,b.date,b.time,b.status,b.payment_method "paymentMethod",b.observation,b.created_at "createdAt",b.rating_stars,b.rating_comment,b.rating_date FROM bookings b JOIN users u ON u.id=b.user_id JOIN professionals p ON p.id=b.professional_id JOIN services sv ON sv.id=b.service_id WHERE b.tenant_id=$1 ORDER BY b.date DESC,b.time DESC`,[s.tenantId]),
        db().query(`SELECT id,name,email,phone,role,loyalty_points "loyaltyPoints",created_at "createdAt",last_visit "lastVisit" FROM users WHERE tenant_id=$1 ORDER BY name`,[s.tenantId])
      ]);
      if(!u.rows[0]) return res.status(401).json({error:'Usuário não encontrado.'});
      const row=u.rows[0]; const user={id:row.id,name:row.name,email:row.email,phone:row.phone,role:row.role,tenant_id:row.tenant_id};
      const settings={name:row.tenant_name,phone:row.tenant_phone||'',whatsapp:row.whatsapp||'',email:row.tenant_email||'',address:row.address||'',description:row.description||'',instagram:row.instagram||'',logoUrl:row.logo_url||'',openTime:row.open_time,closeTime:row.close_time,bookingInterval:row.booking_interval,cancellationHours:row.cancellation_hours,offDays:row.off_days||[],theme:row.theme||'dark',qrColor:row.qr_color||'#0f172a',qrContent:row.qr_content||'',subscriptionStatus:row.subscription_status};
      const mappedBookings=bookings.rows.map((b:any)=>({...b,rating:b.rating_stars?{stars:b.rating_stars,comment:b.rating_comment||'',date:b.rating_date}:undefined}));
      return res.json({currentUser:user,users:users.rows,services:services.rows,professionals:pros.rows,bookings:mappedBookings,settings});
    }
    if(req.method==='PUT' && req.body?.kind==='settings'){
      if(s.role!=='admin')return res.status(403).json({error:'Acesso restrito ao administrador.'});
      const x=req.body.settings||{};
      await db().query(`UPDATE tenants SET name=$1,phone=$2,whatsapp=$3,email=$4,address=$5,description=$6,instagram=$7,logo_url=$8,open_time=$9,close_time=$10,booking_interval=$11,cancellation_hours=$12,off_days=$13,theme=$14,qr_color=$15,qr_content=$16,updated_at=now() WHERE id=$17`,[x.name,x.phone,x.whatsapp,x.email,x.address,x.description,x.instagram,x.logoUrl||null,x.openTime,x.closeTime,x.bookingInterval,x.cancellationHours,x.offDays||[],x.theme||'dark',x.qrColor||'#0f172a',x.qrContent||'',s.tenantId]);
      return res.json({ok:true});
    }
    return res.status(405).json({error:'Método não permitido.'});
  }catch(e:any){return res.status(500).json({error:e.message||'Erro interno.'});}
}
