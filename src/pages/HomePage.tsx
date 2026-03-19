import { Link } from 'react-router-dom';
import { PublicShell } from '@/components/layout/PublicShell';

export function HomePage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-panel sm:p-12">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          DevTec Agenda
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Agendamento público para negócios locais com experiência simples e premium.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Use a rota do tenant para acessar o fluxo de agendamento. Para testar o MVP localmente, abra o exemplo abaixo.
        </p>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-500">Link de demonstração</p>
          <Link
            to="/agendar/devtec-barbearia"
            className="mt-3 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Abrir agendamento demo
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
