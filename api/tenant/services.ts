import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireRole} from '../_lib/authorization';

const valid=(x:any)=>typeof x?.name==='string'&&x.name.trim().length>=2&&Number.isFinite(Number(x.price))&&Number(x.price)>=0&&Number.isInteger(Number(x.duration))&&Number(x.duration)>=5&&Number(x.duration)<=480;
const cleanItems=(v:any)=>Array.isArray(v)?v.map((x:any)=>String(x).trim()).filter(Boolean).slice(0,20):[];

export default async function handler(req:VercelRequest,res:VercelResponse){
  const session=await requireRole(req,res,['admin']);if(!session)return;
  try{
    if(req.method==='POST'){
      const x=req.body||{};if(!valid(x))return res.status(400).json({error:'Nome, preço e duração do serviço são inválidos.'});
      const items=cleanItems(x.comboItems),isCombo=x.isCombo===true;
      if(isCombo&&items.length<2)return res.status(400).json({error:'Um combo precisa ter pelo menos dois itens.'});
      const r=await db().query(`INSERT INTO services(tenant_id,name,price,duration,description,image,category,is_combo,combo_items,active) VALUES($1,$2,$3,$4,$5,NULL,$6,$7,$8,$9) RETURNING id,name,price,duration,description,category,is_combo "isCombo",combo_items "comboItems",active`,[session.tenantId,x.name.trim(),Number(x.price),Number(x.duration),x.description?.trim()||null,String(x.category||'Outros').trim().slice(0,80)||'Outros',isCombo,isCombo?items:[],x.active!==false]);
      return res.status(201).json(r.rows[0]);
    }
    if(req.method==='PUT'){
      const x=req.body||{};if(!x.id)return res.status(400).json({error:'Serviço obrigatório.'});
      const current=(await db().query('SELECT id,name,price,duration,description,category,is_combo "isCombo",combo_items "comboItems",active FROM services WHERE id=$1 AND tenant_id=$2',[x.id,session.tenantId])).rows[0];
      if(!current)return res.status(404).json({error:'Serviço não encontrado.'});
      const merged={...current,...x};if(!valid(merged))return res.status(400).json({error:'Nome, preço e duração do serviço são inválidos.'});
      const items=cleanItems(merged.comboItems),isCombo=merged.isCombo===true;
      if(isCombo&&items.length<2)return res.status(400).json({error:'Um combo precisa ter pelo menos dois itens.'});
      const r=await db().query(`UPDATE services SET name=$1,price=$2,duration=$3,description=$4,image=NULL,category=$5,is_combo=$6,combo_items=$7,active=$8,updated_at=now() WHERE id=$9 AND tenant_id=$10 RETURNING id,name,price,duration,description,category,is_combo "isCombo",combo_items "comboItems",active`,[merged.name.trim(),Number(merged.price),Number(merged.duration),merged.description?.trim()||null,String(merged.category||'Outros').trim().slice(0,80)||'Outros',isCombo,isCombo?items:[],merged.active!==false,x.id,session.tenantId]);
      return res.json(r.rows[0]);
    }
    return res.status(405).end();
  }catch{return res.status(500).json({error:'Não foi possível salvar o serviço.'});}
}
