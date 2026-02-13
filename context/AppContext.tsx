
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Service, Booking, BusinessSettings, AppState, Professional } from '../types';
import { INITIAL_SERVICES, INITIAL_SETTINGS, ADMIN_USER, MOCK_CLIENT, MOCK_PROFESSIONALS } from '../constants';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType extends AppState {
  toasts: ToastData[];
  preSelectedServiceId: string | null;
  setPreSelectedServiceId: (id: string | null) => void;
  preSelectedClientId: string | null;
  setPreSelectedClientId: (id: string | null) => void;
  addToast: (message: string, type?: ToastData['type']) => void;
  removeToast: (id: string) => void;
  login: (email: string, role: 'admin' | 'client') => boolean;
  logout: () => void;
  register: (name: string, email: string, phone: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'paymentMethod' | 'userName'> & { userId?: string; userName?: string }) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  addReview: (bookingId: string, stars: number, comment: string) => void;
  cancelBooking: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  removeService: (id: string) => void;
  updateSettings: (settings: BusinessSettings) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bf_users');
    return saved ? JSON.parse(saved) : [ADMIN_USER, MOCK_CLIENT];
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('bf_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [professionals] = useState<Professional[]>(MOCK_PROFESSIONALS);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bf_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('bf_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bf_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | null>(null);
  const [preSelectedClientId, setPreSelectedClientId] = useState<string | null>(null);
  const prevBookingsRef = useRef<Booking[]>(bookings);
  const notifiedBookings = useRef<Set<string>>(new Set());

  const addToast = (message: string, type: ToastData['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'client') return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      bookings.forEach(booking => {
        if (booking.userId === currentUser.id && booking.status === 'confirmed' && !notifiedBookings.current.has(booking.id)) {
          const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
          if (bookingDateTime > now && bookingDateTime <= oneHourLater) {
            addToast(`Lembrete: Você tem um horário de ${booking.serviceName} em 1 hora!`, 'warning');
            if (Notification.permission === 'granted') {
              new Notification('BarberFlow - Lembrete de Horário', {
                body: `Seu atendimento de ${booking.serviceName} começa às ${booking.time}. Não se atrase!`,
                icon: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=128&h=128&fit=crop'
              });
            }
            notifiedBookings.current.add(booking.id);
          }
        }
      });
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [currentUser, bookings]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [settings.theme]);

  useEffect(() => {
    localStorage.setItem('bf_users', JSON.stringify(users));
    localStorage.setItem('bf_services', JSON.stringify(services));
    localStorage.setItem('bf_bookings', JSON.stringify(bookings));
    localStorage.setItem('bf_settings', JSON.stringify(settings));
    localStorage.setItem('bf_current_user', JSON.stringify(currentUser));
  }, [users, services, bookings, settings, currentUser]);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings(prev => ({ ...prev, theme: newTheme }));
    addToast(`Modo ${newTheme === 'light' ? 'Claro' : 'Escuro'} ativado`, 'info');
  };

  const login = (email: string, role: 'admin' | 'client') => {
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
      addToast(`Bem-vindo de volta, ${user.name}!`, 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Até logo!', 'info');
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: User = { 
      id: Date.now().toString(), 
      name, 
      email, 
      phone,
      role: 'client',
      loyaltyPoints: 0
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    addToast('Conta criada com sucesso!', 'success');
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'paymentMethod' | 'userName'> & { userId?: string; userName?: string }) => {
    const resolvedUserId = bookingData.userId || currentUser?.id || 'guest';
    const resolvedUserName = bookingData.userName || (resolvedUserId === currentUser?.id ? currentUser?.name : users.find(u => u.id === resolvedUserId)?.name) || 'Cliente';

    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      userId: resolvedUserId,
      userName: resolvedUserName,
      status: 'pending',
      paymentMethod: null,
    };
    setBookings([newBooking, ...bookings]);
    addToast('Agendamento realizado com sucesso!', 'success');
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    if (updates.status === 'finished' && booking.status !== 'finished') {
      const userId = booking.userId;
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, loyaltyPoints: (u.loyaltyPoints || 0) + 1 } : u
      ));
      if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? { ...prev, loyaltyPoints: (prev.loyaltyPoints || 0) + 1 } : null);
      }
    }

    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addReview = (bookingId: string, stars: number, comment: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { 
      ...b, 
      rating: { stars, comment, date: new Date().toISOString() } 
    } : b));
    addToast('Obrigado pela sua avaliação!', 'success');
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    addToast('Agendamento cancelado.', 'warning');
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = { ...serviceData, id: Date.now().toString() };
    setServices([...services, newService]);
    addToast('Novo serviço adicionado!', 'success');
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addToast('Serviço atualizado com sucesso!', 'success');
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    addToast('Serviço removido.', 'info');
  };

  const updateSettings = (newSettings: BusinessSettings) => {
    setSettings(newSettings);
    addToast('Configurações salvas com sucesso!', 'success');
  };

  return (
    <AppContext.Provider value={{
      users, services, professionals, bookings, settings, currentUser, toasts, preSelectedServiceId, setPreSelectedServiceId,
      preSelectedClientId, setPreSelectedClientId, addToast, removeToast, login, logout, register, addBooking, updateBooking, addReview, cancelBooking, addService, updateService, removeService, updateSettings, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
