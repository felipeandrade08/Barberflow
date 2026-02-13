
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import { Mail, ArrowRight, User as UserIcon, Shield, Phone } from 'lucide-react';

const Login: React.FC = () => {
  const { login, register } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name || !email || !phone) return setError('Preencha todos os campos');
      register(name, email, phone);
    } else {
      const success = login(email, role);
      if (!success) setError('Usuário não encontrado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070')] bg-cover bg-center opacity-10 blur-sm" />
      
      <div className="relative w-full max-w-md glass p-10 rounded-[2.5rem] border border-slate-700 shadow-2xl">
        <div className="text-center mb-10">
          <Logo size={48} className="mb-6 mx-auto" />
          <h1 className="text-4xl font-serif font-bold gradient-text mb-2">BarberFlow</h1>
          <p className="text-slate-400 text-sm">A excelência no seu atendimento começa aqui.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none text-white transition-all"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">WhatsApp / Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="tel"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none text-white transition-all"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none text-white transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {!isRegister && (
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Tipo de Acesso</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                    role === 'client' ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <UserIcon size={16} />
                  <span>Cliente</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                    role === 'admin' ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Shield size={16} />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2 group"
          >
            <span>{isRegister ? 'Criar Conta' : 'Entrar'}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-slate-400 hover:text-amber-500 text-sm font-medium transition-colors"
          >
            {isRegister ? 'Já tenho uma conta. Fazer login' : 'Ainda não é cliente? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
