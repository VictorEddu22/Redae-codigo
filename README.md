# Redae! - frontend + backend organizado

Projeto de apoio a pratica de redacao dissertativo-argumentativa no estilo ENEM.

A identidade visual original do frontend foi preservada. A reorganizacao desta versao foi concentrada em arquitetura, autenticacao, integracao com API, tratamento de erros, seguranca e separacao das responsabilidades.

## Estrutura

```text
Redae-codigo-organizado/
|- src/                       # React/Vite
|  |- components/
|  |- context/                # estado global de autenticacao
|  |- data/                   # constantes estritamente visuais
|  |- hooks/
|  |- pages/
|  |- services/               # cliente HTTP e APIs do backend
|  `- styles/                 # CSS original + telas novas no mesmo design
|- backend/
|  |- src/
|  |  |- config/
|  |  |- content/
|  |  |- controllers/
|  |  |- lib/
|  |  |- middleware/
|  |  |- repositories/       # memory agora / MongoDB depois
|  |  |- routes/
|  |  |- services/
|  |  |- utils/
|  |  `- validators/
|  |- tests/
|  `- docs/
|- .env.example
`- package.json
```

## O que funciona

- cadastro e login por e-mail/senha;
- sessao com JWT em cookie HttpOnly;
- login/cadastro com Google quando o Client ID for configurado;
- todas as telas da aplicacao protegidas, exceto login e cadastro;
- perfil com nome, telefone, bio, escolaridade, foto e alteracao de senha;
- biblioteca de temas, modelos e guia de estrutura;
- rascunho local da redacao;
- envio para correcao por Gemini;
- correcao C1-C5 e nota de 0 a 1000;
- historico individual;
- feedback individual;
- painel de desempenho;
- persistencia em memoria durante o desenvolvimento;
- contratos prontos para o integrante implementar MongoDB sem alterar controllers/routes.

## Requisitos

- Node.js 20 ou superior
- npm

MongoDB nao e necessario enquanto `DATA_DRIVER=memory`.

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

No Windows PowerShell:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

API: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## 2. Frontend

Em outro terminal, na raiz:

```bash
npm install
cp .env.example .env
npm run dev
```

No PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

## Gemini

Crie a chave no Google AI Studio e coloque somente no arquivo `backend/.env`:

```env
GEMINI_API_KEY=sua_chave
GEMINI_MODEL=gemini-3.8-flash
```

Nunca use `VITE_` para a chave da IA. Variaveis `VITE_` sao incorporadas ao frontend e ficam visiveis no navegador.

## Google Login

Use o mesmo Web Client ID nos dois ambientes:

Frontend `.env`:

```env
VITE_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

Backend `.env`:

```env
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

Para desenvolvimento, cadastre `http://localhost:5173` nas origens JavaScript autorizadas no Google Cloud.

## MongoDB

O banco sera implementado por outro integrante. Enquanto isso:

```env
DATA_DRIVER=memory
```

O contrato exato esta em `backend/docs/MONGODB_CONTRACT.md`.

Depois que os repositories Mongo estiverem implementados:

```env
DATA_DRIVER=mongo
MONGODB_URI=...
```

A URI deve existir apenas no backend.

## Validacao

Backend:

```bash
cd backend
npm run check
npm test
```

Projeto completo, depois de instalar as dependencias:

```bash
npm run verify
```

## Seguranca aplicada

- senha armazenada somente como hash bcrypt;
- JWT nao e exposto ao React;
- cookie HttpOnly;
- CORS por lista de origens;
- validacao de origem em requisicoes de escrita;
- Helmet;
- rate limit geral, de login e de correcao por IA;
- validacao Zod;
- limite de payload;
- uploads limitados por tamanho e MIME type;
- acesso a redacoes sempre limitado ao usuario autenticado;
- texto da redacao tratado como conteudo nao confiavel no prompt da IA;
- nota do modelo normalizada e recalculada no backend;
- Request ID nos erros e respostas para facilitar diagnostico.

## Observacao sobre IA

A nota e uma estimativa pedagogica automatizada. Ela nao equivale a uma correcao oficial do INEP nem substitui professor/corretor humano.
