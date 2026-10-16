import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';
import { setSession } from '../services/session';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !senha.trim()) {
      setError('Informe seu e-mail e sua senha para continuar.');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(email.trim(), senha);
      setSession(user);
      navigate('/nova-redacao');
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Acessar conta"
      title="Bem-vindo de volta."
      copy="Entre para continuar seus treinos e acompanhar seu histórico."
      footer={<p>Ainda não tem conta? <Link to="/cadastro">Criar cadastro</Link></p>}
    >
      <form className="form-grid auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
            autoComplete="email"
          />
        </div>
        <div className="field">
          <div className="auth-field-row">
            <label htmlFor="login-senha">Senha</label>
            <button type="button" className="auth-text-button">Esqueci minha senha</button>
          </div>
          <input
            id="login-senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Sua senha"
            autoComplete="current-password"
          />
        </div>

        {error ? <p className="form-message form-message--error">{error}</p> : null}

        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar →'}
        </button>

        <p className="auth-demo-tip">
          Teste sem backend: <strong>demo@redae.com</strong> / <strong>123456</strong>
        </p>
      </form>
    </AuthLayout>
  );
}
