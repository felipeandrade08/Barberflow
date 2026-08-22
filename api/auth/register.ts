import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { hashPassword, signToken, setSession } from '../_lib/auth';
import { method, json } from '../_lib/http';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req,res,['POST'])) return;
  const client = await db().connect();
  try {
    const { name,email,phone,password,slug } = req.body || {};
    if (!name || !email || !password || password.length < 6 || !slug) return json(res,400,{error:'Dados inválidos.'});
    const tenant = (await client.query('SELECT id,name,slug FROM tenants WHERE slug=$1 AND deleted_at IS NULL',[slug])).rows[0];
    if (!tenant) return json(res,404,{error:'Barbearia não encontrada.'});
    const exists = await client.query('SELECT id FROM users WHERE tenant_id=$1 AND lower(email)=lower($2)',[tenant.id,email]);
    if (exists.rowCount) return json(res,409,{error:'Este e-mail já está cadastrado.'});
    const user = (await client.query(`INSERT INTO users(tenant_id,name,email,phone,password_hash,role) VALUES($1,$2,$3,$4,$5,'client') RETURNING id,name,email,phone,role,tenant_id`,[tenant.id,name.trim(),email.trim(),phone || null,hashPassword(password)])).rows[0];
    setSession(res,signToken({userId:user.id,tenantId:tenant.id,role:user.role}));
    return json(res,201,{user});
  } catch(e:any) { return json(res,500,{error:e.message || 'Erro interno.'}); } finally { client.release(); }
}
