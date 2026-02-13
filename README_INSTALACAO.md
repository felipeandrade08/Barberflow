# BarberFlow - Sistema Premium de Agendamento

Sistema moderno de agendamento para barbearias com interface premium e modo escuro.

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para executar o projeto

1. **Instale as dependências:**
```bash
npm install
```

2. **Execute o servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Acesse o projeto:**
   - Abra o navegador em `http://localhost:3000`

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Ícones
- **Recharts** - Gráficos
- **QRCode.react** - Geração de QR Codes

## ✅ Correções Aplicadas

### Problema 1: CDN do Tailwind
❌ **Antes:** Usava `cdn.tailwindcss.com` (não recomendado para produção)
✅ **Depois:** Tailwind CSS instalado como dependência com PostCSS

### Problema 2: MIME Type Error
❌ **Antes:** TypeScript não era processado corretamente (importmap com ESM)
✅ **Depois:** Vite configurado para processar TypeScript e bundling adequado

## 🎨 Estrutura do Projeto

```
BarberflowApp-main/
├── components/       # Componentes reutilizáveis
├── context/         # Context API do React
├── pages/           # Páginas da aplicação
│   ├── admin/      # Páginas administrativas
│   └── client/     # Páginas do cliente
├── index.html      # HTML principal
├── index.tsx       # Entry point do React
├── App.tsx         # Componente principal
├── styles.css      # Estilos globais com Tailwind
└── vite.config.ts  # Configuração do Vite

```

## 🌙 Features

- ✨ Interface moderna com modo escuro
- 📱 Responsivo para mobile
- 📊 Dashboard com estatísticas
- 📅 Sistema de agendamento
- 👥 Gestão de clientes
- ⭐ Sistema de avaliações
- 🎨 Design premium com glass morphism

## 📝 Notas

- O projeto agora usa Vite para bundling e desenvolvimento
- Tailwind CSS está configurado corretamente via PostCSS
- Todos os arquivos TypeScript são processados adequadamente
- Pronto para produção com build otimizado

## 🤝 Suporte

Se encontrar problemas, verifique:
1. Node.js versão 18 ou superior está instalado
2. Todas as dependências foram instaladas com `npm install`
3. Nenhum processo está usando a porta 3000

---

Desenvolvido com ❤️ para barbearias modernas
