import type {VercelRequest,VercelResponse} from '@vercel/node';
import crypto from 'node:crypto';
import {db} from '../_lib/db';
import {mp,normalizeSubscriptionStatus} from '../_lib/mercadopago';
function validSignature(req:VercelRequest,id:string){
 const secret=process.env.MERCADO_PAGO_WEBHOOK_SECRET;if(!secret)return false;
 const signature=String(req.headers['x-signature']||''),requestId=String(req.headers['x-request-id']||'');
 const parts=Object.fromEntries(signature.split(',').map(x=>x.trim().split('=')));
 if(!parts.ts||!parts.v1)return false;
 const manifest=`id:${id};request-id:${requestId};ts:${parts.ts};`;
 const expected=crypto.createHmac('sha256',secret).update(manifest).digest('hex');
 return expected.length===parts.v1.length&&crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(parts.v1));
}
export default async function handler(req:VercelRequest,res:VercelResponse){
 if(req.method!=='POST')return res.status(405).end();
 const type=String(req.query.type||req.body?.type||''),id=String(req.query['data.id']||req.body?.data?.id||'');
 if(!id)return res.status(200).json({received:true});
 if(!validSignature(req,id))return res.status(401).json({error:'Assinatura do webhook inválida.'});
 try{
  if(type==='subscription_preapproval'){
   const sub=await mp(`/preapproval/${encodeURIComponent(id)}`);
   const tenantId=String(sub.external_reference||'');
   if(tenantId)await db().query(`UPDATE tenants SET billing_provider='mercado_pago',billing_subscription_id=$1,billing_customer_id=COALESCE($2,billing_customer_id),subscription_status=$3,updated_at=now() WHERE id=$4`,[sub.id,sub.payer_id?String(sub.payer_id):null,normalizeSubscriptionStatus(sub.status),tenantId]);
  }else if(type==='subscription_authorized_payment'){
   const invoice=await mp(`/authorized_payments/${encodeURIComponent(id)}`);
   if(invoice.preapproval_id){const sub=await mp(`/preapproval/${encodeURIComponent(invoice.preapproval_id)}`);const tenantId=String(sub.external_reference||'');if(tenantId)await db().query('UPDATE tenants SET subscription_status=$1,updated_at=now() WHERE id=$2',[normalizeSubscriptionStatus(sub.status),tenantId]);}
  }
  return res.json({received:true});
 }catch(e){console.error('Mercado Pago webhook failed',e);return res.status(500).json({error:'Falha ao processar notificação.'});}
}
