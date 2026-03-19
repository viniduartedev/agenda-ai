import type { Tenant } from '@/types/domain';

interface TenantHeroProps {
  tenant: Tenant;
}

export function TenantHero({ tenant }: TenantHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-panel">
      <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div>
          <span className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
            Agendamento online
          </span>
          <h1 className="text-3xl font-semibold sm:text-4xl">{tenant.name}</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Escolha o serviço ideal, selecione o melhor horário e finalize seu agendamento em poucos passos.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--tenant-primary-soft)' }}>
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">WhatsApp</p>
            <p className="mt-2 text-2xl font-semibold">{tenant.whatsapp}</p>
            <p className="mt-3 text-sm text-white/75">
              Atendimento rápido e confirmação simplificada direto pelo WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
