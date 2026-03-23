import type { Appointment, ServiceItem, Tenant } from '@/types/domain';
import { formatShortDate } from '@/utils/date';

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export function buildDirectWhatsappLink(phone: string, text?: string) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return '';
  }

  return text
    ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${normalizedPhone}`;
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
  return buildDirectWhatsappLink(params.tenant.whatsapp, buildWhatsappMessage(params));
}
