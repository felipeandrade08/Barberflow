import {Pool} from 'pg';

let pool:Pool|undefined;
export function db(){
  if(!pool){
    const connectionString=process.env.DATABASE_URL?.trim();
    if(!connectionString)throw new Error('DATABASE_URL não configurada.');
    const sslDisabled=process.env.DATABASE_SSL==='disable';
    pool=new Pool({
      connectionString,
      ssl:sslDisabled?undefined:{rejectUnauthorized:false},
      max:Number(process.env.DATABASE_POOL_MAX||2),
      idleTimeoutMillis:10000,
      connectionTimeoutMillis:10000,
      allowExitOnIdle:true
    });
    pool.on('error',(error)=>console.error('PostgreSQL pool error',error.message));
  }
  return pool;
}
