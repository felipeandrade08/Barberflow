import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';

export default async function handler(req:VercelRequest,res:VercelResponse){
 const s=requireSession(req,res);if(!s)return;
 if(s.role!=='admin')return res.status(403).json({error:'Acesso restrito ao administrador.'});
 try{
  const x=req.body||{};
  if(req.method==='POST'){
   if(!x.name?.trim())return res.status(400).json({error:'Nome do profissional é obrigatório.'});
   const r=await db().query(`INSERT INTO professionals(tenant_id,name,role,avatar,specialty,active) VALUES($1,$2,$3,$4,$5,true) RETURNING id,name,role,avatar,specialty,active`,[s.tenantId,x.name.trim(),x.role?.trim()||'Barbeiro',x.avatar?.trim()||null,x.specialty?.trim()||null]);
   return res.status(201).json(r.rows[0]);
  }
  if(req.method==='PUT'){
   if(!x.id)return res.status(400).json({error:'Profissional obrigatório.'});
   const current=(await db().query('SELECT * FROM professionals WHERE id=$1 AND tenant_id=$2',[x.id,s.tenantId])).rows[0];
   if(!current)return res.status(404).json({error:'Profissional não encontrado.'});
   const name=(x.name??current.name)?.trim();if(!name)return res.status(400).json({error:'Nome do profissional é obrigatório.'});
   const r=await db().query(`UPDATE professionals SET name=$1,role=$2,avatar=$3,specialty=$4,active=$5 WHERE id=$6 AND tenant_id=$7 RETURNING id,name,role,avatar,specialty,active`,[name,(x.role??current.role)||'Barbeiro',x.avatar??current.avatar,x.specialty??current.specialty,x.active??current.active,x.id,s.tenantId]);
   return res.json(r.rows[0]);
  }
  return res.status(405).end();
 }catch(e){console.error('Professionals API failed',e);return res.status(500).json({error:'Não foi possível atualizar os profissionais.'});}
}
