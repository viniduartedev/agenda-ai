import type { TimeSlotOption } from '@/utils/scheduling';

interface TimeSlotGridProps {
  slots: TimeSlotOption[];
  selectedTime: string;
  onSelect: (time: string) => void;
}

export function TimeSlotGrid({ slots, selectedTime, onSelect }: TimeSlotGridProps) {
  if (!slots.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Não há atendimento disponível para a data selecionada.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        <LegendBadge label="Disponível" tone="available" />
        <LegendBadge label="Selecionado" tone="selected" />
        <LegendBadge label="Desativado" tone="disabled" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => {
          const selected = slot.time === selectedTime;
          const disabled = !slot.available;
          const stateLabel = disabled ? 'Desativado' : selected ? 'Selecionado' : 'Disponível';
          return (
            <button
              key={slot.time}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => {
                if (!disabled) {
                  onSelect(slot.time);
                }
              }}
              className={`flex min-h-[70px] flex-col items-start justify-between rounded-2xl border px-3 py-3 text-left transition sm:min-h-[78px] sm:px-4 ${
                selected && !disabled
                  ? 'border-tenant-primary bg-tenant-primary text-tenant-text'
                  : disabled
                    ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-90'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className={`text-sm font-semibold ${disabled ? 'line-through decoration-slate-300' : ''}`}>
                {slot.time}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px] ${
                  disabled
                    ? 'text-slate-400'
                    : selected
                      ? 'text-tenant-text/75'
                      : 'text-emerald-600'
                }`}
              >
                {stateLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LegendBadge({
  label,
  tone,
}: {
  label: string;
  tone: 'available' | 'selected' | 'disabled';
}) {
  const classes = {
    available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    selected: 'border-tenant-primary/20 bg-tenant-soft text-slate-700',
    disabled: 'border-slate-200 bg-slate-100 text-slate-500',
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${classes[tone]}`}>
      {label}
    </span>
  );
}
