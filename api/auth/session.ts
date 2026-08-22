import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { session, clearSession } from '../_lib/auth';
export default async function handler(req: VercelRequest,res:VercelResponse){
  if(req.method!=='GET'){res.status(405).end();return;}
  const s=session(req); if(!s){res.status(401).json({error:'Não autenticado.'});return;}
  try { const row=(await db().query(`SELECT u.id,u.name,u.email,u.phone,u.role,u.tenant_id,t.slug,t.name tenant_name,t.phone tenant_phone,t.whatsapp,t.email tenant_email,t.address,t.description,t.instagram,t.logo_url,t.open_time,t.close_time,t.booking_interval,t.cancellation_hours,t.off_days,t.theme,t.qr_color,t.qr_content,t.subscription_status FROM users u LEFT JOIN tenants t ON t.id=u.tenant_id WHERE u.id=$1`,[s.userId])).rows[0]; if(!row){clearSession(res);return res.status(401).json({error:'Sessão inválida.'});} return res.json({user:row}); } catch(e:any){return res.status(500).json({error:e.message});}
}
