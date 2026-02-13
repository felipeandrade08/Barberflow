import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import { Users, Calendar, Clock, DollarSign, TrendingUp, Scissors, UserCheck, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { bookings, users, services, professionals } = useApp();

  const totalClients = users.filter(u => u.role === 'client').length;
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today);
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  
  const totalRevenue = bookings
    .filter(b => b.status === 'finished')
    .reduce((sum, b) => sum + b.servicePrice, 0);

  // Chart Data: Revenue per service
  const serviceRevenue = services.map(s => ({
    name: s.name,
    value: bookings
      .filter(b => b.serviceId === s.id && b.status === 'finished')
      .reduce((sum, b) => sum + b.servicePrice, 0)
  })).filter(d => d.value > 0);

  // Financial Breakdown per Professional
  const professionalRevenue = professionals.map(p => {
    const revenue = bookings
      .filter(b => b.professionalId === p.id && b.status === 'finished')
      .reduce((sum, b) => sum + b.servicePrice, 0);
    const count = bookings.filter(b => b.professionalId === p.id && b.status === 'finished').length;
    return { ...p, revenue, count };
  });

  const colors = ['#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white dark:text-white">Dashboard Admin</h1>
          <p className="text-slate-400">Visão geral do seu negócio hoje</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex items-center space-x-2">
            <Calendar size={18} className="text-amber-500" />
            <span className="text-sm font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Clientes" value={totalClients} icon={Users} color="amber" />
        <StatCard label="Agendamentos Hoje" value={todayBookings.length} icon={Calendar} color="blue" />
        <StatCard label="Pendentes" value={pendingBookings.length} icon={Clock} color="purple" />
        <StatCard label="Receita Total" value={`R$ ${totalRevenue}`} icon={DollarSign} color="emerald" trend="+12% que ontem" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white dark:text-white">Receita por Serviço</h2>
            <TrendingUp className="text-emerald-400" size={20} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}} 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {serviceRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Breakdown per Barber */}
        <div className="glass p-8 rounded-3xl border border-slate-700 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-white dark:text-white">Rendimento p/ Barbeiro</h2>
             <UserCheck className="text-amber-500" size={20} />
          </div>
          <div className="space-y-4">
            {professionalRevenue.map((p, idx) => (
              <div key={p.id} className="p-4 bg-slate-800/50 dark:bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between group hover:border-amber-500/50 transition-all">
                <div className="flex items-center space-x-3">
                  <img src={p.avatar} className="w-10 h-10 rounded-full border border-slate-700" alt={p.name} />
                  <div>
                    <p className="text-sm font-bold text-white dark:text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{p.count} atendimentos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-500">R$ {p.revenue.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500 italic">Total Mensal</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-700/50">
             <p className="text-xs text-slate-400 text-center italic">Este painel facilita o cálculo de comissões por profissional.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl border border-slate-700 lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-6">Próximos Clientes</h2>
          <div className="space-y-4">
            {todayBookings.length > 0 ? todayBookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                  {b.userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{b.userName}</p>
                  <p className="text-xs text-slate-400">{b.serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-500">{b.time}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{b.status}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-10">Nenhum agendamento para hoje</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;