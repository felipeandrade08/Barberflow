# BarberFlow — SaaS de Gestão para Barbearias

BarberFlow é uma base comercial de gestão e agendamento para barbearias, com experiência pública para o cliente e painel administrativo.

## O que já está incluído

### Experiência do cliente
- Site público premium com serviços, profissionais, localização, horário e WhatsApp.
- Cadastro e login com senha.
- Fluxo de agendamento em etapas: serviço → profissional → data → horário → revisão.
- Bloqueio de conflito de horário por profissional considerando a duração do serviço.
- Histórico de agendamentos.
- Avaliações.
- Programa de fidelidade.
- Lembretes de atendimento dentro da aplicação.
- Tema claro/escuro.

### Gestão da barbearia
- Dashboard com receita, atendimentos, ticket médio e clientes.
- Receita dos últimos 7 dias.
- Agenda do dia.
- Performance por barbeiro.
- Controle de status: pendente, confirmado, finalizado e cancelado.
- Registro de forma de pagamento.
- Follow-up para incentivar o próximo agendamento.
- Cadastro/edição de serviços.
- Gestão de clientes.
- Avaliações.
- QR Code para divulgar o agendamento.
- Configuração da marca, WhatsApp, Instagram, endereço, horários e regras da agenda.
- Layout responsivo para desktop, tablet e celular.

## Demonstração

**Administrador**
- E-mail: `admin@barberflow.com`
- Senha: `admin123`

**Cliente**
- E-mail: `joao@email.com`
- Senha: `123456`

## Importante para transformar em produto mensal

Esta versão é um **MVP comercial de front-end** e usa `localStorage` para persistência. Isso é ótimo para demonstração e protótipo, mas **não é suficiente para vender como SaaS multiempresa em produção**.

Para a versão de produção, a próxima etapa recomendada é:
1. Backend/API.
2. Banco PostgreSQL.
3. Autenticação segura com hash de senha e sessão/token.
4. Isolamento por barbearia (`tenant_id`).
5. Agenda transacional para evitar conflitos entre dispositivos.
6. WhatsApp/Meta ou provedor de mensagens para confirmações e lembretes.
7. Gateway de pagamento para cobrar a mensalidade do dono da barbearia.
8. Painel do proprietário do SaaS para planos, assinaturas, clientes e cobrança.
9. Logs, auditoria, backup e controle de permissões.
10. Domínio personalizado por barbearia.

## Stack

React + TypeScript + Vite + Tailwind CSS + Recharts + Lucide + QRCode.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

> Antes de colocar em produção, substitua a autenticação/localStorage por uma API e banco de dados. Nunca use senhas reais armazenadas em `localStorage`.
