import { env } from '../config/env.js';
import { InMemoryUserRepository } from './memory/InMemoryUserRepository.js';
import { InMemoryEssayRepository } from './memory/InMemoryEssayRepository.js';
import { createMongoRepositories } from './mongo/createMongoRepositories.js';

const contracts = {
  users: ['create', 'findById', 'findByEmail', 'findByGoogleSub', 'update'],
  essays: ['create', 'findById', 'listByUserId', 'deleteByIdForUser'],
};

function assertRepositories(repositories) {
  for (const [name, methods] of Object.entries(contracts)) {
    const repository = repositories?.[name];
    if (!repository) throw new Error(`Repository ausente: ${name}`);
    for (const method of methods) {
      if (typeof repository[method] !== 'function') throw new Error(`Repository ${name} nao implementa ${method}().`);
    }
  }
  return repositories;
}

export async function createRepositories() {
  if (env.dataDriver === 'mongo') return assertRepositories(await createMongoRepositories());
  return assertRepositories({ users: new InMemoryUserRepository(), essays: new InMemoryEssayRepository() });
}
