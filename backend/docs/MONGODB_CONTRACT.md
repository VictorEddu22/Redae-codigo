# Contrato para o integrante do MongoDB

O backend foi separado para que o banco seja trocado sem alterar as rotas.

## Arquivo a implementar

```text
src/repositories/mongo/createMongoRepositories.js
```

A funcao deve retornar:

```js
{
  users: userRepository,
  essays: essayRepository
}
```

Ambos precisam implementar os metodos abaixo.

---

## UserRepository

Arquivo de referencia:

```text
src/repositories/contracts/UserRepository.js
```

Metodos:

```js
create(data)
findById(id)
findByEmail(email)
findByGoogleSub(googleSub)
update(id, changes)
```

### Estrutura esperada de usuario

```js
{
  id: string,
  nome: string,
  email: string,
  telefone: string,
  passwordHash: string | null,
  googleSub: string | null,
  bio: string,
  escolaridade: string,
  fotoUrl: string,
  createdAt: ISODate/string,
  updatedAt: ISODate/string
}
```

### Indices recomendados

- `email`: UNIQUE
- `googleSub`: UNIQUE + sparse/partial
- `createdAt`

Nunca salvar senha pura. O AuthService entrega/consome `passwordHash`.

---

## EssayRepository

Arquivo:

```text
src/repositories/contracts/EssayRepository.js
```

Metodos:

```js
create(data)
findById(id)
listByUserId(userId)
deleteByIdForUser(id, userId)
```

### Estrutura da redacao

```js
{
  id: string,
  userId: string,
  titulo: string,
  tema: string,
  texto: string,
  status: "Corrigida",
  nota: number,

  competencias: [
    {
      code: "C1",
      label: "Norma-padrao",
      score: 160,
      comentario: "...",
      evidencias: ["..."],
      comoMelhorar: ["..."]
    }
  ],

  feedback: string,
  pontosFortes: [string],
  pontosMelhorar: [string],
  analiseTema: string,
  teseIdentificada: string,
  repertorios: [string],

  propostaIntervencao: {
    existe: boolean,
    agente: string,
    acao: string,
    meio: string,
    finalidade: string,
    detalhamento: string
  },

  riscoNotaZero: boolean,
  alertas: [string],
  proximoTreino: string,

  ai: {
    provider: string,
    model: string,
    generatedAt: string,
    disclaimer: string
  },

  createdAt: string,
  updatedAt: string
}
```

### Indices recomendados

- `{ userId: 1, createdAt: -1 }`
- `createdAt`
- `nota` apenas se houver consulta estatistica que justifique

---

## MongoDB IDs

O restante do backend trata IDs como strings.

O adaptador pode:
- converter ObjectId para string ao devolver os objetos; ou
- usar UUID/string como `_id`.

O importante e que o contrato externo use `id: string`.

---

## Foto

Hoje a foto fica em `storage/uploads` e o `fotoUrl` fica no usuario.

Em producao, podem optar por:
- Cloudinary
- S3/R2
- Azure Blob
- GridFS

O banco nao deve armazenar binario grande dentro do documento de usuario sem uma decisao explicita de arquitetura.

---

## Ativacao

Depois que o adaptador Mongo estiver implementado:

```env
DATA_DRIVER=mongo
MONGODB_URI=...
```

A URI deve ser lida somente dentro do adaptador Mongo e nunca enviada ao frontend.
