import type { AppointmentStatus } from '@/types/domain';

const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  pending: 'Em aguarde',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
};

export function getAppointmentStatusLabel(status: AppointmentStatus) {
  return appointmentStatusLabels[status];
}
