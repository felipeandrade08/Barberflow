import type {VercelRequest,VercelResponse} from '@vercel/node';
import Stripe from 'stripe';
import {db} from '../_lib/db';
export const config={api:{bodyParser:false}};
async function raw(req:VercelRequest){const chunks:any[]=[];for await(const c of req)chunks.push(c);return Buffer.concat(chunks);}
export default async function handler(req:VercelRequest,res:VercelResponse){
 if(req.method!=='POST')return res.status(405).end();
 try{
  const key=process.env.STRIPE_SECRET_KEY,secret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!key||!secret)return res.status(503).end();
  const stripe=new Stripe(key);
  const event=stripe.webhooks.constructEvent(await raw(req),req.headers['stripe-signature'] as string,secret);
  const obj:any=event.data.object;let tenantId:string|undefined,status:string|undefined,customerId:string|undefined,subscriptionId:string|undefined;
  if(event.type==='checkout.session.completed'){
   tenantId=obj.metadata?.tenantId;customerId=typeof obj.customer==='string'?obj.customer:obj.customer?.id;
   subscriptionId=typeof obj.subscription==='string'?obj.subscription:obj.subscription?.id;
   if(subscriptionId){const sub:any=await stripe.subscriptions.retrieve(subscriptionId);tenantId=tenantId||sub.metadata?.tenantId;status=sub.status;customerId=customerId||(typeof sub.customer==='string'?sub.customer:sub.customer?.id);}
  }else if(event.type==='customer.subscription.updated'||event.type==='customer.subscription.created'){
   tenantId=obj.metadata?.tenantId;status=obj.status;subscriptionId=obj.id;customerId=typeof obj.customer==='string'?obj.customer:obj.customer?.id;
  }else if(event.type==='customer.subscription.deleted'){
   tenantId=obj.metadata?.tenantId;status='canceled';subscriptionId=obj.id;customerId=typeof obj.customer==='string'?obj.customer:obj.customer?.id;
  }
  if(status&&tenantId)await db().query('UPDATE tenants SET subscription_status=$1,stripe_customer_id=COALESCE($2,stripe_customer_id),stripe_subscription_id=COALESCE($3,stripe_subscription_id),updated_at=now() WHERE id=$4',[status,customerId||null,subscriptionId||null,tenantId]);
  return res.json({received:true});
 }catch(e:any){console.error('Stripe webhook failed',e);return res.status(400).json({error:'Webhook inválido.'});}
}
