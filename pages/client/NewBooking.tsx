
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Scissors, Calendar as CalendarIcon, Clock, ArrowRight, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { Service, Professional } from '../../types';

const NewBooking: React.FC = () => {
  const { services, professionals, settings, addBooking, currentUser, preSelectedServiceId, setPreSelectedServiceId, preSelectedClientId, setPreSelectedClientId, users } = useApp();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [observation, setObservation] = useState('');

  const isAdmin = currentUser?.role === 'admin';
  const resolvedClient = isAdmin && preSelectedClientId ? users.find(u => u.id === preSelectedClientId) : currentUser;

  // Handle pre-selected service/client
  useEffect(() => {
    if (preSelectedServiceId) {
      const service = services.find(s => s.id === preSelectedServiceId);
      if (service) {
        setSelectedService(service);
        setStep(2);
      }
      setPreSelectedServiceId(null);
    }
  }, [preSelectedServiceId, services, setPreSelectedServiceId]);

  const isOffDay = (date: string) => {
    return settings.offDays.includes(date);
  };

  const generateTimeSlots = () => {
    const slots = [];
    let current = settings.openTime;
    const end = settings.closeTime;

    while (current < end) {
      slots.push(current);
      const [h, m] = current.split(':').map(Number);
      let nextM = m + 30;
      let nextH = h;
      if (nextM >= 60) {
        nextM = 0;
        nextH++;
      }
      current = `${nextH.toString().padStart(2, '0')}:${nextM.toString().padStart(2, '0')}`;
    }
    return slots;
  };

  const handleSubmit = () => {
    if (selectedService && selectedProfessional && selectedDate && selectedTime && resolvedClient) {
      addBooking({
        userId: resolvedClient.id,
        userName: resolvedClient.name,
        professionalId: selectedProfessional.id,
        professionalName: selectedProfessional.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        date: selectedDate,
        time: selectedTime,
        observation,
      });
      setStep(5);
      // Clear pre-selected client after successful booking
      if (isAdmin) setPreSelectedClientId(null);
    }
  };

  if (step === 5) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
          <CheckCircle2 size={64} />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-bold text-white">{isAdmin ? 'Agendamento Realizado!' : 'Seu Agendamento está Confirmado!'}</h2>
          <p className="text-slate-400 max-w-md mx-auto mt-2">
            O horário para <span className="text-white font-bold">{resolvedClient?.name}</span> com <span className="text-white font-bold">{selectedProfessional?.name}</span> foi reservado.
          </p>
        </div>
        <button 
          onClick={() => {
            setStep(1);
            setSelectedService(null);
            setSelectedProfessional(null);
            setSelectedDate('');
            setSelectedTime('');
            setObservation('');
            if (isAdmin) {
               window.location.hash = '#bookings';
            }
          }}
          className="bg-amber-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all"
        >
          {isAdmin ? 'Voltar para Agendamentos' : 'Ver Meus Agendamentos'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-serif font-bold text-white">
          {isAdmin ? `Agendando para: ${resolvedClient?.name}` : 'Novo Agendamento'}
        </h1>
        {isAdmin && (
           <span className="text-xs bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-amber-500/30">
             Modo Follow-up
           </span>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center space-x-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= s ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {s}
            </div>
            {s < 4 && <div className={`w-12 h-0.5 ${step > s ? 'bg-amber-500' : 'bg-slate-700'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-white">Selecione o Serviço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedService(s);
                  setStep(2);
                }}
                className={`flex items-start p-6 rounded-3xl border transition-all text-left group ${
                  selectedService?.id === s.id ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">{s.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                  <div className="flex items-center space-x-4 mt-4">
                    <span className="text-amber-500 font-bold">R$ {s.price.toFixed(2)}</span>
                    <span className="text-slate-500 text-xs flex items-center">
                      <Clock size={12} className="mr-1" /> {s.duration} min
                    </span>
                  </div>
                </div>
                <ArrowRight className="text-slate-600 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-white">Escolha o Barbeiro</h2>
            <button onClick={() => setStep(1)} className="text-sm text-amber-500 font-medium hover:underline transition-all">Trocar serviço</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professionals.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProfessional(p);
                  setStep(3);
                }}
                className={`p-6 rounded-[2.5rem] border transition-all text-center group ${
                  selectedProfessional?.id === p.id ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="relative inline-block mb-4">
                  <img src={p.avatar} alt={p.name} className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-500 transition-colors" />
                  <div className={`absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 p-1.5 rounded-full shadow-lg transition-transform ${selectedProfessional?.id === p.id ? 'scale-100' : 'scale-0'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mb-1">{p.role}</p>
                <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">{p.specialty}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-white">Data e Horário</h2>
            <div className="flex space-x-3">
               <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white transition-colors">Trocar serviço</button>
               <button onClick={() => setStep(2)} className="text-xs text-amber-500 font-medium hover:underline transition-all">Trocar barbeiro</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-6 rounded-3xl border border-slate-700">
              <label className="block text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest text-[10px]">Escolha o dia</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white appearance-none transition-all ${selectedDate && isOffDay(selectedDate) ? 'border-red-500' : ''}`}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate && isOffDay(selectedDate) && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2 text-red-400 text-xs animate-in fade-in">
                  <AlertTriangle size={14} />
                  <span>Não estamos atendendo nesta data.</span>
                </div>
              )}
            </div>

            <div className="glass p-6 rounded-3xl border border-slate-700">
              <label className="block text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest text-[10px]">Escolha o horário</label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {generateTimeSlots().map((t) => (
                  <button
                    key={t}
                    disabled={!selectedDate || isOffDay(selectedDate)}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-all border ${
                      selectedTime === t 
                        ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={!selectedDate || !selectedTime || isOffDay(selectedDate)}
              onClick={() => setStep(4)}
              className="bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/10 active:scale-95"
            >
              <span>Revisar Agendamento</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-xl mx-auto space-y-8">
          <h2 className="text-2xl font-serif font-bold text-white text-center">Resumo do Agendamento</h2>
          
          <div className="glass p-8 rounded-[2.5rem] border border-slate-700 space-y-6">
            <div className="flex justify-between items-start pb-6 border-b border-slate-700">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Serviço</p>
                <h3 className="text-xl font-bold text-white">{selectedService?.name}</h3>
                <p className="text-slate-400 text-sm">{selectedService?.duration} minutos</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Preço</p>
                <h3 className="text-xl font-bold text-amber-500">R$ {selectedService?.price.toFixed(2)}</h3>
              </div>
            </div>

            <div className="pb-6 border-b border-slate-700">
               <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Profissional Selecionado</p>
               <div className="flex items-center space-x-3">
                  <img src={selectedProfessional?.avatar} className="w-12 h-12 rounded-full border border-slate-600" />
                  <div>
                    <p className="text-white font-bold">{selectedProfessional?.name}</p>
                    <p className="text-xs text-slate-400">{selectedProfessional?.role}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pb-6 border-b border-slate-700">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Data</p>
                <p className="text-lg font-bold text-white">{new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Horário</p>
                <p className="text-lg font-bold text-white">{selectedTime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Observações (Opcional)</label>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white h-24 resize-none"
                placeholder="Ex: Alergia a algum produto..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-95"
            >
              Confirmar Reserva
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-full py-4 text-slate-400 hover:text-white font-bold transition-all"
            >
              Voltar e Alterar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewBooking;
