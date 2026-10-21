import { apiRequest, resolveApiAsset } from './api';

function normalizeUser(user) {
  if (!user) return user;
  return {
    ...user,
    fotoUrl: resolveApiAsset(user.fotoUrl),
  };
}

export const profileService = {
  async get() {
    return normalizeUser(await apiRequest('/api/profile'));
  },

  async update(payload) {
    return normalizeUser(await apiRequest('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }));
  },

  async uploadPhoto(file) {
    const body = new FormData();
    body.append('foto', file);
    return normalizeUser(await apiRequest('/api/profile/photo', {
      method: 'POST',
      body,
      timeoutMs: 60000,
    }));
  },
};
