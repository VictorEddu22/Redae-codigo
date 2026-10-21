# Integracao frontend/backend

O frontend usa um unico cliente HTTP em `src/services/api.js`.

## Regras

- `credentials: include` envia o cookie HttpOnly automaticamente.
- o frontend nunca le ou salva o JWT;
- erro 401 dispara um evento global e o `AuthProvider` encerra a sessao;
- `ProtectedRoute` decide acesso usando o estado global de autenticacao;
- `/login` e `/cadastro` sao rotas publicas;
- todas as demais telas exigem sessao valida no backend.

## Services

```text
src/services/authService.js
src/services/profileService.js
src/services/essayService.js
src/services/contentService.js
```

Componentes e paginas nao devem chamar `fetch()` diretamente. Novos endpoints devem ser adicionados ao service correspondente.
