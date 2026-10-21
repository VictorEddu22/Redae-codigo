import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { useAuth } from '../hooks/useAuth';
import '../styles/profile.css';

const educationOptions = [
  'Ensino Fundamental',
  'Ensino M\u00e9dio',
  'Ensino M\u00e9dio conclu\u00eddo',
  'Gradua\u00e7\u00e3o',
  'P\u00f3s-gradua\u00e7\u00e3o',
  'Outro',
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ nome: '', telefone: '', bio: '', escolaridade: '' });
  const [passwords, setPasswords] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    let active = true;
    profileService.get()
      .then((profile) => {
        if (!active) return;
        updateUser(profile);
        setForm({
          nome: profile.nome || '',
          telefone: profile.telefone || '',
          bio: profile.bio || '',
          escolaridade: profile.escolaridade || '',
        });
      })
      .catch((error) => {
        if (active) setMessage({ type: 'error', text: error.message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [updateUser]);

  const initials = useMemo(() => {
    return (user?.nome || 'R')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [user?.nome]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      setSaving(true);
      const updated = await profileService.update(form);
      updateUser(updated);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage({ type: '', text: '' });
    try {
      setSaving(true);
      const updated = await profileService.uploadPhoto(file);
      updateUser(updated);
      setMessage({ type: 'success', text: 'Foto atualizada.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
      event.target.value = '';
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setMessage({ type: '', text: '' });
    if (passwords.novaSenha.length < 8) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 8 caracteres.' });
      return;
    }
    if (passwords.novaSenha !== passwords.confirmarSenha) {
      setMessage({ type: 'error', text: 'A confirmacao da senha esta diferente.' });
      return;
    }

    try {
      setSaving(true);
      await authService.changePassword(passwords.senhaAtual, passwords.novaSenha);
      setPasswords({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      setMessage({ type: 'success', text: 'Senha alterada com sucesso.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="page"><div className="container route-loading"><span className="route-loading__dot" /><p>Carregando perfil...</p></div></main>;
  }

  return (
    <main className="page profile-page">
      <div className="container profile-heading">
        <span className="eyebrow">Seu espaco</span>
        <h1 className="page-heading">Perfil e preferencias.</h1>
        <p className="page-copy">Mantenha suas informacoes atualizadas para personalizar sua experiencia de estudo.</p>
      </div>

      <div className="container profile-grid">
        <aside className="profile-card surface">
          <div className="profile-avatar" aria-label="Foto do perfil">
            {user?.fotoUrl ? <img src={user.fotoUrl} alt="Foto do perfil" /> : <span>{initials}</span>}
          </div>
          <strong>{user?.nome}</strong>
          <p>{user?.email}</p>
          <label className="button button--quiet profile-photo-button">
            {saving ? 'Aguarde...' : 'Alterar foto'}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} disabled={saving} />
          </label>
          <small>JPG, PNG ou WEBP. O limite e definido pelo backend.</small>
        </aside>

        <div className="profile-forms">
          <form className="surface profile-form" onSubmit={saveProfile}>
            <div className="profile-form__heading">
              <span className="badge">Dados pessoais</span>
              <h2>Como voce aparece no Redae!</h2>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="profile-nome">Nome</label>
                <input id="profile-nome" name="nome" value={form.nome} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="profile-telefone">Telefone</label>
                <input id="profile-telefone" name="telefone" value={form.telefone} onChange={updateField} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="profile-escolaridade">Escolaridade</label>
              <select id="profile-escolaridade" name="escolaridade" value={form.escolaridade} onChange={updateField}>
                <option value="">Selecione</option>
                {educationOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="profile-bio">Bio</label>
              <textarea id="profile-bio" name="bio" rows="5" maxLength="500" value={form.bio} onChange={updateField} placeholder="Conte um pouco sobre seus objetivos de estudo..." />
              <small>{form.bio.length}/500 caracteres</small>
            </div>
            <button className="button button--primary" type="submit" disabled={saving}>Salvar perfil</button>
          </form>

          <form className="surface profile-form" onSubmit={changePassword}>
            <div className="profile-form__heading">
              <span className="badge">Seguranca</span>
              <h2>Alterar senha</h2>
              <p>Se sua conta nasceu pelo Google, voce pode criar uma senha local sem informar senha atual.</p>
            </div>
            <div className="field">
              <label htmlFor="senha-atual">Senha atual</label>
              <input id="senha-atual" type="password" value={passwords.senhaAtual} onChange={(event) => setPasswords((current) => ({ ...current, senhaAtual: event.target.value }))} autoComplete="current-password" />
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="nova-senha">Nova senha</label>
                <input id="nova-senha" type="password" value={passwords.novaSenha} onChange={(event) => setPasswords((current) => ({ ...current, novaSenha: event.target.value }))} autoComplete="new-password" />
              </div>
              <div className="field">
                <label htmlFor="confirmar-nova-senha">Confirmar senha</label>
                <input id="confirmar-nova-senha" type="password" value={passwords.confirmarSenha} onChange={(event) => setPasswords((current) => ({ ...current, confirmarSenha: event.target.value }))} autoComplete="new-password" />
              </div>
            </div>
            <button className="button button--dark" type="submit" disabled={saving}>Atualizar senha</button>
          </form>

          {message.text ? <p className={`form-message form-message--${message.type}`}>{message.text}</p> : null}
        </div>
      </div>
    </main>
  );
}
