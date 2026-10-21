import { apiRequest, resolveApiAsset } from './api';

function normalizeUser(response) {
  const user = response?.user || response;
  if (!user) return user;
  return { ...user, fotoUrl: resolveApiAsset(user.fotoUrl) };
}

export const authService = {
  async register(payload) {
    return normalizeUser(await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }));
  },
  async login(email, senha) {
    return normalizeUser(await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }));
  },
  async googleLogin(credential) {
    return normalizeUser(await apiRequest('/api/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }));
  },
  async me() {
    return normalizeUser(await apiRequest('/api/auth/me'));
  },
  async changePassword(senhaAtual, novaSenha) {
    return apiRequest('/api/auth/password', { method: 'PATCH', body: JSON.stringify({ senhaAtual, novaSenha }) });
  },
  async logout() {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  },
};
