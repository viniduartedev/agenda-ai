# DevTec Agenda - App Pública

MVP da aplicação pública de agendamento online para SaaS multi-tenant.

## Stack
- React + Vite + TypeScript
- React Router
- Tailwind CSS
- Firebase Firestore SDK

## Rotas
- `/`
- `/agendar/:slug`
- `/agendar/:slug/sucesso`

## Ambiente
1. Copie `.env.example` para `.env`.
2. Defina as credenciais Firebase.
3. Para rodar com mock local, mantenha `VITE_ENABLE_MOCK_API=true`.

## Tenant demo
- `/agendar/devtec-barbearia`
