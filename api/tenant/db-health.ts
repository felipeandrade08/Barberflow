import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';

export default async function handler(req:VercelRequest,res:VercelResponse){
  if(req.method!=='GET')return res.status(405).end();
  const s=requireSession(req,res);if(!s)return;
  if(s.role!=='admin'&&s.role!=='platform_admin')return res.status(403).json({error:'Acesso restrito.'});
  try{
    const r=await db().query(`SELECT current_database() database,
      to_regclass('public.tenants') IS NOT NULL tenants,
      to_regclass('public.users') IS NOT NULL users,
      to_regclass('public.professionals') IS NOT NULL professionals,
      to_regclass('public.services') IS NOT NULL services,
      to_regclass('public.bookings') IS NOT NULL bookings`);
    const x=r.rows[0],ready=x.tenants&&x.users&&x.professionals&&x.services&&x.bookings;
    return res.status(ready?200:503).json({ok:ready,database:x.database,schema:{tenants:x.tenants,users:x.users,professionals:x.professionals,services:x.services,bookings:x.bookings}});
  }catch{return res.status(503).json({ok:false,error:'Banco indisponível ou não inicializado.'});}
}
