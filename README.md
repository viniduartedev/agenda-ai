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

No Firebase Hosting, o acesso direto a essas URLs funciona via `rewrite` para `/index.html`.

## Ambiente
1. Copie `.env.example` para `.env`.
2. Defina as credenciais Firebase.
3. Para rodar com mock local, mantenha `VITE_ENABLE_MOCK_API=true`.

## Firebase
1. Rode `npm run build`.
2. Faça login no CLI com `firebase login`, se ainda precisar.
3. Publique com `firebase deploy`.

Arquivos adicionados para o deploy:
- `firebase.json` com `rewrite` SPA para suportar `/agendar/:slug`
- `firestore.rules` para leitura pública do tenant/agenda e criação de agendamento
- `firestore.indexes.json` para as consultas por `slug`, `tenantId` e `date`

## Tenant demo
- `/agendar/clinica-devtec`
