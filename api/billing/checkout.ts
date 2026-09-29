import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireRole} from '../_lib/authorization';
import {mp} from '../_lib/mercadopago';
export default async function handler(req:VercelRequest,res:VercelResponse){
 const s=await requireRole(req,res,['admin']);if(!s)return;if(req.method!=='POST')return res.status(405).end();
 try{
  const t=(await db().query('SELECT id,name,email,billing_subscription_id,subscription_status FROM tenants WHERE id=$1 AND deleted_at IS NULL',[s.tenantId])).rows[0];
  if(!t)return res.status(404).json({error:'Barbearia não encontrada.'});
  if(t.billing_subscription_id&&['active','authorized','pending','paused'].includes(t.subscription_status))return res.status(409).json({error:'Já existe uma assinatura vinculada. Use a tela de assinatura para consultar o status.'});
  const amount=Number(process.env.MERCADO_PAGO_MONTHLY_AMOUNT);
  if(!Number.isFinite(amount)||amount<=0)return res.status(503).json({error:'Valor mensal do BarberFlow não configurado.'});
  const appUrl=(process.env.APP_URL||'').replace(/\/$/,'');if(!appUrl)return res.status(503).json({error:'APP_URL não configurada.'});
  const payerEmail=t.email;if(!payerEmail)return res.status(409).json({error:'Cadastre o e-mail da barbearia antes de assinar.'});
  const subscription=await mp('/preapproval',{method:'POST',body:JSON.stringify({reason:'BarberFlow - assinatura mensal',external_reference:t.id,payer_email:payerEmail,back_url:`${appUrl}/b/${encodeURIComponent((await db().query('SELECT slug FROM tenants WHERE id=$1',[t.id])).rows[0].slug)}#billing`,auto_recurring:{frequency:1,frequency_type:'months',transaction_amount:amount,currency_id:'BRL'},status:'pending'})});
  await db().query(`UPDATE tenants SET billing_provider='mercado_pago',billing_subscription_id=$1,subscription_status=$2,updated_at=now() WHERE id=$3`,[subscription.id,'pending',t.id]);
  return res.json({url:subscription.init_point,id:subscription.id});
 }catch(e:any){console.error('Mercado Pago checkout failed',e);return res.status(500).json({error:e.message||'Não foi possível iniciar a assinatura.'});}
}
