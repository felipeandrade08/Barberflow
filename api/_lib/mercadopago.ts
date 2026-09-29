const API='https://api.mercadopago.com';
const token=()=>{const value=process.env.MERCADO_PAGO_ACCESS_TOKEN;if(!value)throw new Error('Mercado Pago não configurado.');return value};
export async function mp(path:string,init:RequestInit={}){
 const response=await fetch(API+path,{...init,headers:{Authorization:`Bearer ${token()}`,'Content-Type':'application/json',...(init.headers||{})}});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data?.message||data?.error||'Falha na comunicação com o Mercado Pago.');
 return data;
}
export function normalizeSubscriptionStatus(status?:string){
 if(status==='authorized')return 'active';
 if(status==='pending')return 'pending';
 if(status==='paused')return 'paused';
 if(status==='cancelled'||status==='canceled')return 'canceled';
 return status||'pending';
}
