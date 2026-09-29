import React from 'react';
import Logo from '../components/Logo';
import {ArrowRight,CalendarCheck2,LayoutDashboard,ShieldCheck,Smartphone,Store,Users2} from 'lucide-react';

const SaaSHome:React.FC=()=> <div className="min-h-screen bg-[#070b12] text-white overflow-hidden">
 <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.06] bg-[#070b12]/80 backdrop-blur-2xl">
  <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
   <div className="flex items-center gap-3"><Logo size={38}/><div><div className="text-lg font-extrabold tracking-tight">BarberFlow</div><div className="text-[9px] uppercase tracking-[.3em] text-slate-500">Gestão para barbearias</div></div></div>
   <a href="/master" className="text-sm font-semibold text-slate-400 transition hover:text-white">Acesso da plataforma</a>
  </div>
 </header>
 <main>
  <section className="relative pt-20">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(245,158,11,.13),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(37,99,235,.10),transparent_28%)]"/>
   <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-16 px-5 py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
    <div className="max-w-3xl">
     <div className="eyebrow mb-6">Operação, agenda e relacionamento em um só lugar</div>
     <h1 className="text-5xl font-extrabold leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-7xl">Uma operação mais organizada.<br/><span className="gradient-text">Uma experiência melhor.</span></h1>
     <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">O BarberFlow conecta a agenda da barbearia, equipe, clientes, serviços e atendimento em uma experiência digital simples para quem administra e para quem agenda.</p>
     <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#produto" className="btn-primary px-6 py-3.5">Conhecer o BarberFlow <ArrowRight size={18}/></a><span className="text-sm text-slate-500">Cada barbearia possui seu próprio endereço de agendamento.</span></div>
    </div>
    <div className="relative">
     <div className="absolute -inset-10 rounded-full bg-amber-500/5 blur-3xl"/>
     <div className="relative rounded-[2rem] border border-white/[.08] bg-slate-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/[.06] px-3 pb-4"><div><div className="text-xs text-slate-500">Hoje</div><div className="mt-1 font-bold">Visão operacional</div></div><div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">Operação online</div></div>
      <div className="grid grid-cols-2 gap-3 py-4">{[['Agenda organizada','Horários e atendimento'],['Equipe','Jornadas e disponibilidade'],['Clientes','Histórico e fidelidade'],['Serviços','Catálogo e valores']].map(([a,b])=><div key={a} className="rounded-2xl border border-white/[.06] bg-white/[.025] p-5"><div className="text-sm font-bold">{a}</div><div className="mt-2 text-xs leading-5 text-slate-500">{b}</div></div>)}</div>
      <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[.06] p-5"><div className="flex items-center gap-3"><CalendarCheck2 className="text-amber-400"/><div><div className="font-bold">Agendamento conectado à operação</div><div className="mt-1 text-xs text-slate-400">O cliente vê apenas horários realmente disponíveis.</div></div></div></div>
     </div>
    </div>
   </div>
  </section>
  <section id="produto" className="border-y border-white/[.06] bg-white/[.015]"><div className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="max-w-2xl"><div className="eyebrow">Produto</div><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Feito para a rotina real da barbearia.</h2><p className="mt-4 text-slate-400">Menos telas soltas e menos retrabalho. Cada área tem uma função clara dentro do fluxo de atendimento.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{[[LayoutDashboard,'Gestão','Visão central da operação.'],[Users2,'Equipe','Profissionais e jornadas.'],[Store,'Experiência pública','Página própria para cada barbearia.'],[Smartphone,'Cliente','Agendamento e histórico no celular.']].map(([Icon,title,desc]:any)=><div key={title} className="surface p-6"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><Icon size={21}/></div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></div>)}</div></div></section>
  <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="rounded-[2rem] border border-white/[.07] bg-gradient-to-br from-slate-900 to-slate-950 p-8 sm:p-12 lg:flex lg:items-center lg:justify-between"><div><div className="eyebrow">BarberFlow</div><h2 className="mt-3 text-3xl font-bold">Tecnologia sem atrapalhar o atendimento.</h2><p className="mt-3 max-w-2xl text-slate-400">A interface foi pensada para deixar as ações importantes evidentes e o restante fora do caminho.</p></div><div className="mt-8 flex items-center gap-2 text-sm text-slate-400 lg:mt-0"><ShieldCheck className="text-emerald-400" size={18}/> Acesso separado por barbearia e perfil</div></div></section>
 </main>
 <footer className="border-t border-white/[.06]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© BarberFlow</span><span>Gestão e agendamento para barbearias.</span></div></footer>
</div>;
export default SaaSHome;
