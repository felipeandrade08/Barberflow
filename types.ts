export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  password?: string;
  loyaltyPoints?: number;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialty: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  image?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'finished' | 'cancelled';
export type PaymentMethod = 'money' | 'pix' | 'debit' | 'credit' | null;

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  observation?: string;
  rating?: {
    stars: number;
    comment: string;
    date: string;
  };
}

export interface BusinessSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  offDays: string[]; // ['2023-12-25', ...]
  theme?: 'dark' | 'light';
  qrColor?: string;
  qrContent?: string;
}

export interface AppState {
  users: User[];
  services: Service[];
  professionals: Professional[];
  bookings: Booking[];
  settings: BusinessSettings;
  currentUser: User | null;
}