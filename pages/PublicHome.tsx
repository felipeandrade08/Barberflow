import React from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin, Phone, Scissors, Instagram, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';

const PublicHome:React.FC<{onLogin:()=>void;onBook:()=>void}> = ({onLogin,onBook}) => {
  const {settings,services}=useApp();
  const active=services.filter(s=>s.active!==false);
  const whatsapp=settings.whatsapp?`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}`:'';
  return <div className="min-h-screen bg-slate-950 text-white">
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3"><Logo size={38}/><div><div className="text-xl font-bold tracking-tight gradient-text">{settings.name}</div><div className="text-[9px] tracking-[.25em] uppercase text-slate-500">Agendamento online</div></div></div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin} className="hidden sm:block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white">Entrar</button>
          <button onClick={onBook} className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition">Agendar horário</button>
        </div>
      </div>
    </header>
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(245,158,11,.12),transparent_32%),radial-gradient(circle_at_15%_70%,rgba(59,130,246,.07),transparent_28%)]"/>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60"/>
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-36 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6"><CalendarDays size={13}/> Agenda online</div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-[-.045em] leading-[.98]">Seu estilo.<br/><span className="gradient-text">Seu horário.</span></h1>
            <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">{settings.description||'Escolha seu serviço e encontre um horário disponível para o seu atendimento.'}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onBook} className="px-6 py-4 rounded-2xl bg-amber-500 text-slate-950 font-extrabold flex items-center gap-2 hover:bg-amber-400 transition shadow-xl shadow-amber-500/10">Agendar agora <ArrowRight size={19}/></button>
              {whatsapp&&<a href={whatsapp} target="_blank" rel="noreferrer" className="px-6 py-4 rounded-2xl border border-white/10 bg-white/5 font-bold flex items-center gap-2 hover:bg-white/10 transition"><MessageCircle size={19}/> WhatsApp</a>}
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              {settings.openTime&&settings.closeTime&&<span className="flex items-center gap-2"><Clock3 size={16} className="text-amber-500"/> {settings.openTime} — {settings.closeTime}</span>}
              {settings.address&&<span className="flex items-center gap-2"><MapPin size={16} className="text-amber-500"/> {settings.address}</span>}
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {active.slice(0,4).map((s,i)=><div key={s.id} className={`rounded-3xl overflow-hidden border border-white/10 bg-slate-900/70 backdrop-blur ${i%2?'mt-10':''}`}>{s.image?<img src={s.image} className="h-48 w-full object-cover" alt={s.name}/>:<div className="h-48 w-full bg-slate-800 flex items-center justify-center"><Scissors size={34} className="text-slate-600"/></div>}<div className="p-5"><div className="font-bold">{s.name}</div><div className="mt-2 text-amber-400 font-bold">R$ {s.price.toFixed(2)} <span className="text-slate-500 text-xs font-normal">· {s.duration} min</span></div></div></div>)}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12"><p className="text-amber-500 text-xs uppercase tracking-[.3em] font-bold">Nosso catálogo</p><h2 className="text-4xl font-bold tracking-tight mt-3">Serviços pensados para você</h2><p className="text-slate-400 mt-3">Escolha seu serviço, barbeiro e horário em poucos passos.</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{active.map(s=><div key={s.id} className="rounded-3xl border border-white/10 bg-slate-900/60 overflow-hidden hover:-translate-y-1 transition">{s.image?<img src={s.image} className="h-44 w-full object-cover" alt={s.name}/>:<div className="h-44 w-full bg-slate-800 flex items-center justify-center"><Scissors size={32} className="text-slate-600"/></div>}<div className="p-5"><h3 className="font-bold text-lg">{s.name}</h3><p className="text-sm text-slate-400 mt-2 min-h-10">{s.description}</p><div className="mt-4 flex justify-between"><span className="font-bold text-amber-400">R$ {s.price.toFixed(2)}</span><span className="text-slate-500 text-sm">{s.duration} min</span></div></div></div>)}{!active.length&&<div className="empty-state col-span-full">O catálogo de serviços ainda não está disponível.</div>}</div>
      </section>
      <section className="border-y border-white/5 bg-slate-900/50"><div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-3 gap-8 text-center">{[['Agendamento online',CalendarDays],['Escolha seu profissional',Scissors],['Horários disponíveis',CheckCircle2]].map(([label,Icon])=>{const I=Icon as any;return <div key={String(label)}><I className="mx-auto text-amber-500" size={28}/><h3 className="font-bold mt-4">{label as string}</h3><p className="text-sm text-slate-500 mt-2">Uma experiência organizada do início ao fim.</p></div>})}</div></section>
    </main>
    <footer className="max-w-7xl mx-auto px-5 lg:px-8 py-12 flex flex-col md:flex-row justify-between gap-6 text-sm text-slate-500">
      <div><span className="text-white font-semibold">{settings.name}</span>{settings.email&&<p className="mt-2">{settings.email}</p>}</div>
      <div className="flex gap-5 items-center">{whatsapp&&<a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Phone size={17}/></a>}{settings.instagram&&<a href={`https://instagram.com/${settings.instagram.replace('@','')}`} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17}/></a>}{settings.phone&&<span>{settings.phone}</span>}</div>
    </footer>
  </div>
};
export default PublicHome;
