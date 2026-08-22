
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Scissors, AlertCircle, CheckCircle2, XCircle, Star, MessageSquare, X, RotateCcw, MapPin, Phone, ExternalLink, Gift, Trophy } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { bookings, currentUser, cancelBooking, addReview, setPreSelectedServiceId, settings } = useApp();
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const myBookings = bookings.filter(b => b.userId === currentUser?.id);
  const loyaltyPoints = currentUser?.loyaltyPoints || 0;
  const targetPoints = 10;
  const progress = (loyaltyPoints % targetPoints) / targetPoints * 100;
  const currentCyclePoints = loyaltyPoints % targetPoints;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={18} />;
      case 'confirmed': return <CheckCircle2 className="text-blue-500" size={18} />;
      case 'finished': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'cancelled': return <XCircle className="text-red-500" size={18} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando Confirmação';
      case 'confirmed': return 'Confirmado';
      case 'finished': return 'Finalizado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewBookingId) {
      addReview(reviewBookingId, rating, comment);
      setReviewBookingId(null);
      setRating(5);
      setComment('');
    }
  };

  const handleBookAgain = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    window.location.hash = '#new-booking';
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Bem-vindo, {currentUser?.name}!</h1>
          <p className="text-slate-400">Gerencie seus agendamentos e seu histórico.</p>
        </div>

        <div className="flex space-x-3">
          <a href={`tel:${settings.phone}`} className="glass p-3 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all flex items-center space-x-2 text-slate-300 hover:text-amber-500 group">
             <Phone size={18} className="group-hover:scale-110 transition-transform" />
             <span className="text-sm font-bold">Ligar agora</span>
          </a>
        </div>
      </div>

      {/* Cartão Fidelidade */}
      <div className="glass p-8 rounded-[2.5rem] border border-amber-500/20 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-amber-500">
              <Trophy size={28} />
              <h2 className="text-2xl font-bold">Clube Fidelidade</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Complete <span className="text-white font-bold">{targetPoints} cortes</span> e ganhe um serviço de <span className="text-amber-500 font-bold">Corte + Barba totalmente grátis!</span>
            </p>
            <div className="pt-2">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Seu Progresso</span>
                  <span className="text-amber-500 font-bold">{currentCyclePoints} / {targetPoints}</span>
               </div>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="mr-2 text-amber-500" size={20} />
            Meus Agendamentos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myBookings.length > 0 ? myBookings.map((b) => (
              <div key={b.id} className="glass p-6 rounded-3xl border border-slate-700 relative overflow-hidden flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl">
                    <Scissors size={24} />
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                    {getStatusIcon(b.status)}
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{getStatusLabel(b.status)}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{b.serviceName}</h3>
                <p className="text-slate-400 text-sm mb-4">R$ {b.servicePrice.toFixed(2)}</p>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center space-x-2 text-slate-300 text-sm">
                    <Calendar size={14} className="text-amber-500" />
                    <span>{new Date(b.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300 text-sm">
                    <Clock size={14} className="text-amber-500" />
                    <span>{b.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 text-xs mt-2 italic">
                     <span>Barbeiro: {b.professionalName}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col space-y-2">
                  {['pending', 'confirmed'].includes(b.status) && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                    >
                      Cancelar Agendamento
                    </button>
                  )}

                  {b.status === 'finished' && !b.rating && (
                    <button
                      onClick={() => setReviewBookingId(b.id)}
                      className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-900 text-sm font-bold hover:bg-amber-400 transition-all"
                    >
                      Avaliar Atendimento
                    </button>
                  )}

                  {(b.status === 'finished' || b.status === 'cancelled') && (
                    <button
                      onClick={() => handleBookAgain(b.serviceId)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-bold hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <RotateCcw size={14} />
                      <span>Agendar Novamente</span>
                    </button>
                  )}
                </div>

                {b.rating && (
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center space-x-1 text-amber-500 mb-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} fill={s <= b.rating!.stars ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 italic">"{b.rating.comment}"</p>
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-full py-16 text-center glass rounded-3xl border border-slate-700">
                <AlertCircle size={48} className="mx-auto text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-white">Nenhum agendamento</h3>
                <p className="text-slate-400 max-w-xs mx-auto mt-2">Você ainda não possui agendamentos. Comece reservando um horário agora mesmo!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MapPin className="mr-2 text-amber-500" size={20} />
            Onde Estamos
          </h2>
          
          <div className="glass rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-xl">
            <div className="h-48 bg-slate-800 relative group overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000" 
                 className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-110 transition-transform duration-700" 
                 alt="Barbershop Location Map"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <MapPin className="text-amber-500 relative z-10" size={48} />
                  </div>
               </div>
               <a 
                 href={googleMapsUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="absolute bottom-4 right-4 bg-amber-500 text-slate-900 p-3 rounded-full shadow-lg hover:bg-amber-400 transition-all hover:scale-110"
               >
                 <ExternalLink size={20} />
               </a>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Nosso Endereço</p>
                <p className="text-white font-medium text-lg leading-snug">{settings.address}</p>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">Fale Conosco</p>
                  <p className="text-white font-bold">{settings.phone}</p>
                </div>
              </div>

              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold transition-all"
              >
                <span>Ver no Google Maps</span>
              </a>
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
              <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Comentário (Opcional)</label>
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
              <span>Enviar Avaliação</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
