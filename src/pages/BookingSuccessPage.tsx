import { Link, Navigate, useLocation } from 'react-router-dom';
import { PublicShell } from '@/components/layout/PublicShell';
import { FloatingWhatsappButton } from '@/components/scheduling/FloatingWhatsappButton';
import type { BookingSuccessState } from '@/types/domain';
import { getAppointmentStatusLabel } from '@/utils/appointmentStatus';
import { formatShortDate } from '@/utils/date';
import { buildWhatsappLink } from '@/utils/whatsapp';

export function BookingSuccessPage() {
  const location = useLocation();
  const state = location.state as BookingSuccessState | undefined;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const whatsappLink = buildWhatsappLink(state);
  const initialStatusLabel = getAppointmentStatusLabel(state.appointment.status);

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-panel sm:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tenant-soft text-3xl">
          ✅
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">Agendamento enviado com sucesso!</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Seu pedido foi registrado com status inicial <strong>{initialStatusLabel}</strong>. Agora você pode confirmar os detalhes rapidamente pelo WhatsApp.
        </p>

        <div className="mt-10 grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 sm:grid-cols-2">
          <SuccessItem label="Negócio" value={state.tenant.name} />
          <SuccessItem label="Serviço" value={state.service.name} />
          <SuccessItem label="Data" value={formatShortDate(state.appointment.date)} />
          <SuccessItem label="Horário" value={state.appointment.time} />
          <SuccessItem label="Status" value={initialStatusLabel} />
          <SuccessItem label="Cliente" value={state.appointment.customerName} />
          <SuccessItem label="WhatsApp" value={state.appointment.customerPhone} />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-tenant-primary px-6 py-4 text-base font-semibold text-tenant-text shadow-lg transition hover:brightness-95"
          >
            Abrir WhatsApp para confirmar
          </a>
          <Link
            to={`/agendar/${state.tenant.slug}`}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 text-base font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Fazer novo agendamento
          </Link>
        </div>
      </div>
      <FloatingWhatsappButton href={whatsappLink} label="Abrir WhatsApp para confirmar agendamento" />
    </PublicShell>
  );
}

function SuccessItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
