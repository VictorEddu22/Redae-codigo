import { apiRequest, isApiEnabled } from './api';

const USERS_KEY = 'redae.users';

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createLocalUser(payload) {
  const users = getLocalUsers();
  const exists = users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase());
  if (exists) throw new Error('Este e-mail já está em uso.');

  const user = {
    id: crypto.randomUUID?.() || String(Date.now()),
    ...payload,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveLocalUsers(users);
  return user;
}

export const authService = {
  async register(payload) {
    if (isApiEnabled()) {
      try {
        return await apiRequest('/conta', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } catch {
        return createLocalUser(payload);
      }
    }

    return createLocalUser(payload);
  },

  async login(email, senha) {
    if (isApiEnabled()) {
      try {
        return await apiRequest(`/conta/${encodeURIComponent(email)}/${encodeURIComponent(senha)}`);
      } catch {
        // O front continua utilizável mesmo quando o backend ainda não estiver pronto.
      }
    }

    const localUser = getLocalUsers().find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.senha === senha,
    );

    if (localUser) return localUser;

    // Conta demonstrativa para testar o front sem backend.
    if (email === 'demo@redae.com' && senha === '123456') {
      return { id: 'demo', nome: 'Estudante Demo', email };
    }

    throw new Error('E-mail ou senha inválidos.');
  },
};
