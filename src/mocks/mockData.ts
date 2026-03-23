import type { Appointment, BusinessHours, ServiceItem, Tenant } from '@/types/domain';

export const mockTenant: Tenant = {
  id: 'tenant-clinica-devtec',
  name: 'Clinica DevTec',
  slug: 'clinica-devtec',
  whatsapp: '5511999999999',
  active: true,
  theme: {
    primaryColor: '#7c3aed',
    secondaryColor: '#22c55e',
  },
};

export const mockServices: ServiceItem[] = [
  {
    id: 'service-corte',
    tenantId: mockTenant.id,
    name: 'Corte Premium',
    description: 'Corte completo com finalização e consultoria rápida de estilo.',
    durationMinutes: 45,
    active: true,
  },
  {
    id: 'service-barba',
    tenantId: mockTenant.id,
    name: 'Barba Express',
    description: 'Acabamento de barba com toalha quente e modelagem.',
    durationMinutes: 30,
    active: true,
  },
  {
    id: 'service-combo',
    tenantId: mockTenant.id,
    name: 'Combo Corte + Barba',
    description: 'Experiência completa para manter o visual impecável.',
    durationMinutes: 60,
    active: true,
  },
];

export const mockBusinessHours: BusinessHours[] = [0, 1, 2, 3, 4, 5].flatMap((weekday) => [
  {
    id: `bh-${weekday}-morning`,
    tenantId: mockTenant.id,
    weekday,
    startTime: '09:00',
    endTime: '12:00',
    intervalMinutes: 30,
    active: true,
  },
  {
    id: `bh-${weekday}-afternoon`,
    tenantId: mockTenant.id,
    weekday,
    startTime: '13:00',
    endTime: '19:00',
    intervalMinutes: 30,
    active: true,
  },
]);

const today = new Date();
const yyyyMmDd = today.toISOString().slice(0, 10);

export const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    tenantId: mockTenant.id,
    serviceId: 'service-corte',
    serviceNameSnapshot: 'Corte Premium',
    date: yyyyMmDd,
    time: '10:00',
    customerName: 'Cliente Exemplo',
    customerPhone: '5511988887777',
    notes: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'appt-2',
    tenantId: mockTenant.id,
    serviceId: 'service-barba',
    serviceNameSnapshot: 'Barba Express',
    date: yyyyMmDd,
    time: '14:00',
    customerName: 'João Teste',
    customerPhone: '5511977776666',
    notes: '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
