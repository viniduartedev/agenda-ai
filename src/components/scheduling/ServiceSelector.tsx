import type { ServiceItem } from '@/types/domain';

interface ServiceSelectorProps {
  services: ServiceItem[];
  selectedServiceId: string;
  onSelect: (serviceId: string) => void;
}

export function ServiceSelector({ services, selectedServiceId, onSelect }: ServiceSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {services.map((service) => {
        const selected = selectedServiceId === service.id;
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            className={`rounded-2xl border p-5 text-left transition-all ${
              selected
                ? 'border-tenant-primary bg-tenant-soft ring-2 ring-tenant-primary/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {service.durationMinutes} min
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
