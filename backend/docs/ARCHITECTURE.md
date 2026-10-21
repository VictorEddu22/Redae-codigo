# Arquitetura do backend

## Requisicao autenticada

```text
Browser
  -> cookie HttpOnly
  -> Express route
  -> requireAuth
  -> Controller
  -> Service
  -> Repository
  -> resposta JSON
```

O frontend nao conhece o JWT. O navegador envia o cookie automaticamente.

## Correcao de redacao

```text
NovaRedacaoPage
  -> POST /api/essays
  -> requireAuth
  -> Zod
  -> EssayService
  -> GeminiEssayCorrectionService
  -> normalizacao C1-C5
  -> EssayRepository.create
  -> FeedbackPage
```

A redacao do estudante e delimitada como dado nao confiavel no prompt. A nota final nao e aceita cegamente: cada competencia e normalizada para um dos niveis permitidos e o total e recalculado no backend.

## Banco de dados

Controllers e services nao importam MongoDB. Eles recebem repositories por injecao:

```text
createRepositories()
  |- memory -> InMemoryUserRepository / InMemoryEssayRepository
  `- mongo  -> implementacao do integrante do banco
```

Para conectar MongoDB, implemente apenas `src/repositories/mongo/createMongoRepositories.js` conforme `MONGODB_CONTRACT.md`.

## Onde colocar novas funcionalidades

- novo endpoint HTTP: `routes/` + `controllers/`
- nova regra de negocio: `services/`
- nova validacao: `validators/`
- nova consulta/persistencia: `repositories/`
- nova configuracao: `config/env.js`
- novo middleware transversal: `middleware/`

Evite acessar banco diretamente em controllers e evite chamar Gemini diretamente em routes.
