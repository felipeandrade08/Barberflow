import React,{useEffect,useState} from 'react';
import {AppProvider,useApp} from './context/AppContext';
import Login from './pages/Login';
import PublicHome from './pages/PublicHome';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminServices from './pages/admin/Services';
import AdminClients from './pages/admin/Clients';
import AdminSettings from './pages/admin/Settings';
import AdminReviews from './pages/admin/Reviews';
import ClientDashboard from './pages/client/Dashboard';
import NewBooking from './pages/client/NewBooking';
import Toast from './components/Toast';

const MainLayout:React.FC=()=>{
 const {currentUser,toasts,removeToast}=useApp();
 const [activeTab,setActiveTab]=useState(()=>window.location.hash.replace('#','')||'dashboard');
 const [publicMode,setPublicMode]=useState(()=>window.location.hash==='#public'||window.location.hash==='');
 const [loginMode,setLoginMode]=useState(()=>window.location.hash==='#login');

 useEffect(()=>{const h=()=>{const hash=window.location.hash.replace('#','');if(hash==='public'||!hash){setPublicMode(true);setLoginMode(false);}else if(hash==='login'){setPublicMode(false);setLoginMode(true);}else{setPublicMode(false);setLoginMode(false);setActiveTab(hash);}};window.addEventListener('hashchange',h);return()=>window.removeEventListener('hashchange',h)},[]);

 if(publicMode) return <PublicHome onLogin={()=>{window.location.hash='login'}}/>;
 if(!currentUser||loginMode) return <Login onBack={()=>{window.location.hash='public'}}/>;

 const render=()=>currentUser.role==='admin'
 ? ({dashboard:<AdminDashboard/>,bookings:<AdminBookings/>,services:<AdminServices/>,clients:<AdminClients/>,reviews:<AdminReviews/>,settings:<AdminSettings/>, 'new-booking':<NewBooking/>} as any)[activeTab]||<AdminDashboard/>
 : ({dashboard:<ClientDashboard/>, 'new-booking':<NewBooking/>} as any)[activeTab]||<ClientDashboard/>;

 return <div className="flex h-screen overflow-hidden">
   <Sidebar activeTab={activeTab} onTabChange={setActiveTab}/>
   <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-10 pt-16 lg:pt-10"><div className="max-w-7xl mx-auto">{render()}</div></main>
   <div className="fixed top-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-sm space-y-3">{toasts.map(t=><Toast key={t.id} {...t} onClose={removeToast}/>)}</div>
 </div>;
};
export default ()=> <AppProvider><MainLayout/></AppProvider>;
