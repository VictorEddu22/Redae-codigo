const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_ENABLED = import.meta.env.VITE_API_ENABLED === 'true';

export function isApiEnabled() {
  return API_ENABLED;
}

export async function apiRequest(path, options = {}) {
  if (!API_ENABLED) {
    throw new Error('API_DESABILITADA');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok || data?.error) {
      throw new Error(data?.msg || data?.message || 'Erro na API');
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}
