/**
 * PONTO DE INTEGRACAO DO MONGODB.
 *
 * O integrante responsavel pelo banco deve substituir esta funcao por
 * implementacoes dos contratos UserRepository e EssayRepository.
 *
 * Veja docs/MONGODB_CONTRACT.md.
 */
export async function createMongoRepositories() {
  throw new Error(
    'DATA_DRIVER=mongo foi selecionado, mas o adaptador MongoDB ainda nao foi implementado. ' +
    'Implemente src/repositories/mongo/createMongoRepositories.js conforme docs/MONGODB_CONTRACT.md.',
  );
}
