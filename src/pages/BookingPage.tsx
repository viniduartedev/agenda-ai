import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PublicShell } from '@/components/layout/PublicShell';
import { BookingForm, type BookingFormValues } from '@/components/scheduling/BookingForm';
import { DatePickerStrip } from '@/components/scheduling/DatePickerStrip';
import { FloatingWhatsappButton } from '@/components/scheduling/FloatingWhatsappButton';
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
import { formatShortDate, getTodayDate } from '@/utils/date';
import { getTimeSlots } from '@/utils/scheduling';
import { buildDirectWhatsappLink, normalizePhone } from '@/utils/whatsapp';

const initialForm: BookingFormValues = {
  customerName: '',
  customerPhone: '',
  notes: '',
};

export function BookingPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const today = useMemo(() => getTodayDate(), []);
  const dateStepRef = useRef<HTMLDivElement>(null);
  const timeStepRef = useRef<HTMLDivElement>(null);
  const formStepRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [tenantData, setTenantData] = useState<Awaited<ReturnType<typeof getPublicTenantBySlug>>>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState(today);
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

      try {
        const data = await getAppointmentsByDate(tenantData.tenant.id, selectedDate);
        setAppointments(data);
      } catch (loadError) {
        setAppointments([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Não foi possível carregar os horários disponíveis no momento.',
        );
      }
    }

    void loadAppointments();
  }, [selectedDate, tenantData]);

  const selectedService = useMemo<ServiceItem | undefined>(
    () => tenantData?.services.find((service) => service.id === selectedServiceId),
    [selectedServiceId, tenantData?.services],
  );

  const timeSlots = useMemo(
    () =>
      getTimeSlots({
        date: selectedDate,
        appointments,
        businessHours: tenantData?.businessHours ?? [],
      }),
    [appointments, selectedDate, tenantData?.businessHours],
  );

  const availableSlotCount = useMemo(
    () => timeSlots.filter((slot) => slot.available).length,
    [timeSlots],
  );

  const selectedSlot = useMemo(
    () => timeSlots.find((slot) => slot.time === selectedTime),
    [selectedTime, timeSlots],
  );

  const slotFeedback = useMemo(() => {
    if (!timeSlots.length) {
      return 'Não há expediente disponível para a data selecionada.';
    }

    if (!availableSlotCount) {
      return 'Todos os horários desta data estão desativados no momento.';
    }

    return `${availableSlotCount} ${availableSlotCount === 1 ? 'horário disponível' : 'horários disponíveis'}. Os indisponíveis aparecem como Desativado.`;
  }, [availableSlotCount, timeSlots.length]);

  useEffect(() => {
    setSelectedTime((current) => (
      timeSlots.some((slot) => slot.time === current && slot.available) ? current : ''
    ));
  }, [timeSlots]);

  function scrollToNextStep(target: RefObject<HTMLElement | null>) {
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    window.setTimeout(() => {
      target.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 180);
  }

  function handleServiceSelect(serviceId: string) {
    setSelectedServiceId(serviceId);
    scrollToNextStep(dateStepRef);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    scrollToNextStep(timeStepRef);
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    scrollToNextStep(formStepRef);
  }

  async function handleSubmit() {
    if (!tenantData || !selectedService || !selectedTime) {
      setError('Selecione serviço, data e horário antes de continuar.');
      return;
    }

    if (!selectedSlot?.available) {
      setError('Esse horário não está mais disponível. Escolha outro para continuar.');
      return;
    }

    if (!formValues.customerName.trim()) {
      setError('Informe seu nome antes de continuar.');
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

  const floatingWhatsappLink = buildDirectWhatsappLink(
    tenantData.tenant.whatsapp,
    'Olá! Gostaria de tirar uma dúvida sobre o agendamento.',
  );

  return (
    <PublicShell>
      <div className="space-y-4 sm:space-y-6">
        <TenantHero tenant={tenantData.tenant} />

        <section className="rounded-[2rem] bg-white p-4 shadow-panel sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-tenant-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                Fluxo simplificado
              </span>
              <h2 className="mt-3 text-xl font-semibold text-slate-950 sm:mt-4 sm:text-3xl">
                Escolha e confirme em uma única tela
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                No mobile, tudo fica concentrado aqui com menos blocos empilhados e sem troca de etapa.
              </p>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[420px] lg:gap-3">
              <SummaryCard
                label="Serviço"
                value={selectedService?.name ?? 'Selecione'}
                className="col-span-2 sm:col-span-1"
              />
              <SummaryCard label="Data" value={formatShortDate(selectedDate)} />
              <SummaryCard label="Horário" value={selectedTime || 'Escolha'} />
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="min-w-0 space-y-6 lg:hidden">
              <div className="min-w-0 rounded-3xl border border-slate-200 p-4 sm:p-5">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 sm:hidden">
                  Toque nos cards para montar seu agendamento sem sair desta tela.
                </p>

                <div className="border-b border-slate-100 pb-5">
                  <StepHeader
                    step="1"
                    title="Escolha o serviço"
                    description="Arraste para o lado no celular para ver todas as opções."
                  />
                  <div className="mt-4 min-w-0">
                    <ServiceSelector
                      services={tenantData.services}
                      selectedServiceId={selectedServiceId}
                      onSelect={handleServiceSelect}
                    />
                  </div>
                </div>

                <div className="grid gap-5 pt-5 xl:grid-cols-[0.92fr_1.08fr]">
                  <div ref={dateStepRef} className="min-w-0 scroll-mt-24 xl:pr-5">
                    <StepHeader
                      step="2"
                      title="Selecione a data"
                      description="Mostramos os próximos 7 dias para facilitar a escolha."
                    />
                    <div className="mt-4 min-w-0">
                      <DatePickerStrip
                        selectedDate={selectedDate}
                        startDate={today}
                        onSelect={handleDateSelect}
                      />
                    </div>
                  </div>

                  <div
                    ref={timeStepRef}
                    className="min-w-0 scroll-mt-24 border-t border-slate-100 pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0"
                  >
                    <StepHeader
                      step="3"
                      title="Escolha o horário"
                      description={slotFeedback}
                    />
                    <div className="mt-4 min-w-0">
                      <TimeSlotGrid
                        slots={timeSlots}
                        selectedTime={selectedTime}
                        onSelect={handleTimeSelect}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <aside ref={formStepRef} className="scroll-mt-24 min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6 lg:hidden">
                <span className="inline-flex rounded-full bg-tenant-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                  4. Seus dados
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-950 sm:text-2xl">Finalize sua solicitação</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Preencha seus dados para enviar o pedido de agendamento e seguir pelo WhatsApp.
                </p>

                <div className="mt-5 space-y-4 rounded-3xl bg-white p-5 shadow-sm">
                  <SummaryItem label="Serviço" value={selectedService?.name ?? 'Selecione um serviço'} />
                  <SummaryItem label="Data" value={formatShortDate(selectedDate)} />
                  <SummaryItem label="Horário" value={selectedTime || 'Selecione um horário'} />
                </div>

                <div className="mt-5">
                  <BookingForm
                    values={formValues}
                    onChange={setFormValues}
                    onSubmit={handleSubmit}
                    loading={submitting}
                    error={error}
                  />
                </div>
              </aside>
            </div>

            <div className="hidden min-w-0 space-y-6 lg:block">
              <div className="rounded-3xl border border-slate-200 p-6 shadow-sm sm:p-8">
                <StepHeader
                  step="1"
                  title="Escolha o serviço"
                  description="Selecione o atendimento que você deseja agendar."
                />
                <div className="mt-6 min-w-0">
                  <ServiceSelector
                    services={tenantData.services}
                    selectedServiceId={selectedServiceId}
                    onSelect={setSelectedServiceId}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 p-6 shadow-sm sm:p-8">
                <StepHeader
                  step="2"
                  title="Selecione a data"
                  description="Mostramos os próximos 7 dias para facilitar a escolha."
                />
                <div className="mt-6 min-w-0">
                  <DatePickerStrip
                    selectedDate={selectedDate}
                    startDate={today}
                    onSelect={setSelectedDate}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 p-6 shadow-sm sm:p-8">
                <StepHeader
                  step="3"
                  title="Escolha o horário"
                  description={slotFeedback}
                />
                <div className="mt-6 min-w-0">
                  <TimeSlotGrid
                    slots={timeSlots}
                    selectedTime={selectedTime}
                    onSelect={setSelectedTime}
                  />
                </div>
              </div>
            </div>

            <aside className="hidden min-w-0 self-start rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6 lg:sticky lg:top-6 lg:block">
              <span className="inline-flex rounded-full bg-tenant-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                4. Seus dados
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">Finalize sua solicitação</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Preencha seus dados para enviar o pedido de agendamento e seguir pelo WhatsApp.
              </p>

              <div className="mt-6 space-y-4 rounded-3xl bg-white p-5 shadow-sm">
                <SummaryItem label="Serviço" value={selectedService?.name ?? 'Selecione um serviço'} />
                <SummaryItem label="Data" value={formatShortDate(selectedDate)} />
                <SummaryItem label="Horário" value={selectedTime || 'Selecione um horário'} />
              </div>

              <div className="mt-6">
                <BookingForm
                  values={formValues}
                  onChange={setFormValues}
                  onSubmit={handleSubmit}
                  loading={submitting}
                  error={error}
                />
              </div>
            </aside>
          </div>
        </section>

        <FloatingWhatsappButton
          href={floatingWhatsappLink}
          label={`Abrir WhatsApp de ${tenantData.tenant.name}`}
        />
      </div>
    </PublicShell>
  );
}

function StepHeader({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Etapa {step}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-950 sm:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">{label}</p>
      <p className="mt-2 break-words text-xs font-medium leading-4 text-slate-900 sm:text-sm sm:leading-5">{value}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
