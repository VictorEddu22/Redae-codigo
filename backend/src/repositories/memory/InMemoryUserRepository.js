import { randomUUID } from 'node:crypto';
import { UserRepository } from '../contracts/UserRepository.js';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.items = new Map();
  }

  async create(data) {
    const now = new Date().toISOString();
    const item = {
      id: randomUUID(),
      nome: data.nome,
      email: normalizeEmail(data.email),
      telefone: data.telefone || '',
      passwordHash: data.passwordHash || null,
      googleSub: data.googleSub || null,
      bio: data.bio || '',
      escolaridade: data.escolaridade || '',
      fotoUrl: data.fotoUrl || '',
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(item.id, item);
    return structuredClone(item);
  }

  async findById(id) {
    const item = this.items.get(String(id));
    return item ? structuredClone(item) : null;
  }

  async findByEmail(email) {
    const normalized = normalizeEmail(email);
    const item = [...this.items.values()].find((user) => user.email === normalized);
    return item ? structuredClone(item) : null;
  }

  async findByGoogleSub(googleSub) {
    const item = [...this.items.values()].find((user) => user.googleSub === googleSub);
    return item ? structuredClone(item) : null;
  }

  async update(id, changes) {
    const current = this.items.get(String(id));
    if (!current) return null;

    const next = {
      ...current,
      ...changes,
      id: current.id,
      email: changes.email ? normalizeEmail(changes.email) : current.email,
      updatedAt: new Date().toISOString(),
    };
    this.items.set(current.id, next);
    return structuredClone(next);
  }
}
