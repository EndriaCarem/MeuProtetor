# API Reference — MeuProtetor

Base URL: `https://api.meuprotetor.com.br`

Todos os endpoints (exceto `/api/auth/*` e `/api/health`) requerem header:
```
Authorization: Bearer <jwt_token>
```

---

## Autenticação

### POST /api/auth/register

Cria uma nova conta de usuário.

**Request Body:**
```json
{
  "name":     "Maria Silva",
  "email":    "maria@exemplo.com",
  "phone":    "+5511999999999",
  "password": "senhaSegura123"
}
```

**Response 201:**
```json
{
  "user": {
    "id":        "clxyz...",
    "name":      "Maria Silva",
    "email":     "maria@exemplo.com",
    "phone":     "+5511999999999",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:** `400` (dados inválidos), `409` (email já cadastrado)

---

### POST /api/auth/login

Autentica o usuário e retorna JWT.

**Request Body:**
```json
{
  "email":    "maria@exemplo.com",
  "password": "senhaSegura123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id":              "clxyz...",
    "name":            "Maria Silva",
    "email":           "maria@exemplo.com",
    "keywords":        ["socorro", "ajuda", "meuprotetor"],
    "sensitivityLevel": 3
  }
}
```

**Errors:** `400`, `401` (credenciais inválidas)

---

### GET /api/auth/me

Retorna dados do usuário autenticado.

**Response 200:**
```json
{
  "id":               "clxyz...",
  "name":             "Maria Silva",
  "email":            "maria@exemplo.com",
  "phone":            "+5511999999999",
  "keywords":         ["socorro", "ajuda", "meuprotetor"],
  "sensitivityLevel": 3,
  "retentionDays":    30,
  "createdAt":        "2024-01-15T10:30:00.000Z"
}
```

---

## Emergências

### POST /api/emergency

Envia um alerta de emergência com áudio e localização.

**Content-Type:** `multipart/form-data`

**Fields:**
- `alert` (string, JSON): dados do alerta
- `audio` (file, opcional): arquivo de áudio `.mp4`

**alert JSON:**
```json
{
  "latitude":   -23.5505,
  "longitude":  -46.6333,
  "threatLevel": "high",
  "confidence": 85,
  "transcript": "Texto da transcrição...",
  "threats":    ["ameaça verbal"],
  "timestamp":  1705311000000
}
```

**Response 201:**
```json
{
  "success":      true,
  "alertId":      "clxyz...",
  "notified":     3,
  "processingMs": 1234
}
```

**Errors:** `400`, `401`, `500`

---

### POST /api/emergency/:id/resolve

Marca uma emergência como resolvida.

**Response 200:**
```json
{
  "success": true,
  "emergency": {
    "id":         "clxyz...",
    "status":     "resolved",
    "resolvedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### GET /api/emergency/history

Lista o histórico paginado de emergências.

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 50)

**Response 200:**
```json
{
  "data": [
    {
      "id":          "clxyz...",
      "threatLevel": "high",
      "confidence":  85,
      "transcript":  "Texto...",
      "threats":     ["ameaça verbal"],
      "latitude":    -23.5505,
      "longitude":   -46.6333,
      "status":      "active",
      "createdAt":   "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page":  1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### POST /api/emergency/analyze

Analisa um arquivo de áudio sem criar emergência.

**Content-Type:** `multipart/form-data`

**Fields:**
- `audio` (file): arquivo de áudio `.mp4`
- `timestamp` (string): timestamp Unix em ms

**Response 200:**
```json
{
  "level":      "medium",
  "confidence": 72,
  "threats":    ["linguagem agressiva"],
  "transcript": "Texto transcrito...",
  "shouldAlert": true
}
```

---

## Contatos de Emergência

### GET /api/contacts

Lista todos os contatos de emergência do usuário.

**Response 200:**
```json
[
  {
    "id":           "clxyz...",
    "name":         "João Silva",
    "relationship": "Irmão",
    "phone":        "+5511888888888",
    "whatsapp":     "+5511888888888",
    "email":        "joao@exemplo.com",
    "priority":     1,
    "createdAt":    "2024-01-15T10:00:00.000Z"
  }
]
```

---

### POST /api/contacts

Cria um novo contato de emergência.

**Request Body:**
```json
{
  "name":         "João Silva",
  "relationship": "Irmão",
  "phone":        "+5511888888888",
  "whatsapp":     "+5511888888888",
  "email":        "joao@exemplo.com",
  "priority":     1
}
```

> **Nota:** Pelo menos um de `phone`, `whatsapp` ou `email` é obrigatório.

**Response 201:**
```json
{
  "id":           "clxyz...",
  "name":         "João Silva",
  "relationship": "Irmão",
  "phone":        "+5511888888888",
  "priority":     1,
  "createdAt":    "2024-01-15T10:00:00.000Z"
}
```

---

### PUT /api/contacts/:id

Atualiza um contato de emergência.

**Request Body:** (campos opcionais)
```json
{
  "name":     "João Santos",
  "priority": 2
}
```

**Response 200:** Contato atualizado

---

### DELETE /api/contacts/:id

Remove um contato de emergência.

**Response 200:**
```json
{ "success": true }
```

---

## Histórico

### GET /api/history

Lista ocorrências com filtros opcionais.

**Query Params:**
- `threatLevel` (`none`|`low`|`medium`|`high`|`critical`)
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response 200:**
```json
{
  "data": [...],
  "recordings": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### GET /api/history/:id

Retorna detalhes de uma ocorrência, incluindo URL assinada do áudio.

**Response 200:**
```json
{
  "id":             "clxyz...",
  "threatLevel":    "high",
  "transcript":     "Texto...",
  "audioSignedUrl": "https://s3.amazonaws.com/...",
  "latitude":       -23.5505,
  "longitude":      -46.6333,
  "createdAt":      "2024-01-15T10:30:00.000Z"
}
```

---

## Health Check

### GET /api/health

**Response 200:**
```json
{
  "status": "ok",
  "ts":     1705311000000
}
```

---

## WebSocket Events

Conecte-se com autenticação JWT:
```javascript
const socket = io('wss://api.meuprotetor.com.br', {
  auth: { token: 'Bearer <jwt_token>' }
});
```

### Eventos Emitidos pelo Servidor

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `emergency:confirmed` | `{ alertId, level }` | Alerta confirmado e enviado |
| `emergency:resolved` | `{ alertId }` | Alerta marcado como resolvido |
| `emergency:new` | `{ emergency, userId }` | Novo alerta (admin) |

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Dados inválidos na requisição |
| 401 | Não autenticado ou token inválido |
| 403 | Sem permissão para o recurso |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: email já cadastrado) |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |
