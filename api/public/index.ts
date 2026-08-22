import type { VercelRequest,VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
export default async function handler(req:VercelRequest,res:VercelResponse){
  const slug=String(req.query.slug||'').trim();
  if(!slug) return res.status(400).json({error:'Slug obrigatório.'});
  try{
    const t=(await db().query(`SELECT id,slug,name,phone,whatsapp,email,address,description,instagram,logo_url,open_time,close_time,booking_interval,cancellation_hours,off_days,theme,qr_color,qr_content,subscription_status FROM tenants WHERE slug=$1 AND deleted_at IS NULL`,[slug])).rows[0];
    if(!t)return res.status(404).json({error:'Barbearia não encontrada.'});
    const [services,pros]=await Promise.all([
      db().query(`SELECT id,name,price,duration,description,image,active FROM services WHERE tenant_id=$1 AND active=true ORDER BY name`,[t.id]),
      db().query(`SELECT id,name,role,avatar,specialty,active FROM professionals WHERE tenant_id=$1 AND active=true ORDER BY name`,[t.id])
    ]);
    return res.json({tenant:t,services:services.rows,professionals:pros.rows});
  }catch(e:any){return res.status(500).json({error:e.message});}
}
