# Arquitetura do MeuProtetor

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                     DISPOSITIVO MÓVEL                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              React Native App                            │   │
│  │                                                          │   │
│  │  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │   │
│  │  │ Keyword    │  │ Audio        │  │ Threat         │  │   │
│  │  │ Detection  │─▶│ Recorder     │─▶│ Analyzer       │  │   │
│  │  │ Service    │  │ Service      │  │ Service        │  │   │
│  │  └────────────┘  └──────────────┘  └────────┬───────┘  │   │
│  │         │                                    │           │   │
│  │  palavra-chave                         ameaça detectada  │   │
│  │         │                                    │           │   │
│  │  ┌──────▼──────────────────────────────────▼──────────┐ │   │
│  │  │              useSafeGuard (Hook)                    │ │   │
│  │  │  status: idle → listening → active → emergency      │ │   │
│  │  └─────────────────────────┬───────────────────────────┘ │   │
│  │                            │                              │   │
│  │  ┌─────────────────────────▼───────────────────────────┐ │   │
│  │  │           Emergency Notifier Service                 │ │   │
│  │  │  POST /api/emergency (FormData: alert + audio)       │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js)                        │
│                                                                 │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Express   │  │  Rate        │  │  JWT Auth            │   │
│  │  Router    │  │  Limiter     │  │  Middleware          │   │
│  └─────┬──────┘  └──────────────┘  └──────────────────────┘   │
│        │                                                        │
│  ┌─────▼────────────────────────────────────────────────────┐  │
│  │                    Routes                                  │  │
│  │  /api/auth  /api/emergency  /api/contacts  /api/history  │  │
│  └─────┬────────────────────────────────────────────────────┘  │
│        │                                                        │
│  ┌─────▼────────────────────────────────────────────────────┐  │
│  │                   Services                                 │  │
│  │                                                            │  │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐   │  │
│  │  │ ThreatDetection │  │ AudioStorage                 │   │  │
│  │  │                 │  │                              │   │  │
│  │  │ 1. Whisper      │  │ AWS S3 (AES256)              │   │  │
│  │  │    Transcription│  │ Pre-signed URLs              │   │  │
│  │  │ 2. GPT-4o       │  └──────────────────────────────┘   │  │
│  │  │    Analysis     │                                       │  │
│  │  └─────────────────┘  ┌──────────────────────────────┐   │  │
│  │                       │ Notification                  │   │  │
│  │                       │                              │   │  │
│  │                       │ • SMS via Twilio             │   │  │
│  │                       │ • WhatsApp via Twilio        │   │  │
│  │                       │ • Email HTML (Nodemailer)    │   │  │
│  │                       └──────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌────────────────────┐  ┌──────────────────────────────────┐  │
│  │  Socket.IO         │  │  PostgreSQL (via Prisma)         │  │
│  │  Real-time alerts  │  │  Users, Emergencies, Contacts,   │  │
│  │  JWT auth          │  │  Recordings                      │  │
│  └────────────────────┘  └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                         │        │
                    ┌────┘        └────┐
                    ▼                  ▼
            ┌──────────────┐   ┌──────────────┐
            │   AWS S3     │   │  OpenAI API  │
            │  (áudio      │   │  Whisper +   │
            │  criptografado)  │  GPT-4o      │
            └──────────────┘   └──────────────┘
```

## Camadas da Arquitetura

### 1. Camada Mobile (React Native)

| Componente | Responsabilidade |
|------------|-----------------|
| `KeywordDetectionService` | Monitoramento contínuo de voz por palavras-chave |
| `AudioRecorderService` | Gravação em chunks de 30s |
| `ThreatAnalyzerService` | Envio de áudio para análise na API |
| `EmergencyNotifierService` | Captura de localização e envio do alerta |
| `useSafeGuard` | Hook orquestrador de todos os serviços |

### 2. Camada de API (Express.js)

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/auth/register` | POST | Registro de usuário |
| `/api/auth/login` | POST | Login com JWT |
| `/api/auth/me` | GET | Dados do usuário |
| `/api/emergency` | POST | Envio de alerta |
| `/api/emergency/:id/resolve` | POST | Resolver alerta |
| `/api/emergency/history` | GET | Histórico de alertas |
| `/api/emergency/analyze` | POST | Análise de áudio |
| `/api/contacts` | GET/POST | Listar/criar contatos |
| `/api/contacts/:id` | PUT/DELETE | Editar/deletar contato |
| `/api/history` | GET | Histórico completo |
| `/api/history/:id` | GET | Detalhes de ocorrência |

### 3. Camada de Serviços

- **ThreatDetectionService**: Whisper (transcrição) + GPT-4o (análise)
- **AudioStorageService**: Upload para S3 com criptografia AES256
- **NotificationService**: Twilio (SMS/WhatsApp) + Nodemailer (Email)
- **AlertSocket**: Socket.IO com autenticação JWT

### 4. Banco de Dados (PostgreSQL + Prisma)

```
User
 ├─ EmergencyContact[]
 ├─ Emergency[]
 └─ Recording[]
```

## Fluxo de Dados

```
1. Usuário configura palavras-chave e contatos
2. App inicia monitoramento contínuo (listening)
3. Palavra-chave detectada → gravação inicia (active)
4. Chunk de 30s → enviado para /api/analyze
5. IA analisa → nível de ameaça detectado
6. Se shouldAlert=true → EmergencyNotifier ativa
7. Captura GPS → POST /api/emergency (áudio + localização)
8. Backend: S3 upload + DB save + notifica contatos
9. WebSocket emite confirmação para o app
10. Usuário pode cancelar ou confirmar manualmente
```

## Segurança

- **Autenticação**: JWT com expiração de 30 dias
- **Senhas**: bcrypt com fator de custo 12
- **Áudio**: Criptografia AES256 no S3
- **Rate limiting**: 100 req/min geral, 30 req/min para emergências
- **CORS**: Apenas origens permitidas via `ALLOWED_ORIGINS`
- **Headers**: Helmet.js para headers de segurança HTTP
- **Dados**: Retenção configurável (7/30/90 dias ou nunca)
