import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';

const valid=(x:any)=>typeof x?.name==='string'&&x.name.trim().length>=2&&Number.isFinite(Number(x.price))&&Number(x.price)>=0&&Number.isInteger(Number(x.duration))&&Number(x.duration)>=5&&Number(x.duration)<=480;

export default async function handler(req:VercelRequest,res:VercelResponse){
  const session=requireSession(req,res);if(!session)return;
  if(session.role!=='admin')return res.status(403).json({error:'Acesso restrito.'});
  try{
    if(req.method==='POST'){
      const x=req.body||{};if(!valid(x))return res.status(400).json({error:'Nome, preço e duração do serviço são inválidos.'});
      const r=await db().query(`INSERT INTO services(tenant_id,name,price,duration,description,image,active) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[session.tenantId,x.name.trim(),Number(x.price),Number(x.duration),x.description||null,x.image||null,x.active!==false]);
      return res.status(201).json(r.rows[0]);
    }
    if(req.method==='PUT'){
      const x=req.body||{};if(!x.id)return res.status(400).json({error:'Serviço obrigatório.'});
      const current=(await db().query('SELECT * FROM services WHERE id=$1 AND tenant_id=$2',[x.id,session.tenantId])).rows[0];
      if(!current)return res.status(404).json({error:'Serviço não encontrado.'});
      const merged={...current,...x};if(!valid(merged))return res.status(400).json({error:'Nome, preço e duração do serviço são inválidos.'});
      const r=await db().query(`UPDATE services SET name=$1,price=$2,duration=$3,description=$4,image=$5,active=$6,updated_at=now() WHERE id=$7 AND tenant_id=$8 RETURNING *`,[merged.name.trim(),Number(merged.price),Number(merged.duration),merged.description||null,merged.image||null,merged.active!==false,x.id,session.tenantId]);
      return res.json(r.rows[0]);
    }
    return res.status(405).end();
  }catch{return res.status(500).json({error:'Não foi possível salvar o serviço.'});}
}
