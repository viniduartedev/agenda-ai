import type { ChangeEvent, FormEvent } from 'react';

export interface BookingFormValues {
  customerName: string;
  customerPhone: string;
  notes: string;
}

interface BookingFormProps {
  values: BookingFormValues;
  loading: boolean;
  error?: string;
  onChange: (values: BookingFormValues) => void;
  onSubmit: () => void;
}

export function BookingForm({ values, loading, error, onChange, onSubmit }: BookingFormProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange({
      ...values,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Nome</span>
          <input
            required
            name="customerName"
            value={values.customerName}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-tenant-primary"
            placeholder="Seu nome completo"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">WhatsApp</span>
          <input
            required
            name="customerPhone"
            value={values.customerPhone}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-tenant-primary"
            placeholder="(11) 99999-9999"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Observações</span>
        <textarea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-tenant-primary"
          placeholder="Alguma informação adicional para o atendimento?"
        />
      </label>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-tenant-primary px-5 py-4 text-base font-semibold text-tenant-text shadow-lg transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Confirmando agendamento...' : 'Confirmar agendamento'}
      </button>
    </form>
  );
}
