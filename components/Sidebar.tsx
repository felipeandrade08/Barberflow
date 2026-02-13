
import React from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Star, 
  Settings, 
  LogOut,
  Clock,
  PlusSquare,
  Code,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, logout, settings, toggleTheme } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  const adminMenu = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'bookings', label: 'Agendamentos', icon: Calendar },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'services', label: 'Serviços', icon: Scissors },
    { id: 'reviews', label: 'Avaliações', icon: Star },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const clientMenu = [
    { id: 'dashboard', label: 'Meus Agendamentos', icon: Clock },
    { id: 'new-booking', label: 'Novo Agendamento', icon: PlusSquare },
  ];

  const menu = isAdmin ? adminMenu : clientMenu;

  return (
    <div className="w-64 h-full flex flex-col glass border-r border-slate-700 dark:border-slate-700">
      <div className="p-8 flex flex-col items-center text-center">
        <Logo size={40} className="mb-4" />
        <h1 className="text-2xl font-serif font-bold gradient-text">BarberFlow</h1>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 uppercase tracking-widest">Premium Care</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                  : 'text-slate-400 dark:text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-4">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 dark:text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700"
        >
          {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="font-medium">{settings.theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>

        <div className="p-4 bg-slate-800/50 dark:bg-slate-800/50 rounded-2xl border border-slate-700">
          <p className="text-xs text-slate-500">Logado como</p>
          <p className="font-medium text-slate-200 dark:text-slate-200 truncate">{currentUser?.name}</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>

        <div className="pt-4 border-t border-slate-700/50 text-center">
           <div className="flex items-center justify-center space-x-1.5 text-slate-500 hover:text-amber-500 transition-colors cursor-default">
             <Code size={12} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Dev Felipe Andrade</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
