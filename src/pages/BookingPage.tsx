import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PublicShell } from '@/components/layout/PublicShell';
import { BookingForm, type BookingFormValues } from '@/components/scheduling/BookingForm';
import { DatePickerStrip } from '@/components/scheduling/DatePickerStrip';
import { ServiceSelector } from '@/components/scheduling/ServiceSelector';
import { TenantHero } from '@/components/scheduling/TenantHero';
import { TimeSlotGrid } from '@/components/scheduling/TimeSlotGrid';
import { useTenantTheme } from '@/hooks/useTenantTheme';
import {
  createPublicAppointment,
  getAppointmentsByDate,
  getPublicTenantBySlug,
} from '@/services/tenantPublicApi';
import type { Appointment, ServiceItem } from '@/types/domain';
import { getTodayDate } from '@/utils/date';
import { getAvailableSlots } from '@/utils/scheduling';
import { normalizePhone } from '@/utils/whatsapp';

const initialForm: BookingFormValues = {
  customerName: '',
  customerPhone: '',
  notes: '',
};

export function BookingPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [tenantData, setTenantData] = useState<Awaited<ReturnType<typeof getPublicTenantBySlug>>>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [formValues, setFormValues] = useState<BookingFormValues>(initialForm);

  useEffect(() => {
    async function loadTenant() {
      try {
        setLoading(true);
        setError(undefined);
        const data = await getPublicTenantBySlug(slug);
        setTenantData(data);
        setSelectedServiceId(data.services[0]?.id ?? '');
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar o agendamento.');
      } finally {
        setLoading(false);
      }
    }

    void loadTenant();
  }, [slug]);

  useTenantTheme(tenantData?.tenant.theme);

  useEffect(() => {
    async function loadAppointments() {
      if (!tenantData) return;
      const data = await getAppointmentsByDate(tenantData.tenant.id, selectedDate);
      setAppointments(data);
      setSelectedTime((current) => (data.some((item) => item.time === current) ? '' : current));
    }

    void loadAppointments();
  }, [selectedDate, tenantData]);

  const selectedService = useMemo<ServiceItem | undefined>(
    () => tenantData?.services.find((service) => service.id === selectedServiceId),
    [selectedServiceId, tenantData?.services],
  );

  const availableSlots = useMemo(
    () =>
      getAvailableSlots({
        date: selectedDate,
        appointments,
        businessHours: tenantData?.businessHours ?? [],
      }),
    [appointments, selectedDate, tenantData?.businessHours],
  );

  async function handleSubmit() {
    if (!tenantData || !selectedService || !selectedTime) {
      setError('Selecione serviço, data e horário antes de continuar.');
      return;
    }

    if (normalizePhone(formValues.customerPhone).length < 10) {
      setError('Informe um número de WhatsApp válido.');
      return;
    }

    try {
      setSubmitting(true);
      setError(undefined);
      const appointment = await createPublicAppointment({
        tenantId: tenantData.tenant.id,
        serviceId: selectedService.id,
        serviceNameSnapshot: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        customerName: formValues.customerName.trim(),
        customerPhone: normalizePhone(formValues.customerPhone),
        notes: formValues.notes.trim(),
      });

      navigate(`/agendar/${tenantData.tenant.slug}/sucesso`, {
        state: {
          tenant: tenantData.tenant,
          service: selectedService,
          appointment,
        },
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível concluir o agendamento.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <PublicShell>
        <div className="rounded-3xl bg-white p-10 text-center shadow-panel">Carregando agenda...</div>
      </PublicShell>
    );
  }

  if (error && !tenantData) {
    return (
      <PublicShell>
        <div className="rounded-3xl bg-white p-10 shadow-panel">
          <p className="text-lg font-semibold text-slate-900">Não foi possível carregar o agendamento.</p>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </div>
      </PublicShell>
    );
  }

  if (!tenantData) {
    return null;
  }

  return (
    <PublicShell>
      <div className="space-y-8">
        <TenantHero tenant={tenantData.tenant} />

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-6 shadow-panel sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">1. Escolha o serviço</h2>
              <p className="mt-2 text-sm text-slate-600">Selecione o atendimento que você deseja agendar.</p>
              <div className="mt-6">
                <ServiceSelector
                  services={tenantData.services}
                  selectedServiceId={selectedServiceId}
                  onSelect={setSelectedServiceId}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-panel sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">2. Selecione a data</h2>
              <div className="mt-6">
                <DatePickerStrip selectedDate={selectedDate} onSelect={setSelectedDate} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-panel sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">3. Escolha um horário</h2>
              <div className="mt-6">
                <TimeSlotGrid slots={availableSlots} selectedTime={selectedTime} onSelect={setSelectedTime} />
              </div>
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-6 shadow-panel sm:p-8">
            <span className="inline-flex rounded-full bg-tenant-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              Resumo do agendamento
            </span>
            <div className="mt-6 space-y-4 rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <SummaryItem label="Serviço" value={selectedService?.name ?? 'Selecione um serviço'} />
              <SummaryItem label="Data" value={new Intl.DateTimeFormat('pt-BR').format(new Date(`${selectedDate}T12:00:00`))} />
              <SummaryItem label="Horário" value={selectedTime || 'Selecione um horário'} />
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900">4. Seus dados</h3>
              <p className="mt-2 text-sm text-slate-600">
                Informe seu nome e WhatsApp para enviar a solicitação de agendamento.
              </p>
              <div className="mt-6">
                <BookingForm
                  values={formValues}
                  onChange={setFormValues}
                  onSubmit={handleSubmit}
                  loading={submitting}
                  error={error}
                />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </PublicShell>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
