import type { Appointment, BusinessHours } from '@/types/domain';
import { getWeekday } from '@/utils/date';

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export interface TimeSlotOption {
  time: string;
  available: boolean;
}

export function generateTimeSlots(hours: BusinessHours[]) {
  return hours.flatMap((block) => {
    const start = timeToMinutes(block.startTime);
    const end = timeToMinutes(block.endTime);
    const slots: string[] = [];

    for (let current = start; current < end; current += block.intervalMinutes) {
      slots.push(minutesToTime(current));
    }

    return slots;
  });
}

export function getTimeSlots(params: {
  date: string;
  businessHours: BusinessHours[];
  appointments: Appointment[];
}): TimeSlotOption[] {
  const weekday = getWeekday(params.date);
  const activeHours = params.businessHours.filter((item) => item.active && item.weekday === weekday);

  if (!activeHours.length) {
    return [];
  }

  const occupied = new Set(
    params.appointments
      .filter((appointment) => appointment.date === params.date && appointment.status !== 'cancelled')
      .map((appointment) => appointment.time),
  );

  return [...new Set(generateTimeSlots(activeHours))]
    .sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
    .map((time) => ({
      time,
      available: !occupied.has(time),
    }));
}

export function getAvailableSlots(params: {
  date: string;
  businessHours: BusinessHours[];
  appointments: Appointment[];
}) {
  return getTimeSlots(params)
    .filter((slot) => slot.available)
    .map((slot) => slot.time);
}
