import type {VercelRequest,VercelResponse} from '@vercel/node';
import {db} from '../_lib/db';
import {requireRole} from '../_lib/authorization';
import {hashPassword} from '../_lib/auth';
const validTime=(v:any)=>/^\d{2}:\d{2}$/.test(String(v||''));
export default async function handler(req:VercelRequest,res:VercelResponse){
 const s=await requireRole(req,res,['admin','barber']);if(!s)return;
 const ownProfessional=async(id:any)=>s.role==='admin'||!!(await db().query('SELECT 1 FROM professionals WHERE id=$1 AND tenant_id=$2 AND user_id=$3',[id,s.tenantId,s.userId])).rowCount;
 try{
  const x=req.body||{};
  if(req.method==='POST'){
   if(s.role!=='admin')return res.status(403).json({error:'Apenas administradores podem cadastrar profissionais.'});
   if(!x.name?.trim())return res.status(400).json({error:'Nome do profissional é obrigatório.'});
   const c=await db().connect();try{await c.query('BEGIN');let userId=null;
    if(x.createAccess===true){if(!x.email?.trim()||!x.password||String(x.password).length<8){await c.query('ROLLBACK');return res.status(400).json({error:'Para criar acesso, informe e-mail e senha com pelo menos 8 caracteres.'});}const u=(await c.query(`INSERT INTO users(tenant_id,name,email,phone,password_hash,role) VALUES($1,$2,$3,$4,$5,'barber') RETURNING id`,[s.tenantId,x.name.trim(),x.email.trim().toLowerCase(),x.phone||null,hashPassword(String(x.password))])).rows[0];userId=u.id;}
    const r=await c.query(`INSERT INTO professionals(tenant_id,name,role,avatar,specialty,active,user_id) VALUES($1,$2,$3,$4,$5,true,$6) RETURNING id,name,role,avatar,specialty,active,user_id "userId"`,[s.tenantId,x.name.trim(),x.role?.trim()||'Barbeiro',x.avatar?.trim()||null,x.specialty?.trim()||null,userId]);await c.query('COMMIT');return res.status(201).json(r.rows[0]);
   }catch(e:any){await c.query('ROLLBACK');if(e?.code==='23505')return res.status(409).json({error:'Este e-mail já possui acesso nesta barbearia.'});throw e}finally{c.release()}
  }
  if(req.method==='PUT'){
   if(s.role!=='admin')return res.status(403).json({error:'Apenas administradores podem editar o cadastro do profissional.'});
   if(!x.id)return res.status(400).json({error:'Profissional obrigatório.'});
   const current=(await db().query('SELECT * FROM professionals WHERE id=$1 AND tenant_id=$2',[x.id,s.tenantId])).rows[0];
   if(!current)return res.status(404).json({error:'Profissional não encontrado.'});
   const name=(x.name??current.name)?.trim();if(!name)return res.status(400).json({error:'Nome do profissional é obrigatório.'});
   const r=await db().query(`UPDATE professionals SET name=$1,role=$2,avatar=$3,specialty=$4,active=$5 WHERE id=$6 AND tenant_id=$7 RETURNING id,name,role,avatar,specialty,active`,[name,(x.role??current.role)||'Barbeiro',x.avatar??current.avatar,x.specialty??current.specialty,x.active??current.active,x.id,s.tenantId]);
   return res.json(r.rows[0]);
  }
  if(req.method==='PATCH'){
   if(!x.id||!Array.isArray(x.workingHours))return res.status(400).json({error:'Profissional e jornada são obrigatórios.'});
   if(!(await ownProfessional(x.id)))return res.status(403).json({error:'Você só pode alterar a própria jornada.'});
   const c=await db().connect();
   try{
    await c.query('BEGIN');
    const exists=(await c.query('SELECT id FROM professionals WHERE id=$1 AND tenant_id=$2',[x.id,s.tenantId])).rows[0];
    if(!exists){await c.query('ROLLBACK');return res.status(404).json({error:'Profissional não encontrado.'});}
    const seen=new Set<number>();
    for(const h of x.workingHours){
     const weekday=Number(h.weekday);
     if(!Number.isInteger(weekday)||weekday<0||weekday>6||seen.has(weekday)){await c.query('ROLLBACK');return res.status(400).json({error:'Jornada semanal inválida.'});}
     seen.add(weekday);
     if(h.active!==false&&(!validTime(h.startTime)||!validTime(h.endTime)||h.startTime>=h.endTime)){await c.query('ROLLBACK');return res.status(400).json({error:'Horário de trabalho inválido.'});}
     if(h.active!==false&&(h.breakStart||h.breakEnd)&&(!validTime(h.breakStart)||!validTime(h.breakEnd)||h.breakStart>=h.breakEnd||h.breakStart<h.startTime||h.breakEnd>h.endTime)){await c.query('ROLLBACK');return res.status(400).json({error:'Intervalo do profissional inválido.'});}
    }
    await c.query('DELETE FROM professional_working_hours WHERE tenant_id=$1 AND professional_id=$2',[s.tenantId,x.id]);
    for(const h of x.workingHours)await c.query(`INSERT INTO professional_working_hours(tenant_id,professional_id,weekday,start_time,end_time,break_start,break_end,active) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,[s.tenantId,x.id,h.weekday,h.startTime||'00:00',h.endTime||'00:01',h.breakStart||null,h.breakEnd||null,h.active!==false]);
    await c.query('COMMIT');return res.json({ok:true});
   }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  }
  if(req.method==='DELETE'){
   const id=String(req.query.id||''),timeOffId=String(req.query.timeOffId||'');
   if(!id||!timeOffId)return res.status(400).json({error:'Bloqueio obrigatório.'});
   if(!(await ownProfessional(id)))return res.status(403).json({error:'Você só pode remover os próprios bloqueios.'});
   const r=await db().query('DELETE FROM professional_time_off WHERE id=$1 AND professional_id=$2 AND tenant_id=$3 RETURNING id',[timeOffId,id,s.tenantId]);
   return r.rowCount?res.json({ok:true}):res.status(404).json({error:'Bloqueio não encontrado.'});
  }
  return res.status(405).end();
 }catch(e){console.error('Professionals API failed',e);return res.status(500).json({error:'Não foi possível atualizar os profissionais.'});}
}
