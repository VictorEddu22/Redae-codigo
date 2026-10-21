import { randomUUID } from 'node:crypto';
import { EssayRepository } from '../contracts/EssayRepository.js';

export class InMemoryEssayRepository extends EssayRepository {
  constructor() {
    super();
    this.items = new Map();
  }

  async create(data) {
    const now = new Date().toISOString();
    const item = {
      id: randomUUID(),
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };
    this.items.set(item.id, item);
    return structuredClone(item);
  }

  async findById(id) {
    const item = this.items.get(String(id));
    return item ? structuredClone(item) : null;
  }

  async listByUserId(userId) {
    return [...this.items.values()]
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((item) => structuredClone(item));
  }

  async deleteByIdForUser(id, userId) {
    const current = this.items.get(String(id));
    if (!current || current.userId !== userId) return false;
    return this.items.delete(String(id));
  }
}
