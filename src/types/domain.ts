export interface TenantTheme {
  primaryColor: string;
  secondaryColor?: string;
  logoUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  whatsapp: string;
  active: boolean;
  theme: TenantTheme;
}

export interface ServiceItem {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  active: boolean;
}

export interface BusinessHours {
  id: string;
  tenantId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  intervalMinutes: number;
  active: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  tenantId: string;
  serviceId: string;
  serviceNameSnapshot: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentPayload {
  tenantId: string;
  serviceId: string;
  serviceNameSnapshot: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export interface BookingSuccessState {
  tenant: Tenant;
  service: ServiceItem;
  appointment: Appointment;
}
