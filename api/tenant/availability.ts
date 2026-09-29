import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireSession} from '../_lib/auth';

const toMinutes=(value:string)=>{const [h,m]=String(value).slice(0,5).split(':').map(Number);return h*60+m};
const toTime=(minutes:number)=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;

export default async function handler(req:VercelRequest,res:VercelResponse){
  const s=requireSession(req,res); if(!s)return;
  if(req.method!=='GET')return res.status(405).end();
  const serviceId=String(req.query.serviceId||''),professionalId=String(req.query.professionalId||''),date=String(req.query.date||'');
  if(!serviceId||!professionalId||!/^\d{4}-\d{2}-\d{2}$/.test(date))return res.status(400).json({error:'Serviço, profissional e data válidos são obrigatórios.'});
  try{
    const [tenantResult,serviceResult,professionalResult]=await Promise.all([
      db().query('SELECT open_time,close_time,booking_interval,off_days,subscription_status FROM tenants WHERE id=$1 AND deleted_at IS NULL',[s.tenantId]),
      db().query('SELECT duration FROM services WHERE id=$1 AND tenant_id=$2 AND active=true',[serviceId,s.tenantId]),
      db().query('SELECT id FROM professionals WHERE id=$1 AND tenant_id=$2 AND active=true',[professionalId,s.tenantId])
    ]);
    const tenant=tenantResult.rows[0],service=serviceResult.rows[0];
    if(!tenant||!service||!professionalResult.rows[0])return res.status(404).json({error:'Agenda indisponível para os dados informados.'});
    if(!['active','trialing'].includes(tenant.subscription_status))return res.status(403).json({error:'Agenda temporariamente indisponível.'});
    if((tenant.off_days||[]).includes(date))return res.json({date,availableTimes:[],closed:true});

    const occupied=(await db().query(`SELECT time,duration FROM bookings WHERE tenant_id=$1 AND professional_id=$2 AND date=$3 AND status IN ('pending','confirmed','in_progress') ORDER BY time`,[s.tenantId,professionalId,date])).rows;
    const open=toMinutes(tenant.open_time),close=toMinutes(tenant.close_time),duration=Number(service.duration),interval=Math.max(5,Number(tenant.booking_interval)||30);
    const availableTimes:string[]=[];
    for(let start=open;start+duration<=close;start+=interval){
      const end=start+duration;
      const conflict=occupied.some((b:any)=>{const bookedStart=toMinutes(b.time);return bookedStart<end&&bookedStart+Number(b.duration)>start});
      if(!conflict)availableTimes.push(toTime(start));
    }
    return res.json({date,availableTimes,closed:false});
  }catch{return res.status(500).json({error:'Não foi possível consultar a disponibilidade.'});}
}
