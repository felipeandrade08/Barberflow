import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';import {requireSession} from '../_lib/auth';import {mp,normalizeSubscriptionStatus} from '../_lib/mercadopago';
export default async function handler(req:VercelRequest,res:VercelResponse){
 const s=requireSession(req,res);if(!s)return;if(s.role!=='admin')return res.status(403).json({error:'Acesso restrito ao responsável.'});
 if(req.method!=='GET')return res.status(405).end();
 try{const t=(await db().query('SELECT billing_provider,billing_subscription_id,subscription_status FROM tenants WHERE id=$1',[s.tenantId])).rows[0];if(!t)return res.status(404).json({error:'Barbearia não encontrada.'});
 if(!t.billing_subscription_id)return res.json({provider:'mercado_pago',status:t.subscription_status||'trialing',subscriptionId:null});
 const sub=await mp(`/preapproval/${encodeURIComponent(t.billing_subscription_id)}`);const status=normalizeSubscriptionStatus(sub.status);
 await db().query('UPDATE tenants SET subscription_status=$1,billing_customer_id=COALESCE($2,billing_customer_id),updated_at=now() WHERE id=$3',[status,sub.payer_id?String(sub.payer_id):null,s.tenantId]);
 return res.json({provider:'mercado_pago',status,subscriptionId:sub.id,nextPaymentDate:sub.next_payment_date||null});
 }catch(e:any){console.error('Billing status failed',e);return res.status(500).json({error:e.message||'Não foi possível consultar a assinatura.'});}
}