import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { AUTH_INVALID_EVENT } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const clearAuth = useCallback(() => {
    setUser(null);
    setError('');
    setStatus('anonymous');
  }, []);

  const refresh = useCallback(async () => {
    try {
      const currentUser = await authService.me();
      setUser(currentUser);
      setError('');
      setStatus('authenticated');
      return currentUser;
    } catch (requestError) {
      if (requestError.status === 401) {
        clearAuth();
        return null;
      }
      setUser(null);
      setError(requestError.message || 'Nao foi possivel validar sua sessao.');
      setStatus('error');
      return null;
    }
  }, [clearAuth]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onInvalid = () => clearAuth();
    window.addEventListener(AUTH_INVALID_EVENT, onInvalid);
    return () => window.removeEventListener(AUTH_INVALID_EVENT, onInvalid);
  }, [clearAuth]);

  const login = useCallback(async (email, senha) => {
    const currentUser = await authService.login(email, senha);
    setUser(currentUser);
    setError('');
    setStatus('authenticated');
    return currentUser;
  }, []);

  const register = useCallback(async (payload) => {
    const currentUser = await authService.register(payload);
    setUser(currentUser);
    setError('');
    setStatus('authenticated');
    return currentUser;
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const currentUser = await authService.googleLogin(credential);
    setUser(currentUser);
    setError('');
    setStatus('authenticated');
    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
    setError('');
    setStatus(nextUser ? 'authenticated' : 'anonymous');
  }, []);

  const value = useMemo(() => ({
    user,
    status,
    error,
    isAuthenticated: status === 'authenticated' && Boolean(user),
    login,
    register,
    loginWithGoogle,
    logout,
    refresh,
    updateUser,
  }), [user, status, error, login, register, loginWithGoogle, logout, refresh, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
