# Backend Redae!

Backend Node.js + Express do Redae!, organizado em camadas e desacoplado do banco de dados.

## Fluxo

```text
Route -> Controller -> Service -> Repository
                    -> Gemini (quando necessario)
```

- Routes: HTTP, autenticacao e rate limit.
- Controllers: validacao de entrada e resposta HTTP.
- Services: regras de negocio.
- Repositories: persistencia substituivel (memory/MongoDB).
- Validators: schemas Zod.
- Middleware: autenticacao, seguranca, upload e erros.

## Endpoints

### Auth

```text
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/google
POST  /api/auth/logout
GET   /api/auth/me
PATCH /api/auth/password
```

### Perfil

```text
GET   /api/profile
PATCH /api/profile
POST  /api/profile/photo
```

### Redacoes

```text
POST   /api/essays
GET    /api/essays
GET    /api/essays/performance
GET    /api/essays/:id
DELETE /api/essays/:id
```

### Conteudo

```text
GET /api/content/themes
GET /api/content/themes/:id
GET /api/content/models
GET /api/content/learning
```

Todas as rotas de perfil, redacoes e conteudo exigem autenticacao.

## Banco

Use `DATA_DRIVER=memory` ate a integracao MongoDB estar pronta. Consulte `docs/MONGODB_CONTRACT.md`.

## IA

A correcao usa `@google/genai` e o modelo configurado em `GEMINI_MODEL`. A resposta da IA e estruturada, normalizada e a nota final e recalculada no servidor.

## Comandos

```bash
npm install
npm run dev
npm run check
npm test
```
