```text
███╗   ███╗███████╗██╗   ██╗██████╗ ██████╗  ██████╗ ████████╗███████╗████████╗ ██████╗ ██████╗
████╗ ████║██╔════╝██║   ██║██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗
██╔████╔██║█████╗  ██║   ██║██████╔╝██████╔╝██║   ██║   ██║   █████╗     ██║   ██║   ██║██████╔╝
██║╚██╔╝██║██╔══╝  ██║   ██║██╔═══╝ ██╔══██╗██║   ██║   ██║   ██╔══╝     ██║   ██║   ██║██╔══██╗
██║ ╚═╝ ██║███████╗╚██████╔╝██║     ██║  ██║╚██████╔╝   ██║   ███████╗   ██║   ╚██████╔╝██║  ██║
╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
```

> 🛡️ **Sistema de Proteção Feminina com Detecção de Ameaças por IA**

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)

---

## O que é

O **MeuProtetor** é um sistema de proteção pessoal desenvolvido para mulheres em situações de risco. O app monitora continuamente o ambiente sonoro, detecta ameaças usando Inteligência Artificial e envia alertas automáticos para contatos de emergência com localização GPS, transcrição do áudio e gravação.

Tudo isso acontece de forma discreta, ativado apenas por uma palavra-chave, sem que a agressora perceba.

---

## Como Funciona

```
1. 🎙️  Monitoramento contínuo por palavra-chave ("socorro", "ajuda", "meuprotetor")
        │
        ▼
2. 🔴  Palavra detectada → gravação automática do ambiente
        │
        ▼
3. 🤖  Áudio enviado para análise por IA (OpenAI Whisper + GPT-4o)
        │
        ▼
4. ⚠️  Ameaça identificada → alerta com nível (baixo/médio/alto/crítico)
        │
        ▼
5. 🚨  Notificação automática para contatos de emergência:
        • SMS
        • WhatsApp (com localização)
        • Email (com transcrição e link do mapa)
```

---

## Funcionalidades

### App Mobile (React Native)
- 🎙️ Detecção por palavra-chave em tempo real (pt-BR)
- 🔴 Gravação de áudio em chunks de 30 segundos
- 🤖 Análise de ameaças via IA com transcrição
- 🆘 Botão SOS com hold-to-activate (1,5 segundos)
- 📊 Medidor de nível de ameaça com 5 segmentos
- 👥 Anel de contatos de emergência com avatares
- 🗂️ Histórico completo de ocorrências com filtros
- ⚙️ Configurações: palavras-chave, sensibilidade da IA, contatos CRUD
- 🔒 Análise local ou no servidor (configurável)
- 🎨 UI Gótica dark com tema roxo/crimson

### Backend (Node.js)
- 🔐 Autenticação JWT com bcrypt
- 📤 Upload seguro de áudio para AWS S3 (criptografia AES256)
- 🤖 Transcrição com OpenAI Whisper + análise com GPT-4o
- 📱 Notificações: SMS, WhatsApp e Email HTML via Twilio/Nodemailer
- 🔌 WebSocket em tempo real com Socket.IO
- 📄 API REST completa com Rate Limiting e validação Zod
- 🗄️ Banco PostgreSQL via Prisma ORM
- 📝 Logs estruturados com Winston

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Mobile | React Native | 0.73 |
| Linguagem | TypeScript | 5.3 |
| Navegação | React Navigation | 6 |
| Backend | Node.js + Express | 18+ / 4.18 |
| Banco de Dados | PostgreSQL + Prisma | 16 / 5.9 |
| IA — Transcrição | OpenAI Whisper | whisper-1 |
| IA — Análise | OpenAI GPT-4o | gpt-4o |
| Armazenamento | AWS S3 | SDK v3 |
| SMS/WhatsApp | Twilio | 5.0 |
| Email | Nodemailer | 6.9 |
| WebSocket | Socket.IO | 4.6 |
| Autenticação | JWT + bcryptjs | 9.0 / 2.4 |
| Validação | Zod | 3.22 |
| Logs | Winston | 3.11 |

---

## Pré-requisitos

- **Node.js** 18+
- **React Native CLI** configurado (Android SDK / Xcode)
- **PostgreSQL** 14+
- **Redis** 6+ (para sessões futuras)
- Conta **AWS** com S3 configurado
- Conta **Twilio** para SMS/WhatsApp
- Chave **OpenAI** com acesso ao GPT-4o e Whisper

---

## Instalação

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Criar banco de dados e gerar cliente Prisma
npm run db:migrate
npm run db:generate

# Iniciar em desenvolvimento
npm run dev
```

### Mobile

```bash
cd mobile

# Instalar dependências
npm install

# iOS (apenas macOS)
cd ios && pod install && cd ..

# Android
npm run android

# iOS
npm run ios
```

---

## Configuração

Copie `backend/.env.example` para `backend/.env` e configure:

```env
# Obrigatório
JWT_SECRET=<string aleatória de 32+ caracteres>
DATABASE_URL=postgresql://usuario:senha@localhost:5432/meuprotetor

# Para análise por IA
OPENAI_API_KEY=sk-proj-...
ENABLE_SERVER_TRANSCRIPTION=true

# Para notificações
TWILIO_SID=ACxxxxxxxx
TWILIO_TOKEN=xxxxxxxxx
TWILIO_PHONE=+5511999999999

# Para armazenamento seguro
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
S3_BUCKET=meuprotetor-audio-encrypted
```

---

## Segurança & Privacidade

O MeuProtetor foi desenvolvido com foco em segurança e conformidade com a **LGPD**:

- 🔒 **Senhas**: bcrypt com fator de custo 12
- 🔐 **Áudio**: criptografia AES256 no AWS S3
- 🔑 **Sessões**: JWT com expiração configurável
- 🛡️ **API**: Rate limiting, helmet.js, CORS restrito
- 🗑️ **Retenção**: Configurável (7, 30, 90 dias ou nunca)
- 📍 **Localização**: Coletada apenas durante emergências
- 🎙️ **Gravações**: Processadas e descartadas após análise (configurável)
- 📊 **Dados**: Usuário tem controle total sobre seus dados

---

## Números de Emergência (Brasil)

| Número | Serviço |
|--------|---------|
| **190** | Polícia Militar |
| **180** | Central de Atendimento à Mulher |
| **192** | SAMU |
| **193** | Bombeiros |
| **100** | Disque Direitos Humanos |

---

## Estrutura do Projeto

```
MeuProtetor/
├── mobile/                # App React Native
│   └── src/
│       ├── theme/         # Design system gótico
│       ├── hooks/         # useSafeGuard (hook principal)
│       ├── services/      # Keyword, Audio, Threat, Notifier
│       ├── components/    # SOS, Orb, Meter, Contacts, Alerts
│       ├── screens/       # Dashboard, Emergency, Onboarding, Settings, History
│       └── navigation/    # AppNavigator
├── backend/               # API Node.js
│   ├── prisma/            # Schema do banco de dados
│   └── src/
│       ├── middleware/    # Autenticação JWT
│       ├── routes/        # emergency, auth, contacts, history
│       ├── services/      # AI, Storage, Notifications
│       ├── websocket/     # Socket.IO
│       └── utils/         # Logger
└── docs/
    ├── ARCHITECTURE.md    # Diagrama e descrição da arquitetura
    └── API.md             # Documentação completa dos endpoints
```

---

## Contribuindo

1. Fork o repositório
2. Crie sua branch: `git checkout -b feature/minha-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adicionar funcionalidade'`
4. Push para a branch: `git push origin feature/minha-funcionalidade`
5. Abra um Pull Request

### Convenções de Commit

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes

---

## Licença

MIT © MeuProtetor

---

<div align="center">

**Desenvolvido com 💜 para proteger vidas**

*Em caso de emergência imediata, ligue **190** (Polícia) ou **180** (Central da Mulher)*

</div>

