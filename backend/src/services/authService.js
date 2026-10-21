import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { HttpError } from '../utils/httpError.js';
import { signAccessToken } from '../utils/jwt.js';
import { toPublicUser } from '../utils/userView.js';
import { env } from '../config/env.js';

export class AuthService {
  constructor(userRepository) {
    this.users = userRepository;
    this.googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;
  }

  async register(payload) {
    const email = payload.email.trim().toLowerCase();
    const exists = await this.users.findByEmail(email);
    if (exists) throw new HttpError(409, 'Este e-mail ja esta em uso.', 'EMAIL_IN_USE');

    const passwordHash = await bcrypt.hash(payload.senha, 12);
    const user = await this.users.create({
      nome: payload.nome.trim(),
      email,
      telefone: payload.telefone?.trim() || '',
      passwordHash,
    });

    return this.createSessionResult(user);
  }

  async login(email, senha) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new HttpError(401, 'E-mail ou senha invalidos.', 'INVALID_CREDENTIALS');
    }

    const ok = await bcrypt.compare(senha, user.passwordHash);
    if (!ok) throw new HttpError(401, 'E-mail ou senha invalidos.', 'INVALID_CREDENTIALS');

    return this.createSessionResult(user);
  }

  async googleLogin(credential) {
    if (!env.googleClientId || !this.googleClient) {
      throw new HttpError(
        503,
        'Login Google ainda nao configurado. Defina GOOGLE_CLIENT_ID no backend.',
        'GOOGLE_NOT_CONFIGURED',
      );
    }

    let payload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: env.googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw new HttpError(401, 'Token do Google invalido ou expirado.', 'INVALID_GOOGLE_TOKEN');
    }

    if (!payload?.sub || !payload?.email || payload.email_verified !== true) {
      throw new HttpError(401, 'Conta Google sem e-mail verificado.', 'GOOGLE_EMAIL_NOT_VERIFIED');
    }

    let user = await this.users.findByGoogleSub(payload.sub);
    if (!user) {
      user = await this.users.findByEmail(payload.email);

      if (user) {
        user = await this.users.update(user.id, {
          googleSub: payload.sub,
          fotoUrl: user.fotoUrl || payload.picture || '',
          nome: user.nome || payload.name || payload.email.split('@')[0],
        });
      } else {
        user = await this.users.create({
          nome: payload.name || payload.email.split('@')[0],
          email: payload.email,
          googleSub: payload.sub,
          fotoUrl: payload.picture || '',
          passwordHash: null,
        });
      }
    }

    return this.createSessionResult(user);
  }

  async me(userId) {
    const user = await this.users.findById(userId);
    if (!user) throw new HttpError(401, 'Sessao invalida.', 'INVALID_SESSION');
    return toPublicUser(user);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.users.findById(userId);
    if (!user) throw new HttpError(404, 'Usuario nao encontrado.', 'USER_NOT_FOUND');

    if (user.passwordHash) {
      const ok = await bcrypt.compare(currentPassword || '', user.passwordHash);
      if (!ok) throw new HttpError(400, 'Senha atual incorreta.', 'INVALID_CURRENT_PASSWORD');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    const updated = await this.users.update(userId, { passwordHash });
    return toPublicUser(updated);
  }

  createSessionResult(user) {
    return {
      token: signAccessToken(user),
      user: toPublicUser(user),
    };
  }
}
