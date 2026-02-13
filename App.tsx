
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
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

const MainLayout: React.FC = () => {
  const { currentUser, toasts, removeToast } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle hash changes for quick navigation from dashboard
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  if (!currentUser) return <Login />;

  const renderContent = () => {
    const isAdmin = currentUser.role === 'admin';

    if (isAdmin) {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'bookings': return <AdminBookings />;
        case 'services': return <AdminServices />;
        case 'clients': return <AdminClients />;
        case 'settings': return <AdminSettings />;
        case 'reviews': return <AdminReviews />;
        case 'new-booking': return <NewBooking />; // Enabled for admin follow-ups
        default: return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
            <h2 className="text-2xl font-bold">Módulo em Construção</h2>
            <p>Estamos trabalhando nessa funcionalidade para a versão final.</p>
          </div>
        );
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <ClientDashboard />;
        case 'new-booking': return <NewBooking />;
        default: return <ClientDashboard />;
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto bg-slate-950 dark:bg-slate-950 p-8 lg:p-12 transition-colors">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Global Toast Container */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col space-y-4 w-full max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
