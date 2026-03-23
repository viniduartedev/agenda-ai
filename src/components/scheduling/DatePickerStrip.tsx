import { addDays, formatDisplayDate } from '@/utils/date';

interface DatePickerStripProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  startDate?: string;
}

export function DatePickerStrip({ selectedDate, onSelect, startDate }: DatePickerStripProps) {
  const dates = Array.from({ length: 7 }, (_, index) => addDays(startDate ?? selectedDate, index));

  return (
    <div className="flex w-full gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:pb-0 xl:grid-cols-4">
      {dates.map((date) => {
        const selected = date === selectedDate;
        return (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={`rounded-2xl border px-3 py-3 text-left transition ${
              selected
                ? 'border-tenant-primary bg-tenant-soft shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            } min-w-[132px] shrink-0 md:min-w-0 md:px-4 md:py-4`}
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Data
            </span>
            <span className="mt-2 block text-sm font-medium capitalize leading-5 text-slate-900">
              {formatDisplayDate(date)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
