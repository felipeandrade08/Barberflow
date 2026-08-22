import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Service, Booking, BusinessSettings, AppState, Professional } from '../types';
import { INITIAL_SERVICES, INITIAL_SETTINGS, ADMIN_USER, MOCK_CLIENT, MOCK_PROFESSIONALS } from '../constants';

interface ToastData { id: string; message: string; type: 'success'|'error'|'info'|'warning'; }
interface AppContextType extends AppState {
  toasts: ToastData[];
  preSelectedServiceId: string | null;
  setPreSelectedServiceId: (id: string|null) => void;
  preSelectedClientId: string | null;
  setPreSelectedClientId: (id: string|null) => void;
  addToast: (message:string, type?:ToastData['type']) => void;
  removeToast: (id:string) => void;
  login: (email:string, password:string) => boolean;
  logout: () => void;
  register: (name:string,email:string,phone:string,password:string) => boolean;
  addBooking: (booking: {
    userId?: string; userName?: string; professionalId: string; professionalName: string;
    serviceId: string; serviceName: string; servicePrice: number; date: string; time: string;
    observation?: string; duration?: number;
  }) => boolean;
  updateBooking: (id:string, updates:Partial<Booking>) => void;
  addReview: (bookingId:string, stars:number, comment:string) => void;
  cancelBooking: (id:string) => void;
  addService: (service:Omit<Service,'id'>) => void;
  updateService: (id:string, updates:Partial<Service>) => void;
  removeService: (id:string) => void;
  updateSettings: (settings:BusinessSettings) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType|undefined>(undefined);
const read = <T,>(key:string, fallback:T):T => { try { const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };

export const AppProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
  const [users,setUsers]=useState<User[]>(()=>read('bf_users',[ADMIN_USER,MOCK_CLIENT]));
  const [services,setServices]=useState<Service[]>(()=>read('bf_services',INITIAL_SERVICES));
  const [professionals]=useState<Professional[]>(()=>read('bf_professionals',MOCK_PROFESSIONALS));
  const [bookings,setBookings]=useState<Booking[]>(()=>read('bf_bookings',[]));
  const [settings,setSettings]=useState<BusinessSettings>(()=>({...INITIAL_SETTINGS,...read<Partial<BusinessSettings>>('bf_settings',{})}));
  const [currentUser,setCurrentUser]=useState<User|null>(()=>read('bf_current_user',null));
  const [toasts,setToasts]=useState<ToastData[]>([]);
  const [preSelectedServiceId,setPreSelectedServiceId]=useState<string|null>(null);
  const [preSelectedClientId,setPreSelectedClientId]=useState<string|null>(null);
  const notified=useRef<Set<string>>(new Set());

  const addToast=(message:string,type:ToastData['type']='info')=>setToasts(p=>[...p,{id:crypto.randomUUID?.()||Math.random().toString(36),message,type}]);
  const removeToast=(id:string)=>setToasts(p=>p.filter(t=>t.id!==id));

  useEffect(()=>{ localStorage.setItem('bf_users',JSON.stringify(users)); localStorage.setItem('bf_services',JSON.stringify(services)); localStorage.setItem('bf_professionals',JSON.stringify(professionals)); localStorage.setItem('bf_bookings',JSON.stringify(bookings)); localStorage.setItem('bf_settings',JSON.stringify(settings)); if(currentUser) localStorage.setItem('bf_current_user',JSON.stringify(currentUser)); else localStorage.removeItem('bf_current_user'); },[users,services,professionals,bookings,settings,currentUser]);
  useEffect(()=>{ document.documentElement.classList.toggle('dark',settings.theme!=='light'); },[settings.theme]);

  useEffect(()=>{
    const timer=setInterval(()=>{
      if(!currentUser) return;
      const now=new Date(), limit=new Date(now.getTime()+60*60*1000);
      bookings.forEach(b=>{ if(b.userId===currentUser.id && b.status==='confirmed' && !notified.current.has(b.id)){ const dt=new Date(`${b.date}T${b.time}`); if(dt>now&&dt<=limit){ addToast(`Lembrete: ${b.serviceName} às ${b.time}.`,'warning'); notified.current.add(b.id); } }});
    },60000);
    return()=>clearInterval(timer);
  },[currentUser,bookings]);

  const login=(email:string,password:string)=>{
    const user=users.find(u=>u.email.toLowerCase()===email.trim().toLowerCase() && u.password===password);
    if(!user){ addToast('E-mail ou senha incorretos.','error'); return false; }
    setCurrentUser(user); addToast(`Bem-vindo, ${user.name.split(' ')[0]}!`,'success'); return true;
  };
  const logout=()=>{setCurrentUser(null);addToast('Sessão encerrada.','info');};
  const register=(name:string,email:string,phone:string,password:string)=>{
    if(users.some(u=>u.email.toLowerCase()===email.trim().toLowerCase())){addToast('Este e-mail já está cadastrado.','error');return false;}
    const user:User={id:crypto.randomUUID?.()||Date.now().toString(),name:name.trim(),email:email.trim(),phone,password,role:'client',loyaltyPoints:0,createdAt:new Date().toISOString()};
    setUsers(p=>[...p,user]);setCurrentUser(user);addToast('Conta criada com sucesso!','success');return true;
  };

  const addBooking=(data:{
  userId?: string; userName?: string; professionalId: string; professionalName: string;
  serviceId: string; serviceName: string; servicePrice: number; date: string; time: string;
  observation?: string; duration?: number;
})=>{
    const userId=data.userId||currentUser?.id||'guest';
    const userName=data.userName||users.find(u=>u.id===userId)?.name||currentUser?.name||'Cliente';
    const duration=data.duration||services.find(s=>s.id===data.serviceId)?.duration||30;
    const start=(t:string)=>{const [h,m]=t.split(':').map(Number);return h*60+m;};
    const startMin=start(data.time), endMin=startMin+duration;
    const conflict=bookings.some(b=>b.date===data.date && b.professionalId===data.professionalId && ['pending','confirmed'].includes(b.status) && start(b.time)<endMin && start(b.time)+(b.duration||services.find(s=>s.id===b.serviceId)?.duration||30)>startMin);
    if(conflict){addToast('Este barbeiro já possui um horário nesse intervalo. Escolha outro horário.','error');return false;}
    const newBooking:Booking={...data,id:crypto.randomUUID?.()||Math.random().toString(36),userId,userName,duration,status:'pending',paymentMethod:null,createdAt:new Date().toISOString()};
    setBookings(p=>[newBooking,...p]);addToast('Agendamento criado! Aguarde a confirmação da barbearia.','success');return true;
  };

  const updateBooking=(id:string,updates:Partial<Booking>)=>{
    const booking=bookings.find(b=>b.id===id); if(!booking)return;
    if(updates.status==='finished'&&booking.status!=='finished') setUsers(p=>p.map(u=>u.id===booking.userId?{...u,loyaltyPoints:(u.loyaltyPoints||0)+1,lastVisit:booking.date}:u));
    setBookings(p=>p.map(b=>b.id===id?{...b,...updates}:b));
  };
  const addReview=(id:string,stars:number,comment:string)=>{setBookings(p=>p.map(b=>b.id===id?{...b,rating:{stars,comment,date:new Date().toISOString()}}:b));addToast('Avaliação registrada. Obrigado!','success');};
  const cancelBooking=(id:string)=>{setBookings(p=>p.map(b=>b.id===id?{...b,status:'cancelled'}:b));addToast('Agendamento cancelado.','warning');};
  const addService=(s:Omit<Service,'id'>)=>{setServices(p=>[...p,{...s,id:crypto.randomUUID?.()||Date.now().toString()}]);addToast('Serviço adicionado.','success');};
  const updateService=(id:string,u:Partial<Service>)=>{setServices(p=>p.map(s=>s.id===id?{...s,...u}:s));addToast('Serviço atualizado.','success');};
  const removeService=(id:string)=>{setServices(p=>p.map(s=>s.id===id?{...s,active:false}:s));addToast('Serviço desativado.','info');};
  const updateSettings=(s:BusinessSettings)=>{setSettings(s);addToast('Configurações salvas.','success');};
  const toggleTheme=()=>setSettings(p=>({...p,theme:p.theme==='light'?'dark':'light'}));

  return <AppContext.Provider value={{users,services,professionals,bookings,settings,currentUser,toasts,preSelectedServiceId,setPreSelectedServiceId,preSelectedClientId,setPreSelectedClientId,addToast,removeToast,login,logout,register,addBooking,updateBooking,addReview,cancelBooking,addService,updateService,removeService,updateSettings,toggleTheme}}>{children}</AppContext.Provider>;
};
export const useApp=()=>{const c=useContext(AppContext);if(!c)throw new Error('useApp must be used within AppProvider');return c;};
