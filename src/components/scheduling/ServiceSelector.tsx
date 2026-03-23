import type { ServiceItem } from '@/types/domain';

interface ServiceSelectorProps {
  services: ServiceItem[];
  selectedServiceId: string;
  onSelect: (serviceId: string) => void;
}

export function ServiceSelector({ services, selectedServiceId, onSelect }: ServiceSelectorProps) {
  const desktopGridClass = services.length >= 3
    ? 'md:grid-cols-2 lg:grid-cols-3'
    : services.length === 2
      ? 'md:grid-cols-2'
      : 'md:grid-cols-1';

  return (
    <div className={`flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:overflow-visible md:pb-0 ${desktopGridClass}`}>
      {services.map((service) => {
        const selected = selectedServiceId === service.id;
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            className={`min-w-[236px] shrink-0 snap-start rounded-2xl border p-4 text-left transition-all md:min-h-[192px] md:min-w-0 md:p-6 ${
              selected
                ? 'border-tenant-primary bg-tenant-soft ring-2 ring-tenant-primary/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex h-full flex-col justify-between gap-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="max-w-[14rem] text-base font-semibold text-slate-900 sm:text-lg">{service.name}</h3>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                  {service.durationMinutes} min
                </span>
              </div>

              <div>
                {service.description ? (
                  <p className="mt-2 text-sm leading-5 text-slate-600 sm:leading-6">{service.description}</p>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
