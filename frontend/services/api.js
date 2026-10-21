const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export const AUTH_INVALID_EVENT = 'redae-auth-invalid';

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'REQUEST_FAILED', details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getApiUrl() {
  return API_URL;
}

export function resolveApiAsset(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function notifyInvalidSession() {
  window.dispatchEvent(new Event(AUTH_INVALID_EVENT));
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null);
  }
  const text = await response.text();
  return text ? { message: text } : null;
}

export async function apiRequest(path, options = {}) {
  const {
    timeoutMs = 30000,
    headers: customHeaders,
    signal: externalSignal,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const isFormData = fetchOptions.body instanceof FormData;

  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'RedaeWeb',
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(customHeaders || {}),
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      if (response.status === 401) notifyInvalidSession();
      throw new ApiError(
        data?.message || data?.msg || 'Nao foi possivel concluir a solicitacao.',
        {
          status: response.status,
          code: data?.code,
          details: data?.details,
        },
      );
    }

    return data;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new ApiError('A operacao demorou mais que o esperado. Tente novamente.', {
        status: 408,
        code: 'REQUEST_TIMEOUT',
      });
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError('Nao foi possivel conectar ao servidor. Verifique se o backend esta em execucao.', {
      code: 'NETWORK_ERROR',
    });
  } finally {
    clearTimeout(timeout);
  }
}
