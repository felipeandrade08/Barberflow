import { Service, BusinessSettings, User, Professional } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'Corte de Cabelo', price: 50, duration: 45, description: 'Corte moderno com finalização personalizada.', image: 'https://images.unsplash.com/photo-1621605815841-aa33c563721e?w=400&h=400&fit=crop' },
  { id: '2', name: 'Barba Completa', price: 35, duration: 30, description: 'Desenho, hidratação e toalha quente.', image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=400&fit=crop' },
  { id: '3', name: 'Combo (Corte + Barba)', price: 75, duration: 75, description: 'A experiência completa para o seu visual.', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop' },
  { id: '4', name: 'Sobrancelha', price: 20, duration: 15, description: 'Alinhamento com navalha ou pinça.', image: 'https://images.unsplash.com/photo-1599351431247-f10bc192271c?w=400&h=400&fit=crop' },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  { id: 'p1', name: 'Marcus Vinícius', role: 'Barbeiro Sênior', specialty: 'Cortes Degradê e Barba', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop' },
  { id: 'p2', name: 'Ricardo Santos', role: 'Especialista em Barba', specialty: 'Navalha e Tratamento', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 'p3', name: 'Felipe Andrade', role: 'Master Barber', specialty: 'Visagismo e Tendências', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
];

export const INITIAL_SETTINGS: BusinessSettings = {
  name: 'BarberFlow Premium',
  phone: '(11) 99999-8888',
  email: 'contato@barberflow.com',
  address: 'Rua das Barbearias, 123 - Centro',
  openTime: '09:00',
  closeTime: '19:00',
  offDays: [],
  qrContent: `${window.location.origin}/#new-booking`,
};

export const ADMIN_USER: User = {
  id: 'admin-1',
  name: 'Admin Barber',
  email: 'admin@barberflow.com',
  role: 'admin',
};

export const MOCK_CLIENT: User = {
  id: 'client-1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'client',
  loyaltyPoints: 3,
};