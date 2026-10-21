# O que voce precisa me mandar / providenciar

## 1. Gemini - necessario para a correcao por IA

Voce precisa criar uma API Key do Google Gemini no Google AI Studio.

**Nao me envie a chave secreta no chat.**

Quando criar, basta informar:
> "Criei a chave Gemini."

Na sua maquina, coloque:

```env
GEMINI_API_KEY=SUA_CHAVE_AQUI
GEMINI_MODEL=gemini-3.8-flash
```

O backend ja esta preparado para usar a chave.

## 2. Google Login - preciso do Client ID

Crie um **OAuth Client ID do tipo Web Application** no Google Cloud / Google Identity.

Configure como origem de desenvolvimento:

```text
http://localhost:5173
```

Depois voce pode me mandar apenas algo no formato:

```text
123456789-xxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

Esse `GOOGLE_CLIENT_ID` identifica o aplicativo e pode aparecer no frontend.

Nao envie senhas, API keys ou Client Secret.

## 3. Para o banco de dados

Como outra pessoa fara o MongoDB, eu nao preciso da URI/senha dela.

Quando o Mongo estiver pronto, envie um destes:
- o ZIP/branch com a implementacao dos repositories MongoDB; ou
- a estrutura das collections + codigo de conexao/repositories.

Nao envie credenciais reais.

A pessoa do banco deve seguir `docs/MONGODB_CONTRACT.md`.

## 4. Informacao opcional sobre a correcao

Se a faculdade/professor forneceu uma regra de correcao especifica alem das 5 competencias do ENEM, envie esse documento/texto.

Se nao houver regra propria, o backend usa a matriz pedagogica C1-C5 configurada no prompt.

## 5. URLs quando houver deploy

Quando o projeto for publicado, informe:
- URL final do frontend
- URL final do backend

Assim CORS, cookies e Google Login podem ser configurados corretamente.

## Resumo

O que pode me mandar:
1. `GOOGLE_CLIENT_ID`
2. confirmacao de que a chave Gemini foi criada
3. depois, o codigo/schema do MongoDB feito pelo outro integrante
4. regras extras de correcao, se existirem
5. URLs de deploy quando existirem

O que NAO deve me mandar:
- `GEMINI_API_KEY`
- `JWT_SECRET`
- senha do MongoDB
- Google Client Secret
- senhas pessoais
