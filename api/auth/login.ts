import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { verifyPassword, signToken, setSession } from '../_lib/auth';
import { method, json } from '../_lib/http';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req,res,['POST'])) return;
  try {
    const { email, password, slug } = req.body || {};
    const result = await db().query(`SELECT u.id,u.tenant_id,u.name,u.email,u.phone,u.role,u.password_hash,t.slug,t.name tenant_name,t.phone tenant_phone,t.whatsapp,t.email tenant_email,t.address,t.description,t.instagram,t.logo_url,t.open_time,t.close_time,t.booking_interval,t.cancellation_hours,t.off_days,t.theme,t.qr_color,t.qr_content,t.subscription_status FROM users u JOIN tenants t ON t.id=u.tenant_id WHERE lower(u.email)=lower($1) AND ($2='' OR t.slug=$2) AND t.deleted_at IS NULL LIMIT 1`, [email, slug || '']);
    const row = result.rows[0];
    if (!row || !verifyPassword(password || '', row.password_hash)) return json(res,401,{error:'E-mail ou senha incorretos.'});
    const token = signToken({ userId: row.id, tenantId: row.tenant_id, role: row.role }); setSession(res,token);
    delete row.password_hash;
    return json(res,200,{user:row});
  } catch (e:any) { return json(res,500,{error:e.message || 'Erro interno.'}); }
}
