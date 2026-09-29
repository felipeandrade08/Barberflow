import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';
import {isPastLocalSlot,localDateTimeToUtc,toMinutes,toTime,weekdayForDate} from '../_lib/scheduling';
export default async function handler(req:VercelRequest,res:VercelResponse){
 const s=requireSession(req,res);if(!s)return;
 if(req.method!=='GET')return res.status(405).end();
 const serviceId=String(req.query.serviceId||''),professionalId=String(req.query.professionalId||''),date=String(req.query.date||'');
 if(!serviceId||!professionalId||!/^\d{4}-\d{2}-\d{2}$/.test(date))return res.status(400).json({error:'Serviço, profissional e data válidos são obrigatórios.'});
 try{
  const tenant=(await db().query('SELECT open_time,close_time,booking_interval,off_days,subscription_status,timezone FROM tenants WHERE id=$1 AND deleted_at IS NULL',[s.tenantId])).rows[0];
  const service=(await db().query('SELECT duration FROM services WHERE id=$1 AND tenant_id=$2 AND active=true',[serviceId,s.tenantId])).rows[0];
  const professional=(await db().query('SELECT id FROM professionals WHERE id=$1 AND tenant_id=$2 AND active=true',[professionalId,s.tenantId])).rows[0];
  if(!tenant||!service||!professional)return res.status(404).json({error:'Agenda indisponível para os dados informados.'});
  if(!['active','trialing'].includes(tenant.subscription_status))return res.status(403).json({error:'Agenda temporariamente indisponível.'});
  if((tenant.off_days||[]).includes(date))return res.json({date,availableTimes:[],closed:true});
  const weekday=weekdayForDate(date,tenant.timezone);
  const hours=(await db().query('SELECT start_time,end_time,break_start,break_end,active FROM professional_working_hours WHERE tenant_id=$1 AND professional_id=$2 AND weekday=$3',[s.tenantId,professionalId,weekday])).rows[0];
  if(hours&&hours.active===false)return res.json({date,availableTimes:[],closed:true});
  const open=toMinutes(hours?.start_time||tenant.open_time),close=toMinutes(hours?.end_time||tenant.close_time),duration=Number(service.duration),interval=Math.max(5,Number(tenant.booking_interval)||30);
  const breakStart=hours?.break_start?toMinutes(hours.break_start):null,breakEnd=hours?.break_end?toMinutes(hours.break_end):null;
  const occupied=(await db().query(`SELECT time,duration FROM bookings WHERE tenant_id=$1 AND professional_id=$2 AND date=$3 AND status IN ('pending','confirmed','in_progress') ORDER BY time`,[s.tenantId,professionalId,date])).rows;
  const dayStart=localDateTimeToUtc(date,toTime(open),tenant.timezone),dayEnd=localDateTimeToUtc(date,toTime(close),tenant.timezone);
  const timeOff=(await db().query('SELECT starts_at,ends_at FROM professional_time_off WHERE tenant_id=$1 AND professional_id=$2 AND starts_at<$4 AND ends_at>$3',[s.tenantId,professionalId,dayStart,dayEnd])).rows;
  const availableTimes:string[]=[];
  for(let start=open;start+duration<=close;start+=interval){
   const end=start+duration,time=toTime(start);
   if(isPastLocalSlot(date,time,tenant.timezone))continue;
   if(breakStart!==null&&breakEnd!==null&&start<breakEnd&&end>breakStart)continue;
   if(occupied.some((b:any)=>{const bs=toMinutes(b.time);return bs<end&&bs+Number(b.duration)>start}))continue;
   const slotStart=localDateTimeToUtc(date,time,tenant.timezone),slotEnd=localDateTimeToUtc(date,toTime(end),tenant.timezone);
   if(timeOff.some((o:any)=>new Date(o.starts_at)<slotEnd&&new Date(o.ends_at)>slotStart))continue;
   availableTimes.push(time);
  }
  return res.json({date,availableTimes,closed:false,timezone:tenant.timezone});
 }catch(e){console.error('Availability failed',e);return res.status(500).json({error:'Não foi possível consultar a disponibilidade.'});}
}
