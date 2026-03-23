import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  writeBatch,
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
      collection(firestore, 'publicAppointments'),
      where('tenantId', '==', tenantId),
      where('date', '==', date),
    ),
  );

  return appointmentSnapshot.docs.map((item) =>
    mapAppointment(item.id, {
      ...item.data(),
      serviceId: '',
      serviceNameSnapshot: '',
      customerName: '',
      customerPhone: '',
      notes: '',
    }),
  );
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

  const serviceRef = doc(firestore, 'services', payload.serviceId);
  const serviceSnapshot = await getDoc(serviceRef);

  if (
    !serviceSnapshot.exists()
    || serviceSnapshot.data().tenantId !== payload.tenantId
    || serviceSnapshot.data().active !== true
  ) {
    throw new Error('Serviço inválido para o tenant informado.');
  }

  const occupiedSlotsSnapshot = await getDocs(
    query(
      collection(firestore, 'publicAppointments'),
      where('tenantId', '==', payload.tenantId),
      where('date', '==', payload.date),
    ),
  );

  const slotAlreadyTaken = occupiedSlotsSnapshot.docs.some((item) => {
    const data = item.data();
    return data.time === payload.time && data.status !== 'cancelled';
  });

  if (slotAlreadyTaken) {
    throw new Error('Esse horário acabou de ficar indisponível. Escolha outro para continuar.');
  }

  const appointmentRef = doc(collection(firestore, 'appointments'));
  const publicAppointmentRef = doc(firestore, 'publicAppointments', appointmentRef.id);
  const batch = writeBatch(firestore);
  const timestamp = {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  batch.set(appointmentRef, {
    ...payload,
    notes: payload.notes ?? '',
    status: 'pending',
    ...timestamp,
  });

  batch.set(publicAppointmentRef, {
    tenantId: payload.tenantId,
    date: payload.date,
    time: payload.time,
    status: 'pending',
    ...timestamp,
  });

  await batch.commit();

  return {
    id: appointmentRef.id,
    ...payload,
    notes: payload.notes ?? '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
