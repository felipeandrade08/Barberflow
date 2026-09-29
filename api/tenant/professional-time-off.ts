import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';
import {localDateTimeToUtc} from '../_lib/scheduling';
export default async function handler(req:VercelRequest,res:VercelResponse){
 const s=requireSession(req,res);if(!s)return;
 if(s.role!=='admin')return res.status(403).json({error:'Acesso restrito ao administrador.'});
 if(req.method!=='POST')return res.status(405).end();
 const x=req.body||{};
 if(!x.professionalId||!/^\d{4}-\d{2}-\d{2}$/.test(String(x.date||''))||!/^\d{2}:\d{2}$/.test(String(x.startTime||''))||!/^\d{2}:\d{2}$/.test(String(x.endTime||''))||x.startTime>=x.endTime)return res.status(400).json({error:'Data e período válidos são obrigatórios.'});
 try{
  const tenant=(await db().query('SELECT timezone FROM tenants WHERE id=$1',[s.tenantId])).rows[0];
  const pro=(await db().query('SELECT id FROM professionals WHERE id=$1 AND tenant_id=$2',[x.professionalId,s.tenantId])).rows[0];
  if(!tenant||!pro)return res.status(404).json({error:'Profissional não encontrado.'});
  const starts=localDateTimeToUtc(x.date,x.startTime,tenant.timezone),ends=localDateTimeToUtc(x.date,x.endTime,tenant.timezone);
  const r=await db().query(`INSERT INTO professional_time_off(tenant_id,professional_id,starts_at,ends_at,reason) VALUES($1,$2,$3,$4,$5) RETURNING id,starts_at "startsAt",ends_at "endsAt",reason`,[s.tenantId,x.professionalId,starts,ends,x.reason?.trim()||null]);
  return res.status(201).json(r.rows[0]);
 }catch(e){console.error('Professional time off failed',e);return res.status(500).json({error:'Não foi possível criar o bloqueio.'});}
}
