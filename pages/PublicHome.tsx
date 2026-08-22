import React from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin, Phone, Scissors, Star, Instagram, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';

const PublicHome:React.FC<{onLogin:()=>void}> = ({onLogin}) => {
  const {settings,services,professionals,tenantSlug}=useApp();
  const active=services.filter(s=>s.active!==false);
  const whatsapp=`https://wa.me/${settings.whatsapp.replace(/\D/g,'')}`;
  return <div className="min-h-screen bg-slate-950 text-white">
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3"><Logo size={38}/><div><div className="font-serif text-xl font-bold gradient-text">{settings.name}</div><div className="text-[9px] tracking-[.25em] uppercase text-slate-500">Barbearia Premium</div></div></div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin} className="hidden sm:block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white">Entrar</button>
          <a href={`#booking`} onClick={(e)=>{e.preventDefault();onLogin();}} className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition">Agendar horário</a>
        </div>
      </div>
    </header>
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1800&auto=format&fit=crop')] bg-cover bg-center opacity-25"/>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50"/>
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-36 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6"><Star size={13} fill="currentColor"/> Atendimento premium</div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[.98]">Seu estilo.<br/><span className="gradient-text">Seu horário.</span></h1>
            <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">{settings.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onLogin} className="px-6 py-4 rounded-2xl bg-amber-500 text-slate-950 font-extrabold flex items-center gap-2 hover:bg-amber-400 transition shadow-xl shadow-amber-500/10">Agendar agora <ArrowRight size={19}/></button>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="px-6 py-4 rounded-2xl border border-white/10 bg-white/5 font-bold flex items-center gap-2 hover:bg-white/10 transition"><MessageCircle size={19}/> WhatsApp</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Clock3 size={16} className="text-amber-500"/> {settings.openTime} — {settings.closeTime}</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-amber-500"/> {settings.address}</span>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {active.slice(0,4).map((s,i)=><div key={s.id} className={`rounded-3xl overflow-hidden border border-white/10 bg-slate-900/70 backdrop-blur ${i%2?'mt-10':''}`}><img src={s.image} className="h-48 w-full object-cover" alt={s.name}/><div className="p-5"><div className="font-bold">{s.name}</div><div className="mt-2 text-amber-400 font-bold">R$ {s.price.toFixed(2)} <span className="text-slate-500 text-xs font-normal">· {s.duration} min</span></div></div></div>)}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12"><p className="text-amber-500 text-xs uppercase tracking-[.3em] font-bold">Nosso catálogo</p><h2 className="text-4xl font-serif font-bold mt-3">Serviços pensados para você</h2><p className="text-slate-400 mt-3">Escolha seu serviço, barbeiro e horário em poucos passos.</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{active.map(s=><div key={s.id} className="rounded-3xl border border-white/10 bg-slate-900/60 overflow-hidden hover:-translate-y-1 transition"><img src={s.image} className="h-44 w-full object-cover" alt={s.name}/><div className="p-5"><h3 className="font-bold text-lg">{s.name}</h3><p className="text-sm text-slate-400 mt-2 min-h-10">{s.description}</p><div className="mt-4 flex justify-between"><span className="font-bold text-amber-400">R$ {s.price.toFixed(2)}</span><span className="text-slate-500 text-sm">{s.duration} min</span></div></div></div>)}</div>
      </section>
      <section className="border-y border-white/5 bg-slate-900/50"><div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-3 gap-8 text-center">{[['Agendamento fácil',CalendarDays],['Profissionais experientes',Scissors],['Atendimento no horário',CheckCircle2]].map(([label,Icon])=>{const I=Icon as any;return <div key={String(label)}><I className="mx-auto text-amber-500" size={28}/><h3 className="font-bold mt-4">{label as string}</h3><p className="text-sm text-slate-500 mt-2">Uma experiência organizada do início ao fim.</p></div>})}</div></section>
    </main>
    <footer className="max-w-7xl mx-auto px-5 lg:px-8 py-12 flex flex-col md:flex-row justify-between gap-6 text-sm text-slate-500">
      <div><span className="text-white font-semibold">{settings.name}</span><p className="mt-2">{settings.email}</p></div>
      <div className="flex gap-5 items-center"><a href={whatsapp} target="_blank" rel="noreferrer"><Phone size={17}/></a><a href={`https://instagram.com/${settings.instagram.replace('@','')}`} target="_blank" rel="noreferrer"><Instagram size={17}/></a><span>{settings.phone}</span></div>
    </footer>
  </div>
};
export default PublicHome;
