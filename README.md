# 💈 BarberFlow - Sistema Premium de Agendamento

<div align="center">

![BarberFlow Logo](https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=400&fit=crop)

**Sistema moderno de gestão e agendamento para barbearias**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.11-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)](https://tailwindcss.com/)

[Demonstração](#-features) • [Instalação](#-instalação) • [Uso](#-uso) • [Tecnologias](#-tecnologias) • [Contribuir](#-contribuindo)

</div>

---

## 📋 Sobre o Projeto

BarberFlow é um sistema completo de gestão para barbearias modernas, oferecendo uma interface premium com modo escuro, dashboard analítico e sistema de agendamento intuitivo.

### ✨ Features

- 🎨 **Interface Premium** - Design moderno com glass morphism e animações suaves
- 🌙 **Modo Escuro/Claro** - Alternância perfeita entre temas
- 📊 **Dashboard Analítico** - Visualização de métricas e estatísticas
- 📅 **Sistema de Agendamento** - Gestão completa de horários e serviços
- 👥 **Gestão de Clientes** - Cadastro e histórico de clientes
- ⭐ **Sistema de Avaliações** - Feedback e reviews de clientes
- 💰 **Controle Financeiro** - Receitas, comissões e relatórios
- 📱 **100% Responsivo** - Funciona perfeitamente em mobile, tablet e desktop
- 🔔 **Notificações** - Sistema de alertas e lembretes
- 🎫 **QR Code** - Geração de códigos para check-in rápido
- 🔐 **Autenticação** - Sistema de login com diferentes níveis de acesso

### 🖼️ Screenshots

<details>
<summary>Ver capturas de tela</summary>

#### Dashboard Administrativo
```
┌─────────────────────────────────────────────────┐
│  BarberFlow                           👤 Admin  │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Dashboard                                   │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ R$ 8.5K  │ │   127    │ │  98.5%   │       │
│  │ Receita  │ │ Clientes │ │Taxa Ocup.│       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  📈 Gráfico de Receitas                        │
│  [████████████░░░░░░░░░░░░░░]                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Sistema de Agendamento
```
┌─────────────────────────────────────────────────┐
│  📅 Agendamentos - Hoje                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  09:00 - João Silva      | Corte + Barba       │
│  10:30 - Pedro Santos    | Corte               │
│  14:00 - Carlos Oliveira | Barba               │
│  15:30 - DISPONÍVEL      | [+ Agendar]         │
│                                                 │
└─────────────────────────────────────────────────┘
```

</details>

---

## 🚀 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0.0 ou superior ([Download](https://nodejs.org/))
- **npm** (vem com Node.js) ou **yarn**
- Editor de código (recomendamos [VS Code](https://code.visualstudio.com/))

### Passo a Passo

#### 1️⃣ Clone ou Extraia o Projeto

```bash
# Se clonou do repositório
git clone https://github.com/seu-usuario/barberflow.git
cd barberflow

# Ou extraia o ZIP
unzip BarberflowApp-corrigido.zip
cd BarberflowApp-corrigido
```

#### 2️⃣ Instale as Dependências

```bash
npm install
```

<details>
<summary>Usando yarn?</summary>

```bash
yarn install
```
</details>

#### 3️⃣ Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

#### 4️⃣ Abra no Navegador

Acesse: **http://localhost:3000**

---

## 🎯 Uso

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com hot reload |
| `npm run build` | Cria build otimizado para produção |
| `npm run preview` | Visualiza build de produção localmente |
| `npm run lint` | Executa linter para verificar código |

### Início Rápido com Scripts

#### Windows:
```bash
# Clique duas vezes no arquivo
INICIAR.bat
```

#### Mac/Linux:
```bash
# No terminal
./iniciar.sh
```

### Credenciais Padrão

**Administrador:**
- Email: `admin@barberflow.com`
- Senha: `admin123`

**Cliente:**
- Email: `cliente@exemplo.com`
- Senha: `cliente123`

> ⚠️ **Importante:** Altere as senhas padrão em produção!

---

## 🏗️ Estrutura do Projeto

```
BarberflowApp-corrigido/
├── 📁 components/           # Componentes reutilizáveis
│   ├── Logo.tsx            # Logotipo da aplicação
│   ├── Sidebar.tsx         # Barra lateral de navegação
│   ├── StatCard.tsx        # Cards de estatísticas
│   └── Toast.tsx           # Notificações toast
│
├── 📁 context/              # Context API do React
│   └── AppContext.tsx      # Estado global da aplicação
│
├── 📁 pages/                # Páginas da aplicação
│   ├── Login.tsx           # Página de login
│   ├── 📁 admin/           # Páginas administrativas
│   │   ├── Dashboard.tsx   # Dashboard do admin
│   │   ├── Bookings.tsx    # Gestão de agendamentos
│   │   ├── Clients.tsx     # Gestão de clientes
│   │   ├── Services.tsx    # Gestão de serviços
│   │   ├── Reviews.tsx     # Avaliações
│   │   └── Settings.tsx    # Configurações
│   └── 📁 client/          # Páginas do cliente
│       ├── Dashboard.tsx   # Dashboard do cliente
│       └── NewBooking.tsx  # Novo agendamento
│
├── 📄 App.tsx               # Componente principal
├── 📄 index.tsx             # Entry point
├── 📄 types.ts              # Definições TypeScript
├── 📄 constants.tsx         # Constantes da aplicação
├── 📄 styles.css            # Estilos globais
│
├── 📄 index.html            # HTML principal
├── 📄 package.json          # Dependências
├── 📄 vite.config.ts        # Configuração Vite
├── 📄 tsconfig.json         # Configuração TypeScript
├── 📄 tailwind.config.js    # Configuração Tailwind
└── 📄 postcss.config.js     # Configuração PostCSS
```

---

## 🛠️ Tecnologias

### Core

- **[React](https://reactjs.org/)** `18.3.1` - Biblioteca JavaScript para UI
- **[TypeScript](https://www.typescriptlang.org/)** `5.3.3` - Superset tipado de JavaScript
- **[Vite](https://vitejs.dev/)** `5.0.11` - Build tool moderno e rápido

### Styling

- **[Tailwind CSS](https://tailwindcss.com/)** `3.4.1` - Framework CSS utility-first
- **[PostCSS](https://postcss.org/)** `8.4.33` - Processador de CSS
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** `10.4.17` - Prefixos CSS automáticos

### Bibliotecas

- **[Lucide React](https://lucide.dev/)** `0.474.0` - Ícones modernos
- **[Recharts](https://recharts.org/)** `2.15.0` - Gráficos e visualizações
- **[QRCode.react](https://www.npmjs.com/package/qrcode.react)** `3.1.0` - Geração de QR Codes

### Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript Compiler** - Verificação de tipos

---

## 🎨 Personalização

### Temas

O projeto suporta modo claro e escuro. Para personalizar as cores:

1. Edite `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#f59e0b', // Sua cor principal
        600: '#d97706',
        // ...
      },
    },
  },
}
```

2. Edite `styles.css` para ajustes globais:

```css
@layer base {
  body {
    @apply font-sans bg-slate-900 text-slate-50;
  }
}
```

### Fontes

Fontes configuradas:
- **Inter** - Fonte principal (sans-serif)
- **Playfair Display** - Títulos e destaques (serif)

Para alterar, edite `styles.css` e `tailwind.config.js`.

---

## 📦 Build para Produção

### Gerar Build

```bash
npm run build
```

Isso criará uma pasta `dist/` com arquivos otimizados.

### Testar Build Localmente

```bash
npm run preview
```

### Deploy

O projeto está pronto para deploy em:

- **[Vercel](https://vercel.com/)** (Recomendado)
- **[Netlify](https://www.netlify.com/)**
- **[GitHub Pages](https://pages.github.com/)**
- **Qualquer servidor estático**

#### Deploy na Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Deploy na Netlify:

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 🐛 Troubleshooting

### Erro: "npm não é reconhecido"

**Solução:** Instale Node.js de [nodejs.org](https://nodejs.org/)

### Erro: "Failed to load module script" (MIME type)

**Solução:** NÃO abra `index.html` diretamente. Use `npm run dev`.

📖 Veja [SOLUCAO_ERRO_MIME_TYPE.md](SOLUCAO_ERRO_MIME_TYPE.md) para mais detalhes.

### Erro: Porta 3000 em uso

**Solução:**
```bash
# Use outra porta
npm run dev -- --port 3001
```

### Tela branca no navegador

**Soluções:**
1. Limpe cache do navegador (Ctrl + Shift + Delete)
2. Verifique console do navegador (F12) para erros
3. Certifique-se que está acessando `localhost:3000`
4. Reinstale dependências:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 📚 Documentação Adicional

- 📖 [Guia de Instalação Visual](GUIA_INSTALACAO_VISUAL.md)
- 🔧 [Correções Aplicadas](CORRECOES_APLICADAS.md)
- 🆘 [Solução de Problemas](SOLUCAO_ERRO_MIME_TYPE.md)
- 📝 [Leia-me Primeiro](LEIA-ME-PRIMEIRO.md)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o código limpo e documentado
- Siga os padrões de código existentes
- Adicione testes quando aplicável
- Atualize a documentação conforme necessário

---

## 📋 Roadmap

- [x] Sistema de autenticação
- [x] Dashboard administrativo
- [x] Gestão de agendamentos
- [x] Gestão de clientes
- [x] Sistema de avaliações
- [ ] Integração com pagamentos
- [ ] Notificações por email/SMS
- [ ] App mobile (React Native)
- [ ] API REST
- [ ] Multi-tenancy (múltiplas barbearias)
- [ ] Sistema de fidelidade
- [ ] Integração com WhatsApp

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2026 BarberFlow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para modernizar a gestão de barbearias.

---

## 🙏 Agradecimentos

- [React Team](https://reactjs.org/) - Pela excelente biblioteca
- [Vite Team](https://vitejs.dev/) - Pelo build tool incrível
- [Tailwind Labs](https://tailwindcss.com/) - Pelo framework CSS
- [Lucide](https://lucide.dev/) - Pelos ícones lindos
- [Unsplash](https://unsplash.com/) - Pelas imagens de qualidade

---

## 📞 Suporte

Encontrou um bug? Tem uma sugestão?

- 🐛 [Reportar Bug](https://github.com/seu-usuario/barberflow/issues)
- 💡 [Solicitar Feature](https://github.com/seu-usuario/barberflow/issues)
- 📧 Email: suporte@barberflow.com

---

## 📊 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/barberflow)
![GitHub issues](https://img.shields.io/github/issues/seu-usuario/barberflow)
![GitHub pull requests](https://img.shields.io/github/issues-pr/seu-usuario/barberflow)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[⬆ Voltar ao topo](#-barberflow---sistema-premium-de-agendamento)

</div>
