import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const destination = location.state?.from || '/nova-redacao';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !senha.trim()) {
      setError('Informe seu e-mail e sua senha para continuar.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), senha);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleCredential = useCallback(async (credential) => {
    setError('');
    try {
      setLoading(true);
      await loginWithGoogle(credential);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Nao foi possivel entrar com Google.');
    } finally {
      setLoading(false);
    }
  }, [destination, loginWithGoogle, navigate]);

  return (
    <AuthLayout
      eyebrow="Acessar conta"
      title="Bem-vindo de volta."
      copy="Entre para continuar seus treinos e acompanhar seu historico."
      footer={<p>Ainda n&atilde;o tem conta? <Link to="/cadastro">Criar cadastro</Link></p>}
    >
      <form className="form-grid auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login-email">E-mail</label>
          <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="login-senha">Senha</label>
          <input id="login-senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="Sua senha" autoComplete="current-password" />
        </div>

        {error ? <p className="form-message form-message--error" role="alert">{error}</p> : null}

        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar ->'}
        </button>
      </form>

      <GoogleSignInButton onCredential={handleGoogleCredential} disabled={loading} />
    </AuthLayout>
  );
}
