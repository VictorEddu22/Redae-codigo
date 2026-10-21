import { apiRequest } from './api';

const cache = new Map();

async function cached(key, path) {
  if (!cache.has(key)) {
    cache.set(key, apiRequest(path).catch((error) => {
      cache.delete(key);
      throw error;
    }));
  }
  return cache.get(key);
}

export const contentService = {
  themes() {
    return cached('themes', '/api/content/themes');
  },
  models() {
    return cached('models', '/api/content/models');
  },
  learning() {
    return cached('learning', '/api/content/learning');
  },
  clearCache() {
    cache.clear();
  },
};
