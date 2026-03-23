import type { Tenant } from '@/types/domain';

interface TenantHeroProps {
  tenant: Tenant;
}

export function TenantHero({ tenant }: TenantHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-panel">
      <div className="flex flex-col gap-5 px-5 py-6 sm:px-10 sm:py-10 lg:grid lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div>
          <span className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80 sm:text-sm sm:normal-case sm:tracking-normal">
            Agendamento online
          </span>
          <h1 className="text-2xl font-semibold sm:text-4xl">{tenant.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
            Escolha serviço, data e horário na mesma tela e envie sua solicitação em poucos toques.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">Fluxo</p>
            <p className="mt-2 text-sm font-semibold text-white">Tudo em uma etapa</p>
            <p className="mt-1 text-xs leading-5 text-white/70 sm:mt-2 sm:text-sm">Sem trocar de tela para concluir.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">Contato</p>
            <p className="mt-2 break-all text-sm font-semibold text-white">{tenant.whatsapp}</p>
            <p className="mt-1 text-xs leading-5 text-white/70 sm:mt-2 sm:text-sm">Confirmação rápida e suporte via WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
