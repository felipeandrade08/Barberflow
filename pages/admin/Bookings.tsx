
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, CheckCircle, XCircle, MoreVertical, CreditCard, Wallet, Smartphone, DollarSign, CalendarPlus, X } from 'lucide-react';
import { BookingStatus, PaymentMethod, Booking } from '../../types';

const AdminBookings: React.FC = () => {
  const { bookings, updateBooking, setPreSelectedClientId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: BookingStatus) => {
    if (status === 'finished') {
      setShowPaymentModal(id);
    } else {
      updateBooking(id, { status });
    }
  };

  const handleFinishPayment = (id: string, method: PaymentMethod) => {
    const booking = bookings.find(b => b.id === id);
    updateBooking(id, { status: 'finished', paymentMethod: method });
    setShowPaymentModal(null);
    if (booking) {
      setShowFollowUpModal(booking);
    }
  };

  const handleScheduleFollowUp = () => {
    if (showFollowUpModal) {
      setPreSelectedClientId(showFollowUpModal.userId);
      setShowFollowUpModal(null);
      window.location.hash = '#new-booking';
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      finished: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-serif font-bold text-white">Gerenciar Agendamentos</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Buscar cliente ou serviço..."
              className="bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-slate-800 border border-slate-700 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="confirmed">Confirmados</option>
            <option value="finished">Finalizados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-3xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data/Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {b.userName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-white">{b.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-300">{b.serviceName}</span>
                    <p className="text-xs text-slate-500">R$ {b.servicePrice}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-300 block">{new Date(b.date).toLocaleDateString('pt-BR')}</span>
                    <span className="text-xs font-bold text-amber-500">{b.time}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(b.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {b.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(b.id, 'confirmed')}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                          title="Confirmar"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button 
                          onClick={() => handleStatusChange(b.id, 'finished')}
                          className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg"
                          title="Finalizar"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button 
                          onClick={() => handleStatusChange(b.id, 'cancelled')}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                          title="Cancelar"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(null)} />
          <div className="relative glass p-8 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-white mb-2 font-serif">Finalizar Atendimento</h3>
            <p className="text-slate-400 mb-6">Selecione a forma de pagamento do cliente.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'money', label: 'Dinheiro', icon: Wallet, color: 'emerald' },
                { id: 'pix', label: 'PIX', icon: Smartphone, color: 'blue' },
                { id: 'debit', label: 'Débito', icon: CreditCard, color: 'purple' },
                { id: 'credit', label: 'Crédito', icon: DollarSign, color: 'amber' },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handleFinishPayment(showPaymentModal, method.id as PaymentMethod)}
                    className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-all group"
                  >
                    <Icon className={`text-${method.color}-500 mb-2 group-hover:scale-110 transition-transform`} size={32} />
                    <span className="text-sm font-bold text-slate-200">{method.label}</span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowPaymentModal(null)}
              className="w-full mt-6 py-3 text-slate-500 hover:text-white transition-colors text-sm font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowFollowUpModal(null)} />
          <div className="relative glass p-10 rounded-[2.5rem] w-full max-w-sm border border-emerald-500/20 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
              <CalendarPlus size={40} />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 font-serif">Agendar Próxima Visita?</h3>
              <p className="text-slate-400 text-sm">
                Atendimento de <span className="text-white font-bold">{showFollowUpModal.userName}</span> finalizado. Deseja já agendar o próximo horário para fidelizá-lo?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleScheduleFollowUp}
                className="w-full bg-amber-500 text-slate-900 py-3.5 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10"
              >
                <CalendarPlus size={20} />
                <span>Agendar Agora</span>
              </button>
              <button
                onClick={() => setShowFollowUpModal(null)}
                className="w-full py-3 text-slate-500 hover:text-white font-bold transition-all text-sm"
              >
                Talvez mais tarde
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
