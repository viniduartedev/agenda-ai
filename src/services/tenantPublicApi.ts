import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { firestore, useMockApi } from '@/services/firebase';
import { mockAppointments, mockBusinessHours, mockServices, mockTenant } from '@/mocks/mockData';
import type { Appointment, AppointmentPayload, BusinessHours, ServiceItem, Tenant } from '@/types/domain';

export interface PublicBookingData {
  tenant: Tenant;
  services: ServiceItem[];
  businessHours: BusinessHours[];
}

function mapAppointment(id: string, data: Record<string, unknown>): Appointment {
  return {
    id,
    tenantId: String(data.tenantId),
    serviceId: String(data.serviceId),
    serviceNameSnapshot: String(data.serviceNameSnapshot),
    date: String(data.date),
    time: String(data.time),
    customerName: String(data.customerName),
    customerPhone: String(data.customerPhone),
    notes: String(data.notes ?? ''),
    status: (data.status as Appointment['status']) ?? 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getPublicTenantBySlug(slug: string): Promise<PublicBookingData> {
  if (useMockApi) {
    if (slug !== mockTenant.slug) {
      throw new Error('Tenant não encontrado.');
    }

    return {
      tenant: mockTenant,
      services: mockServices.filter((service) => service.active),
      businessHours: mockBusinessHours.filter((item) => item.active),
    };
  }

  if (!firestore) {
    throw new Error('Firestore não configurado.');
  }

  const tenantSnapshot = await getDocs(
    query(collection(firestore, 'tenants'), where('slug', '==', slug), where('active', '==', true)),
  );

  const tenantDoc = tenantSnapshot.docs[0];

  if (!tenantDoc) {
    throw new Error('Tenant não encontrado.');
  }

  const tenant = { id: tenantDoc.id, ...(tenantDoc.data() as Omit<Tenant, 'id'>) };

  const [servicesSnapshot, hoursSnapshot] = await Promise.all([
    getDocs(
      query(
        collection(firestore, 'services'),
        where('tenantId', '==', tenant.id),
        where('active', '==', true),
      ),
    ),
    getDocs(
      query(
        collection(firestore, 'businessHours'),
        where('tenantId', '==', tenant.id),
        where('active', '==', true),
      ),
    ),
  ]);

  return {
    tenant,
    services: servicesSnapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ServiceItem, 'id'>) })),
    businessHours: hoursSnapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BusinessHours, 'id'>) })),
  };
}

export async function getAppointmentsByDate(tenantId: string, date: string): Promise<Appointment[]> {
  if (useMockApi) {
    return mockAppointments.filter((appointment) => appointment.tenantId === tenantId && appointment.date === date);
  }

  if (!firestore) {
    throw new Error('Firestore não configurado.');
  }

  const appointmentSnapshot = await getDocs(
    query(
      collection(firestore, 'appointments'),
      where('tenantId', '==', tenantId),
      where('date', '==', date),
    ),
  );

  return appointmentSnapshot.docs.map((item) => mapAppointment(item.id, item.data()));
}

export async function createPublicAppointment(payload: AppointmentPayload): Promise<Appointment> {
  if (useMockApi) {
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      ...payload,
      notes: payload.notes ?? '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAppointments.push(appointment);
    return appointment;
  }

  if (!firestore) {
    throw new Error('Firestore não configurado.');
  }

  const tenantRef = doc(firestore, 'tenants', payload.tenantId);
  const tenantSnapshot = await getDoc(tenantRef);

  if (!tenantSnapshot.exists()) {
    throw new Error('Tenant inválido para agendamento.');
  }

  const createdRef = await addDoc(collection(firestore, 'appointments'), {
    ...payload,
    notes: payload.notes ?? '',
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: createdRef.id,
    ...payload,
    notes: payload.notes ?? '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
