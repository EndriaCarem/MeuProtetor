<div align="center">

```
███╗   ███╗███████╗██╗   ██╗    ██████╗ ██████╗  ██████╗ ████████╗███████╗████████╗ ██████╗ ██████╗ 
████╗ ████║██╔════╝██║   ██║    ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗
██╔████╔██║█████╗  ██║   ██║    ██████╔╝██████╔╝██║   ██║   ██║   █████╗     ██║   ██║   ██║██████╔╝
██║╚██╔╝██║██╔══╝  ██║   ██║    ██╔═══╝ ██╔══██╗██║   ██║   ██║   ██╔══╝     ██║   ██║   ██║██╔══██╗
██║ ╚═╝ ██║███████╗╚██████╔╝    ██║     ██║  ██║╚██████╔╝   ██║   ███████╗   ██║   ╚██████╔╝██║  ██║
╚═╝     ╚═╝╚══════╝ ╚═════╝     ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
```

### 🛡️ *Sistema de Proteção Feminina com Detecção de Ameaças por Inteligência Artificial*

<br/>

[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.9-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![License MIT](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)

<br/>

> **"Sua voz é sua proteção."**
> 
> Ative com uma palavra. O sistema faz o resto.

<br/>

[📱 Ver Demo](#-demo) · [🚀 Instalação](#-instalação) · [📖 Documentação](#-documentação) · [🤝 Contribuir](#-contribuindo)

</div>

---

## 📌 Índice

- [O que é o MeuProtetor?](#-o-que-é-o-meuprotetor)
- [Como Funciona](#-como-funciona)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Reference](#-api-reference)
- [Segurança & Privacidade](#-segurança--privacidade)
- [Números de Emergência](#-números-de-emergência)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🛡️ O que é o MeuProtetor?

**MeuProtetor** é um aplicativo mobile de proteção feminina que usa **Inteligência Artificial** para detectar situações de ameaça e acionar alertas de emergência de forma discreta e automática.

A usuária cadastra uma **palavra-chave secreta** (ex: *"socorro"*, *"meu protetor"*) e, ao pronunciá-la, o sistema:

1. 🎙️ **Grava** o áudio do ambiente silenciosamente
2. 🧠 **Analisa** o conteúdo com IA (OpenAI GPT-4o + Whisper)
3. 📍 **Captura** a localização GPS em tempo real
4. 🚨 **Notifica** contatos de emergência via SMS, WhatsApp e Email
5. 📁 **Armazena** evidências criptografadas na nuvem

---

## ⚙️ Como Funciona

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUXO PRINCIPAL                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   👂 ESCUTA PASSIVA          🎙️ GRAVAÇÃO ATIVA              │
│   ┌──────────────┐           ┌─────────────────��┐           │
│   │ App aguarda  │──palavra──▶ Grava ambiente    │           │
│   │ palavra-chave│  chave    │ em chunks 30s     │           │
│   └──────────────┘           └────────┬─────────┘           │
│                                       │                     │
│                               ┌───────▼──────────┐          │
│                               │  IA ANALISA      │          │
│                               │  Whisper → texto │          │
│                               │  GPT-4o → ameaça │          │
│                               └───────┬──────────┘          │
│                                       │                     │
│                    ┌──────────────────┼──────────────────┐  │
│                    ▼                  ▼                  ▼  │
│             📱 Notificação      📍 Localização    ☁️ Storage │
│             SMS + WhatsApp      Google Maps       AWS S3    │
│             + Email HTML        em tempo real     AES-256   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Funcionalidades

### 📱 App Mobile (React Native)
| Feature | Descrição |
|---|---|
| 🎙️ **Detecção por Voz** | Palavra-chave customizável ativa o modo proteção |
| 🔴 **Botão SOS** | Hold-to-activate com barra de progresso e vibração |
| 🌡️ **Medidor de Ameaça** | 5 níveis visuais: none → low → medium → high → critical |
| 🔮 **Status Orb** | Orbe animado com ondas de sonar indicando o estado do sistema |
| 👥 **Anel de Contatos** | Contatos de emergência com acesso rápido |
| 📋 **Histórico** | Log completo de ocorrências com áudio e mapa |
| ⚙️ **Configurações** | Palavras-chave, sensibilidade da IA, retenção de dados |

### 🖥️ Backend (Node.js)
| Feature | Descrição |
|---|---|
| 🔐 **Auth JWT** | Autenticação segura com tokens JWT |
| 🚨 **Rota Emergency** | Recebe alertas, processa áudio, notifica contatos |
| 📡 **WebSocket** | Alertas em tempo real via Socket.IO |
| ☁️ **Storage S3** | Upload criptografado AES-256 na AWS |
| 🧠 **Análise IA** | Transcrição Whisper + análise GPT-4o em PT-BR |
| 📊 **Rate Limiting** | Proteção contra abuso com limites por rota |

### 🎨 UI Gótica Dark
| Feature | Descrição |
|---|---|
| 🖤 **Design System** | Paleta crimson + violeta + preto abissal |
| ✨ **Animações** | Pulse, sonar, glow, spring, fade-in |
| 🔤 **Fontes** | Cinzel (gótica) + Raleway (legível) + JetBrains Mono |
| 📲 **Responsivo** | Adaptado para iOS e Android |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP MOBILE                               │
│              React Native + TypeScript                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Keyword    │  │   Audio     │  │    Threat Analyzer      │ │
│  │  Detection  │─▶│  Recorder   │─▶│  (Whisper + GPT-4o)     │ │
│  │  (Voice)    │  │  30s chunks │  │                         │ │
│  └─────────────┘  └─────────────┘  └───────────┬─────────────┘ │
│                                                │               │
│                                    ┌───────────▼─────────────┐ │
│                                    │   Emergency Notifier    │ │
│                                    │   GPS + POST /emergency │ │
│                                    └───────────┬─────────────┘ │
└────────────────────────────────────────────────│───────────────┘
                                                 │ HTTPS
┌────────────────────────────────────────────────▼───────────────┐
│                      BACKEND API                                │
│                   Node.js + Express                             │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────┐ │
│  │   Auth   │  │  /emergency  │  │ /contacts  │  │ /history │ │
│  │   JWT    │  │  + Multer    │  │   CRUD     │  │  + filter│ │
│  └──────────┘  └──────┬───────┘  └────────────┘  └──────────┘ │
│                       │                                        │
│         ┌─────────────┼─────────────────┐                     │
│         ▼             ▼                 ▼                     │
│  ┌────────────┐ ┌──────────┐ ┌──────────────────┐             │
│  │ AWS S3     │ │ OpenAI   │ │ Notificações      │             │
│  │ AES-256    │ │ Whisper  │ │ Twilio SMS/WA     │             │
│  │            │ │ GPT-4o   │ │ Nodemailer Email  │             │
│  └────────────┘ └──────────┘ └──────────────────┘             │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL + Prisma ORM                     │  │
│  │     User │ Emergency │ EmergencyContact │ Recording      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Socket.IO — Alertas em Tempo Real           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22
- **React Native CLI** (`npm install -g react-native-cli`)
- **PostgreSQL** >= 15
- **Redis** >= 7 *(para rate limiting e cache)*
- **Android Studio** *(para Android)* ou **Xcode** *(para iOS)*

Contas e chaves necessárias:
- [OpenAI API Key](https://platform.openai.com)
- [Twilio Account](https://twilio.com) *(SMS + WhatsApp)*
- [AWS Account](https://aws.amazon.com) *(S3 para storage de áudio)*
- [Google Maps API Key](https://console.cloud.google.com) *(localização)*

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/EndriaCarem/MeuProtetor.git
cd MeuProtetor
```

### 2. Configure o Backend

```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves (veja seção Configuração)

# Execute as migrations do banco
npx prisma migrate dev --name init
npx prisma generate

# Inicie o servidor em desenvolvimento
npm run dev
```

### 3. Configure o App Mobile

```bash
# Acesse a pasta mobile
cd ../mobile

# Instale as dependências
npm install

# iOS — instale pods (macOS only)
cd ios && pod install && cd ..

# Android — rode o app
npx react-native run-android

# iOS — rode o app
npx react-native run-ios
```

---

## 🔧 Configuração

Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```env
# ── APLICAÇÃO ──────────────────────────────
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000

# ── AUTENTICAÇÃO ───────────────────────────
JWT_SECRET=seu_jwt_secret_super_seguro_min_32_chars

# ── BANCO DE DADOS ─────────────────────────
DATABASE_URL=postgresql://usuario:senha@localhost:5432/meuprotetor

# ── CACHE ──────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── AWS S3 (Storage de Áudio) ──────────────
AWS_REGION=sa-east-1
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
S3_BUCKET=meuprotetor-audio-encrypted

# ── TWILIO (SMS + WhatsApp) ─────────────────
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE=+5511999999999
TWILIO_WHATSAPP_NUMBER=+14155238886

# ── EMAIL ──────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=alerta@meuprotetor.com.br
SMTP_PASS=sua_senha_de_app

# ── OPENAI (IA) ────────────────────────────
OPENAI_API_KEY=sk-proj-...
ENABLE_SERVER_TRANSCRIPTION=true
```

---

## 📖 Uso

### Ativando o Sistema

1. Abra o app **MeuProtetor**
2. Vá em **Configurações** e cadastre seus contatos de emergência
3. Defina sua **palavra-chave** personalizada (padrão: *"socorro"*)
4. O sistema fica em **escuta passiva** automaticamente
5. Ao falar a palavra-chave — o modo proteção é ativado

### Botão SOS Manual

- **Segure** o botão vermelho por **1,5 segundos** para ativar
- Uma **barra de progresso** indica o tempo restante
- **Solte** a qualquer momento para cancelar
- Após 10 segundos, o alerta é enviado automaticamente

---

## 📡 API Reference

### Autenticação

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Emergência

```http
POST /api/emergency              # Enviar alerta (multipart/form-data)
POST /api/emergency/:id/resolve  # Marcar como resolvido
GET  /api/emergency/history      # Histórico de alertas
```

### Contatos

```http
GET    /api/contacts             # Listar contatos
POST   /api/contacts             # Criar contato
PUT    /api/contacts/:id         # Atualizar contato
DELETE /api/contacts/:id         # Remover contato
```

> 📄 Documentação completa em [`docs/API.md`](docs/API.md)

---

## 🔒 Segurança & Privacidade

| Aspecto | Implementação |
|---|---|
| 🔐 **Senhas** | Bcrypt com salt rounds = 12 |
| 🎟️ **Tokens** | JWT com expiração configurável |
| 🎙️ **Áudios** | Criptografia AES-256 no AWS S3 |
| 🗑️ **Retenção** | Configurável pela usuária (7/30/90/nunca) |
| 📍 **Localização** | Coletada apenas durante emergências |
| 🔑 **Consentimento** | Ativação sempre explícita pela usuária |
| 🇧🇷 **LGPD** | Dados armazenados em servidores brasileiros (sa-east-1) |
| 🚫 **Falsos positivos** | Botão de cancelamento + confirmação em 10s |

---

## 🆘 Números de Emergência

> Salve esses números nos seus contatos!

| Serviço | Número | Disponibilidade |
|---|---|---|
| 🚔 **Polícia Militar** | **190** | 24h / 7 dias |
| 👩 **Central da Mulher** | **180** | 24h / 7 dias |
| 🚑 **SAMU** | **192** | 24h / 7 dias |
| 🚒 **Bombeiros** | **193** | 24h / 7 dias |
| 🏥 **Defesa Civil** | **199** | 24h / 7 dias |

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este projeto tem um propósito social importante.

```bash
# 1. Fork o projeto
# 2. Crie sua branch
git checkout -b feature/minha-feature

# 3. Commit suas mudanças
git commit -m 'feat: adiciona minha feature'

# 4. Push para a branch
git push origin feature/minha-feature

# 5. Abra um Pull Request
```

### Convenção de commits

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `style:` | Formatação/estilo |
| `refactor:` | Refatoração |
| `test:` | Testes |

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE) para mais informações.

---

<div align="center">

Feito com ❤️ para a segurança das mulheres brasileiras

**MeuProtetor** — *Sua voz é sua proteção*

🛡️ · 📱 · 🧠 · 🚨

</div>
