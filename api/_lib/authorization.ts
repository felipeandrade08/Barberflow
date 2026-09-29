import type {VercelRequest,VercelResponse} from '@vercel/node';import {db} from './db';import {requireSession} from './auth';
export async function dbRole(userId:string,tenantId:string){const row=(await db().query('SELECT role FROM users WHERE id=$1 AND tenant_id=$2',[userId,tenantId])).rows[0];return row?.role||null;}
export async function requireRole(req:VercelRequest,res:VercelResponse,roles:string[]){
 const s=requireSession(req,res);if(!s)return null;
 const row=(await db().query('SELECT role FROM users WHERE id=$1 AND tenant_id=$2',[s.userId,s.tenantId])).rows[0];
 if(!row){res.status(401).json({error:'Sessão inválida.'});return null;}
 if(!roles.includes(row.role)){res.status(403).json({error:'Acesso restrito.'});return null;}
 return {...s,role:row.role};
}
