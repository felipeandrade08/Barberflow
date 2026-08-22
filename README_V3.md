# BarberFlow 3.0 — SaaS

Arquitetura preparada para **Vercel + Railway PostgreSQL + Stripe**. Cada barbearia é um tenant isolado no mesmo banco. O domínio é normal (sem subdomínios): a página pública usa `/b/<slug>`.

## Stack
- Frontend: React + Vite + Tailwind
- Hosting: Vercel
- API: Vercel Functions em `api/`
- Banco: PostgreSQL no Railway
- Cobrança: Stripe Subscriptions / Checkout
- Sessão: cookie HttpOnly assinado

## Deploy
1. Crie um PostgreSQL no Railway e copie `DATABASE_URL`.
2. Execute `database/schema.sql` e opcionalmente `database/seed-demo.sql`.
3. No Vercel, configure as variáveis de `.env.example`.
4. Faça deploy.
5. Crie a conta master uma única vez:
   `POST /api/master/bootstrap` com header `x-bootstrap-secret: <MASTER_BOOTSTRAP_SECRET>` e body `{ "name": "Seu Nome", "email": "seu@email.com", "password": "senha-forte" }`.
6. Entre em `/master#login` para abrir o painel master.
7. No Stripe, crie um produto mensal e coloque o `price_...` em `STRIPE_PRICE_ID`.
8. Crie o webhook para `https://SEU-DOMINIO/api/billing/webhook` com eventos `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated` e `customer.subscription.deleted`.

## Operação comercial
- Você cria cada barbearia pelo Painel Master.
- Cada cliente recebe uma URL normal: `https://seu-dominio.com/b/barbearia-demo`.
- O responsável da barbearia entra, administra agenda/serviços/clientes e assina mensalmente pelo Stripe.
- Os dados de cada tenant são filtrados por `tenant_id` no backend.

## Segurança
Nunca coloque `STRIPE_SECRET_KEY`, `DATABASE_URL`, `AUTH_SECRET` ou `MASTER_BOOTSTRAP_SECRET` no frontend. O cartão nunca passa pelo BarberFlow: o Stripe Checkout processa a cobrança.
