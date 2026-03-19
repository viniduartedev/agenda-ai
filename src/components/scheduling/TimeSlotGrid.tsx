interface TimeSlotGridProps {
  slots: string[];
  selectedTime: string;
  onSelect: (time: string) => void;
}

export function TimeSlotGrid({ slots, selectedTime, onSelect }: TimeSlotGridProps) {
  if (!slots.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Não há horários disponíveis para a data selecionada.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {slots.map((slot) => {
        const selected = slot === selectedTime;
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onSelect(slot)}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              selected
                ? 'border-tenant-primary bg-tenant-primary text-tenant-text'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
