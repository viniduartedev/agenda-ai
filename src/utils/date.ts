const ptBr = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

export function formatDisplayDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return ptBr.format(parsed);
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T12:00:00`));
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(date: string, days: number) {
  const parsed = new Date(`${date}T12:00:00`);
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString().slice(0, 10);
}

export function getWeekday(date: string) {
  return new Date(`${date}T12:00:00`).getDay();
}
