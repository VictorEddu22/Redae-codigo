import { HttpError } from '../utils/httpError.js';
import { toPublicUser } from '../utils/userView.js';

export class ProfileService {
  constructor(userRepository) {
    this.users = userRepository;
  }

  async get(userId) {
    const user = await this.users.findById(userId);
    if (!user) throw new HttpError(404, 'Usuario nao encontrado.', 'USER_NOT_FOUND');
    return toPublicUser(user);
  }

  async update(userId, changes) {
    const user = await this.users.findById(userId);
    if (!user) throw new HttpError(404, 'Usuario nao encontrado.', 'USER_NOT_FOUND');

    const allowed = {
      nome: changes.nome?.trim() || user.nome,
      telefone: changes.telefone !== undefined ? changes.telefone.trim() : user.telefone,
      bio: changes.bio !== undefined ? changes.bio.trim() : user.bio,
      escolaridade: changes.escolaridade !== undefined ? changes.escolaridade.trim() : user.escolaridade,
    };

    const updated = await this.users.update(userId, allowed);
    return toPublicUser(updated);
  }

  async setPhoto(userId, fotoUrl) {
    const user = await this.users.findById(userId);
    if (!user) throw new HttpError(404, 'Usuario nao encontrado.', 'USER_NOT_FOUND');

    const updated = await this.users.update(userId, { fotoUrl });
    return toPublicUser(updated);
  }
}
