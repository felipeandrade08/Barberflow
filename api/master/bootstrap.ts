import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {hashPassword,signToken,setSession} from '../_lib/auth';

export default async function handler(req:VercelRequest,res:VercelResponse){
  if(req.method!=='POST')return res.status(405).end();
  const bootstrapSecret=process.env.MASTER_BOOTSTRAP_SECRET;
  if(!bootstrapSecret||bootstrapSecret.length<32||req.headers['x-bootstrap-secret']!==bootstrapSecret)
    return res.status(403).json({error:'Bootstrap não autorizado.'});
  const {name,email,password}=req.body||{};
  if(!name||!email||!password||password.length<8)
    return res.status(400).json({error:'Nome, e-mail e senha (8+) são obrigatórios.'});
  const c=await db().connect();
  try{
    await c.query('BEGIN');
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',['barberflow:platform-bootstrap']);
    const existing=(await c.query("SELECT id FROM users WHERE role='platform_admin' LIMIT 1")).rows[0];
    if(existing){await c.query('ROLLBACK');return res.status(409).json({error:'Bootstrap já concluído.'});}
    const t=(await c.query(`INSERT INTO tenants(slug,name,email,subscription_status) VALUES('platform','BarberFlow Platform',$1,'active') ON CONFLICT(slug) DO UPDATE SET email=COALESCE(tenants.email,EXCLUDED.email) RETURNING id`,[email])).rows[0];
    const u=(await c.query(`INSERT INTO users(tenant_id,name,email,password_hash,role) VALUES($1,$2,$3,$4,'platform_admin') RETURNING id,name,email,role,tenant_id`,[t.id,name,email,hashPassword(password)])).rows[0];
    await c.query('COMMIT');
    setSession(res,signToken({userId:u.id,tenantId:t.id,role:u.role}));
    return res.status(201).json({user:u});
  }catch(e){
    await c.query('ROLLBACK');
    console.error('Master bootstrap failed',e);
    return res.status(500).json({error:'Não foi possível inicializar a conta master.'});
  }finally{c.release();}
}
