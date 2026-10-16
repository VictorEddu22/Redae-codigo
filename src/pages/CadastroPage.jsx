import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/authService';
import { setSession } from '../services/session';

const initialForm = { nome: '', telefone: '', email: '', senha: '', confirmarSenha: '' };

export default function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.nome.trim() || !form.email.trim() || !form.senha) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }
    if (form.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas informadas são diferentes.');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.register({
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        email: form.email.trim(),
        senha: form.senha,
      });
      setSession(user);
      navigate('/nova-redacao');
    } catch (err) {
      setError(err.message || 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Novo estudante"
      title="Crie seu espaço de treino."
      copy="Seu histórico fica organizado para você comparar resultados e perceber sua evolução."
      footer={<p>Já possui cadastro? <Link to="/login">Entrar agora</Link></p>}
    >
      <form className="form-grid auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="cadastro-nome">Nome completo</label>
          <input id="cadastro-nome" name="nome" value={form.nome} onChange={updateField} placeholder="Seu nome" autoComplete="name" />
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="cadastro-email">E-mail</label>
            <input id="cadastro-email" name="email" type="email" value={form.email} onChange={updateField} placeholder="voce@email.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="cadastro-telefone">Telefone</label>
            <input id="cadastro-telefone" name="telefone" value={form.telefone} onChange={updateField} placeholder="(31) 99999-9999" autoComplete="tel" />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="cadastro-senha">Senha</label>
            <input id="cadastro-senha" name="senha" type="password" value={form.senha} onChange={updateField} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="cadastro-confirmar">Confirmar senha</label>
            <input id="cadastro-confirmar" name="confirmarSenha" type="password" value={form.confirmarSenha} onChange={updateField} placeholder="Repita sua senha" autoComplete="new-password" />
          </div>
        </div>

        {error ? <p className="form-message form-message--error">{error}</p> : null}

        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar minha conta →'}
        </button>
      </form>
    </AuthLayout>
  );
}
