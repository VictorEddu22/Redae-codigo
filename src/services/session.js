const SESSION_KEY = 'redae.session';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('redae-session-change'));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
