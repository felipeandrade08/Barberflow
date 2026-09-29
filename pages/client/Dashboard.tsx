
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Scissors, AlertCircle, CheckCircle2, XCircle, Star, MessageSquare, X, RotateCcw, MapPin, Phone, ExternalLink, Gift, Trophy } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { bookings, currentUser, cancelBooking, addReview, setPreSelectedServiceId, settings } = useApp();
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const myBookings = bookings.filter(b => b.userId === currentUser?.id);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:settings.timezone||'America/Sao_Paulo'}).format(new Date());
  const upcoming=myBookings.filter(b=>!['finished','cancelled'].includes(b.status)&&b.date>=today).sort((a,b)=>`${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const history=myBookings.filter(b=>['finished','cancelled'].includes(b.status)||b.date<today).sort((a,b)=>`${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  const loyaltyPoints = currentUser?.loyaltyPoints || 0;
  const targetPoints = Math.max(1, settings.loyaltyTarget || 10);
  const currentCyclePoints = Math.min(loyaltyPoints,targetPoints);
  const progress = currentCyclePoints / targetPoints * 100;
  const rewardReached = loyaltyPoints >= targetPoints;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={18} />;
      case 'confirmed': return <CheckCircle2 className="text-blue-500" size={18} />;
      case 'in_progress': return <Scissors className="text-violet-400" size={18} />;
      case 'finished': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'cancelled': return <XCircle className="text-red-500" size={18} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando Confirmação';
      case 'confirmed': return 'Confirmado';
      case 'in_progress': return 'Em atendimento';
      case 'finished': return 'Finalizado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewBookingId && await addReview(reviewBookingId, rating, comment)) {
      setReviewBookingId(null);
      setRating(5);
      setComment('');
    }
  };

  const handleBookAgain = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    window.location.hash = '#new-booking';
  };

  const googleMapsUrl = settings.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}` : '';

  const BookingCard=({b}:{b:any})=><div key={b.id} className="glass p-6 rounded-3xl border border-slate-700 relative overflow-hidden flex flex-col h-full group"><div className="flex justify-between items-start mb-4"><div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl"><Scissors size={24}/></div><div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">{getStatusIcon(b.status)}<span className="text-[10px] font-bold text-slate-300 uppercase">{getStatusLabel(b.status)}</span></div></div><h3 className="text-xl font-bold text-white mb-1">{b.serviceName}</h3><p className="text-slate-400 text-sm mb-4">R$ {Number(b.servicePrice).toFixed(2)}</p><div className="mt-auto space-y-2"><div className="flex items-center space-x-2 text-slate-300 text-sm"><Calendar size={14} className="text-amber-500"/><span>{new Date(b.date).toLocaleDateString('pt-BR')}</span></div><div className="flex items-center space-x-2 text-slate-300 text-sm"><Clock size={14} className="text-amber-500"/><span>{b.time}</span></div><div className="text-slate-500 text-xs mt-2 italic">Barbeiro: {b.professionalName}</div></div><div className="mt-6 flex flex-col space-y-2">{['pending','confirmed'].includes(b.status)&&<button onClick={()=>cancelBooking(b.id)} className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all">Cancelar agendamento</button>}{b.status==='finished'&&!b.rating&&<button onClick={()=>setReviewBookingId(b.id)} className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-900 text-sm font-bold">Avaliar atendimento</button>}{(b.status==='finished'||b.status==='cancelled')&&<button onClick={()=>handleBookAgain(b.serviceId)} className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-bold flex items-center justify-center space-x-2"><RotateCcw size={14}/><span>Agendar novamente</span></button>}</div>{b.rating&&<div className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50"><div className="flex items-center space-x-1 text-amber-500 mb-1">{[1,2,3,4,5].map(s=><Star key={s} size={12} fill={s<=b.rating.stars?'currentColor':'none'}/>)}</div><p className="text-xs text-slate-400 italic">“{b.rating.comment}”</p></div>}</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Olá, {currentUser?.name?.split(' ')[0]||'cliente'}</h1>
          <p className="text-slate-400">Seus próximos horários, histórico e benefícios em um só lugar.</p>
        </div>

        <div className="flex space-x-3">
          {settings.phone&&<a href={`tel:${settings.phone}`} className="glass p-3 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all flex items-center space-x-2 text-slate-300 hover:text-amber-500 group"><Phone size={18}/><span className="text-sm font-bold">Ligar agora</span></a>}
        </div>
      </div>

      {/* Cartão Fidelidade */}
      {settings.loyaltyEnabled && <div className="glass p-8 rounded-[2.5rem] border border-amber-500/20 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-amber-500">
              <Trophy size={28} />
              <h2 className="text-2xl font-bold">Fidelidade</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Complete <span className="text-white font-bold">{targetPoints} atendimentos</span>{settings.loyaltyReward ? <> e ganhe <span className="text-amber-500 font-bold">{settings.loyaltyReward}</span></> : <> para completar seu ciclo de fidelidade</>}
            </p>
            <div className="pt-2">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Seu progresso</span>
                  <span className="text-amber-500 font-bold">{currentCyclePoints} / {targetPoints}</span>
               </div>
               {rewardReached&&<p className="text-emerald-400 text-sm font-bold mb-3">Meta atingida{settings.loyaltyReward?` — benefício: ${settings.loyaltyReward}`:''}. Consulte a barbearia para utilização.</p>}
               <div className="w-full h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden p-1">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: targetPoints }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-2xl border flex items-center justify-center transition-all ${
                  i < currentCyclePoints 
                    ? 'bg-amber-500 border-amber-400 text-slate-900 shadow-lg shadow-amber-500/20' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-600'
                }`}
              >
                {i === targetPoints - 1 ? <Gift size={20} /> : <Scissors size={18} />}
              </div>
            ))}
          </div>
        </div>
      </div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="mr-2 text-amber-500" size={20} />
            Meus agendamentos
          </h2>
          <div className="space-y-8"><section><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-white">Próximos horários</h3><span className="text-xs text-slate-500">{upcoming.length} agendamento{upcoming.length===1?'':'s'}</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{upcoming.map(b=><BookingCard key={b.id} b={b}/>)}{!upcoming.length&&<div className="md:col-span-2 empty-state"><Calendar size={36} className="mx-auto mb-3 opacity-40"/><h3 className="text-white font-bold">Nenhum próximo horário</h3><button onClick={()=>window.location.hash='#new-booking'} className="btn-primary mt-4 mx-auto"><Calendar size={17}/>Agendar horário</button></div>}</div></section><section><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-white">Histórico</h3><span className="text-xs text-slate-500">{history.length} registro{history.length===1?'':'s'}</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{history.map(b=><BookingCard key={b.id} b={b}/>)}{!history.length&&<div className="md:col-span-2 text-sm text-slate-500 py-6">Seu histórico aparecerá aqui após os atendimentos.</div>}</div></section></div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MapPin className="mr-2 text-amber-500" size={20} />
            Onde estamos
          </h2>
          
          <div className="glass rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-xl">
            <div className="h-40 bg-slate-900 relative flex items-center justify-center border-b border-slate-700">
               <div className="text-center"><div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center"><MapPin className="text-amber-500" size={30}/></div><p className="text-xs text-slate-500 mt-3">Endereço cadastrado pela barbearia</p></div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Endereço</p>
                <p className="text-white font-medium text-lg leading-snug">{settings.address||'Endereço ainda não informado.'}</p>
              </div>

              {settings.phone&&<div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">Contato</p>
                  <p className="text-white font-bold">{settings.phone}</p>
                </div>
              </div>}
              {googleMapsUrl&&<a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-all"
              >
                <span>Ver no Google Maps</span>
              </a>}
            </div>
          </div>
        </div>
      </div>

      {reviewBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setReviewBookingId(null)} />
          <form onSubmit={handleReviewSubmit} className="relative glass p-8 rounded-[2.5rem] w-full max-w-md border border-slate-700 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Avaliar Atendimento</h3>
              <button type="button" onClick={() => setReviewBookingId(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-slate-400 text-sm">Como foi sua experiência com o serviço?</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`p-2 transition-all hover:scale-110 ${s <= rating ? 'text-amber-500' : 'text-slate-700'}`}
                  >
                    <Star size={32} fill={s <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Comentário (opcional)</label>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-amber-500 outline-none text-white h-32 resize-none"
                placeholder="Conte-nos o que achou..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <MessageSquare size={20} />
              <span>Enviar avaliação</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
