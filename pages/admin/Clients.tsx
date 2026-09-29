
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, User, Mail, Calendar, CalendarPlus } from 'lucide-react';

const AdminClients: React.FC = () => {
  const { users, bookings, settings, setPreSelectedClientId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const clients = users.filter(u => u.role === 'client');
  
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientStats = (userId: string) => {
    const userBookings = bookings.filter(b => b.userId === userId);
    const finishedBookings = userBookings.filter(b => b.status === 'finished');
    const finishedSorted=[...finishedBookings].sort((a,b)=>`${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));const lastBooking=finishedSorted[0]||null;const today=new Intl.DateTimeFormat('en-CA',{timeZone:settings.timezone||'America/Sao_Paulo'}).format(new Date());const nextBooking=userBookings.filter(b=>b.date>=today&&!['finished','cancelled'].includes(b.status)).sort((a,b)=>`${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0]||null;

    return {
      total: userBookings.length,
      finished: finishedBookings.length,
      lastVisit: lastBooking ? new Date(lastBooking.date).toLocaleDateString('pt-BR') : 'Nenhuma',
      nextVisit: nextBooking ? `${new Date(nextBooking.date).toLocaleDateString('pt-BR')} · ${nextBooking.time}` : 'Sem próxima visita'
    };
  };

  return (
    <div className="space-y-7 pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="text-slate-400">Clientes cadastrados e histórico de atendimentos.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className="field !pl-10 w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Total de Agendamentos</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Última / próxima visita</th><th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredClients.map((client) => {
                const stats = getClientStats(client.id);
                return (
                  <tr key={client.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/20">
                          {client.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-white">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-400 text-sm">
                        <Mail size={14} className="mr-2 opacity-50" />
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {stats.total} total / {stats.finished} finalizados
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar size={14} className="mr-2 opacity-50" />
                        {stats.lastVisit}</div><div className="text-xs text-amber-500 mt-1">{stats.nextVisit}</div>
                    </td><td className="px-6 py-4"><button title="Agendar para este cliente" onClick={()=>{setPreSelectedClientId(client.id);window.location.hash='#new-booking'}} className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10"><CalendarPlus size={18}/></button></td>
                  </tr>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-500">
                      <User size={48} className="mb-2 opacity-20" />
                      <p className="font-semibold text-slate-300">{clients.length?'Nenhum cliente corresponde à busca.':'Nenhum cliente cadastrado ainda.'}</p><p className="text-xs mt-2 max-w-sm">{clients.length?'Tente buscar por outro nome ou e-mail.':'Os clientes aparecerão aqui após criarem a conta na página da barbearia.'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminClients;
