# BarberFlow 3.0 — SaaS

Arquitetura preparada para **Vercel + Neon PostgreSQL + Mercado Pago**. Cada barbearia é um tenant isolado no mesmo banco. O domínio é normal (sem subdomínios): a página pública usa `/b/<slug>`.

## Stack
- Frontend: React + Vite + Tailwind
- Hosting: Vercel
- API: Vercel Functions em `api/`
- Banco: PostgreSQL no Neon
- Cobrança: Mercado Pago Assinaturas
- Sessão: cookie HttpOnly assinado

## Deploy
1. Crie um PostgreSQL no Neon e copie `DATABASE_URL`.
2. Execute as migrations versionadas em `database/migrations/` na ordem.
3. No Vercel, configure as variáveis de `.env.example`.
4. Faça deploy.
5. Crie a conta master uma única vez:
   `POST /api/master/bootstrap` com header `x-bootstrap-secret: <MASTER_BOOTSTRAP_SECRET>` e body `{ "name": "Seu Nome", "email": "seu@email.com", "password": "senha-forte" }`.
6. Entre em `/master#login` para abrir o painel master.
7. No Mercado Pago, configure `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET` e `MERCADO_PAGO_MONTHLY_AMOUNT`.\n8. Configure o webhook `https://SEU-DOMINIO/api/billing/webhook` para eventos de assinaturas (`subscription_preapproval` e `subscription_authorized_payment`).

## Operação comercial
- Você cria cada barbearia pelo Painel Master.
- Cada cliente recebe uma URL normal: `https://seu-dominio.com/b/barbearia-demo`.
- O responsável da barbearia entra, administra agenda/serviços/clientes e assina mensalmente pelo Mercado Pago.
- Os dados de cada tenant são filtrados por `tenant_id` no backend.

## Segurança
Nunca coloque `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET`, `DATABASE_URL`, `AUTH_SECRET` ou `MASTER_BOOTSTRAP_SECRET` no frontend. A cobrança é criada e validada exclusivamente pelo backend.
