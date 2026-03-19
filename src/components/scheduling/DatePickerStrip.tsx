import { addDays, formatDisplayDate } from '@/utils/date';

interface DatePickerStripProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

export function DatePickerStrip({ selectedDate, onSelect }: DatePickerStripProps) {
  const dates = Array.from({ length: 7 }, (_, index) => addDays(selectedDate, index));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {dates.map((date) => {
        const selected = date === selectedDate;
        return (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              selected
                ? 'border-tenant-primary bg-tenant-soft shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Data
            </span>
            <span className="mt-2 block text-sm font-medium capitalize text-slate-900">{formatDisplayDate(date)}</span>
          </button>
        );
      })}
    </div>
  );
}
