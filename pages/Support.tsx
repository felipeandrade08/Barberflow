import React from 'react';
import {Headphones,MessageCircle,Mail,BookOpen,ShieldCheck} from 'lucide-react';
const Support:React.FC=()=>{
 const email=(import.meta as any).env?.VITE_SUPPORT_EMAIL||'';
 const whatsapp=(import.meta as any).env?.VITE_SUPPORT_WHATSAPP||'';
 const wa=whatsapp?`https://wa.me/${String(whatsapp).replace(/\D/g,'')}`:'';
 return <div className="space-y-7 pb-10"><div><p className="eyebrow">Ajuda</p><h1 className="page-title mt-2">Suporte BarberFlow</h1><p className="page-subtitle">Dúvidas sobre agenda, equipe, serviços, clientes, assinatura ou configuração da sua barbearia.</p></div>
 <div className="grid md:grid-cols-3 gap-5"><div className="surface p-6"><Headphones className="text-amber-400"/><h2 className="font-bold text-lg mt-5">Fale com o desenvolvedor</h2><p className="text-sm text-slate-400 mt-2">Use um dos canais configurados pela plataforma. Nunca envie senhas ou dados sensíveis pelo suporte.</p><div className="space-y-2 mt-5">{wa?<a className="btn-primary w-full justify-center" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={17}/>WhatsApp</a>:<div className="text-xs text-slate-500">WhatsApp de suporte ainda não configurado.</div>}{email?<a className="btn-secondary w-full justify-center" href={`mailto:${email}`}><Mail size={17}/>E-mail</a>:<div className="text-xs text-slate-500">E-mail de suporte ainda não configurado.</div>}</div></div>
 <div className="surface p-6"><BookOpen className="text-blue-400"/><h2 className="font-bold text-lg mt-5">Antes de chamar</h2><p className="text-sm text-slate-400 mt-2">Informe o que estava fazendo, em qual tela ocorreu e a mensagem exibida. Isso facilita localizar o problema sem pedir acesso à sua senha.</p></div>
 <div className="surface p-6"><ShieldCheck className="text-emerald-400"/><h2 className="font-bold text-lg mt-5">Atendimento seguro</h2><p className="text-sm text-slate-400 mt-2">O suporte BarberFlow não precisa conhecer sua senha. Dados da barbearia continuam isolados por estabelecimento.</p></div></div>
 </div>
};
export default Support;
