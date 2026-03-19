import type { Appointment, ServiceItem, Tenant } from '@/types/domain';
import { formatShortDate } from '@/utils/date';

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export function buildWhatsappMessage(params: {
  tenant: Tenant;
  service: ServiceItem;
  appointment: Appointment;
}) {
  return [
    'Olá! Fiz um agendamento:',
    `Serviço: ${params.service.name}`,
    `Data: ${formatShortDate(params.appointment.date)}`,
    `Horário: ${params.appointment.time}`,
    `Nome: ${params.appointment.customerName}`,
  ].join('\n');
}

export function buildWhatsappLink(params: {
  tenant: Tenant;
  service: ServiceItem;
  appointment: Appointment;
}) {
  const phone = normalizePhone(params.tenant.whatsapp);
  const text = encodeURIComponent(buildWhatsappMessage(params));
  return `https://wa.me/${phone}?text=${text}`;
}
