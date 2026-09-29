import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import { Mail, ArrowRight, User as UserIcon, Phone, LockKeyhole, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Login:React.FC<{onBack?:()=>void}> = ({onBack}) => {
  const {login,register,settings}=useApp();
  const masterMode=window.location.pathname.startsWith('/master');
  const [isRegister,setIsRegister]=useState(false); const [email,setEmail]=useState(''); const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [password,setPassword]=useState(''); const [show,setShow]=useState(false); const [error,setError]=useState('');
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');if(isRegister&&!masterMode){if(!name||!email||!phone||password.length<8){setError('Preencha os campos. A senha precisa ter pelo menos 8 caracteres.');return;}const ok=await register(name,email,phone,password);if(!ok)setError('Não foi possível criar a conta.');else window.location.hash='dashboard';}else{const ok=await login(email,password);if(!ok)setError('E-mail ou senha incorretos.');else window.location.hash='dashboard';}};
  return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,.08),transparent_30%)]"/>
    <div className="relative w-full max-w-md glass p-8 sm:p-10 rounded-[2rem] border border-white/10 shadow-2xl">
      {onBack&&<button onClick={onBack} className="inline-flex items-center text-sm text-slate-500 hover:text-white mb-7 transition-colors">← Voltar para o site</button>}
      <div className="text-center mb-8"><Logo size={48} className="mx-auto mb-4"/><h1 className="text-3xl font-extrabold tracking-tight gradient-text">{masterMode?'BarberFlow Master':settings.name}</h1><p className="text-slate-500 text-sm mt-2">{masterMode?'Acesso administrativo da plataforma':isRegister?'Crie sua conta para agendar':'Entre para gerenciar seus horários'}</p></div>
      <form onSubmit={submit} className="space-y-4">
        {isRegister&&<><Field icon={UserIcon} placeholder="Nome completo" value={name} onChange={setName}/><Field icon={Phone} placeholder="WhatsApp / telefone" value={phone} onChange={setPhone}/></>}
        <Field icon={Mail} type="email" placeholder="Seu e-mail" value={email} onChange={setEmail}/>
        <div className="relative"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/><input type={show?'text':'password'} minLength={8} placeholder="Senha" className="w-full bg-slate-900/70 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10" value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
        {error&&<div className="text-red-400 text-sm bg-red-500/10 border border-red-500/10 rounded-xl p-3">{error}</div>}
        <button className="btn-primary w-full py-4 rounded-2xl">{isRegister?'Criar minha conta':'Entrar'}<ArrowRight size={19}/></button>
      </form>
      {!masterMode&&<button onClick={()=>{setIsRegister(!isRegister);setError('')}} className="w-full text-center mt-6 text-sm text-slate-400 hover:text-amber-400">{isRegister?'Já tenho uma conta':'Ainda não sou cliente — criar conta'}</button>}
      {!isRegister&&<div className="mt-6 p-3 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-500 flex gap-2"><ShieldCheck size={15} className="text-emerald-500 shrink-0"/> Sua sessão é protegida e vinculada à sua conta.</div>}
    </div>
  </div>
};
const Field=({icon:Icon,type='text',placeholder,value,onChange}:any)=><div className="relative"><Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/><input type={type} placeholder={placeholder} className="w-full bg-slate-900/70 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10" value={value} onChange={(e)=>onChange(e.target.value)}/></div>;
export default Login;
