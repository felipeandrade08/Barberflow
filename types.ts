export type UserRole='admin'|'barber'|'client'|'platform_admin';
export interface User{id:string;name:string;email:string;role:UserRole;phone?:string;password?:string;loyaltyPoints?:number;createdAt?:string;lastVisit?:string;tenant_id?:string;professionalId?:string}
export interface ProfessionalWorkingHour{weekday:number;startTime:string;endTime:string;breakStart?:string|null;breakEnd?:string|null;active:boolean}
export interface ProfessionalTimeOff{id:string;startsAt:string;endsAt:string;reason?:string|null}
export interface Professional{id:string;name:string;role:string;avatar:string;specialty:string;active?:boolean;userId?:string|null;workingHours?:ProfessionalWorkingHour[];timeOff?:ProfessionalTimeOff[]}
export interface Service{id:string;name:string;price:number;duration:number;description?:string;active?:boolean;category?:string;isCombo?:boolean;comboItems?:string[]}
export type BookingStatus='pending'|'confirmed'|'in_progress'|'finished'|'cancelled';export type PaymentMethod='money'|'pix'|'debit'|'credit'|null;
export interface Booking{id:string;userId:string;userName:string;professionalId:string;professionalName:string;serviceId:string;serviceName:string;servicePrice:number;duration:number;date:string;time:string;status:BookingStatus;paymentMethod:PaymentMethod;observation?:string;createdAt?:string;rating?:{stars:number;comment:string;date:string}}
export interface BusinessSettings{name:string;phone:string;whatsapp:string;email:string;address:string;description:string;instagram:string;logoUrl?:string;coverUrl?:string;openTime:string;closeTime:string;bookingInterval:number;cancellationHours:number;offDays:string[];theme?:'dark'|'light';qrColor?:string;qrContent?:string;subscriptionStatus?:string;timezone?:string;loyaltyEnabled?:boolean;loyaltyTarget?:number;loyaltyReward?:string}
export interface AppState{users:User[];services:Service[];professionals:Professional[];bookings:Booking[];settings:BusinessSettings;currentUser:User|null}
