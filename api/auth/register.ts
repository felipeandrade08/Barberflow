import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { hashPassword, signToken, setSession } from '../_lib/auth';
import { method, json } from '../_lib/http';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req,res,['POST'])) return;
  const client = await db().connect();
  try {
    const { name,email,phone,password,slug } = req.body || {};
    if (typeof name!=='string'||name.trim().length<2||typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email.trim())||typeof password!=='string'||password.length<8||!slug) return json(res,400,{error:'Dados inválidos.'});
    const tenant = (await client.query('SELECT id,name,slug,subscription_status FROM tenants WHERE slug=$1 AND deleted_at IS NULL',[slug])).rows[0];
    if (!tenant) return json(res,404,{error:'Barbearia não encontrada.'});
    if (!['active','trialing'].includes(tenant.subscription_status)) return json(res,403,{error:'Cadastro temporariamente indisponível para esta barbearia.'});
    const exists = await client.query('SELECT id FROM users WHERE tenant_id=$1 AND lower(email)=lower($2)',[tenant.id,email.trim()]);
    if (exists.rowCount) return json(res,409,{error:'Este e-mail já está cadastrado.'});
    const user = (await client.query(`INSERT INTO users(tenant_id,name,email,phone,password_hash,role) VALUES($1,$2,$3,$4,$5,'client') RETURNING id,name,email,phone,role,tenant_id`,[tenant.id,name.trim(),email.trim().toLowerCase(),typeof phone==='string'&&phone.trim()?phone.trim():null,hashPassword(password)])).rows[0];
    setSession(res,signToken({userId:user.id,tenantId:tenant.id,role:user.role}));
    return json(res,201,{user});
  } catch(e:any) { if(e?.code==='23505')return json(res,409,{error:'Este e-mail já está cadastrado.'}); return json(res,500,{error:e.message || 'Erro interno.'}); } finally { client.release(); }
}
