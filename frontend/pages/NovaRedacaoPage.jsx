import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { essayService } from '../services/essayService';
import '../styles/nova-redacao.css';

const DRAFT_KEY = 'redae.draft';

export default function NovaRedacaoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedThemeTitle = searchParams.get('tema') || '';
  const [themes, setThemes] = useState([]);
  const [themesError, setThemesError] = useState('');
  const [form, setForm] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') || { titulo: '', tema: selectedThemeTitle, texto: '' };
    } catch {
      return { titulo: '', tema: selectedThemeTitle, texto: '' };
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    let active = true;
    contentService.themes()
      .then((items) => { if (active) setThemes(items); })
      .catch((err) => { if (active) setThemesError(err.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (selectedThemeTitle) setForm((current) => ({ ...current, tema: selectedThemeTitle }));
  }, [selectedThemeTitle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      if (form.texto.trim()) setSavedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 500);
    return () => clearTimeout(timer);
  }, [form]);

  const wordCount = useMemo(() => form.texto.trim() ? form.texto.trim().split(/\s+/).length : 0, [form.texto]);
  const charCount = form.texto.length;
  const paragraphs = form.texto.trim() ? form.texto.trim().split(/\n\s*\n/).filter(Boolean).length : 0;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.tema.trim() || !form.texto.trim()) {
      setError('Escolha ou informe um tema e escreva sua redacao antes de enviar.');
      return;
    }
    if (wordCount < 30) {
      setError('Para testar a correcao, escreva pelo menos 30 palavras.');
      return;
    }

    try {
      setLoading(true);
      const result = await essayService.create({
        ...form,
        titulo: form.titulo.trim() || 'Redacao sem titulo',
      });
      localStorage.removeItem(DRAFT_KEY);
      navigate(`/feedback/${result.id || result._id}`, { state: { result } });
    } catch (err) {
      setError(err.message || 'Nao foi possivel enviar a redacao.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page write-page">
      <div className="container write-page__header">
        <div>
          <span className="eyebrow">Nova reda&ccedil;&atilde;o</span>
          <h1 className="page-heading">Coloque suas ideias no papel.</h1>
        </div>
        <div className="write-page__header-note">
          <span>Rascunho autom&aacute;tico</span>
          <strong>{savedAt ? `salvo as ${savedAt}` : 'pronto para comecar'}</strong>
        </div>
      </div>

      <div className="container write-layout">
        <aside className="write-guide">
          <div className="write-guide__block">
            <span className="write-guide__index">01</span>
            <h2>Defina o tema</h2>
            <p>Voc&ecirc; pode usar um tema da biblioteca ou escrever uma proposta pr&oacute;pria.</p>
          </div>

          <div className="write-theme-list">
            {themes.slice(0, 3).map((theme) => (
              <button type="button" key={theme.id} className={`write-theme ${form.tema === theme.title ? 'is-selected' : ''}`} onClick={() => setForm((current) => ({ ...current, tema: theme.title }))}>
                <span>{theme.category}</span>
                <strong>{theme.title}</strong>
              </button>
            ))}
          </div>

          {themesError ? <p className="muted">N&atilde;o foi poss&iacute;vel carregar as sugest&otilde;es agora. Voc&ecirc; ainda pode digitar seu pr&oacute;prio tema.</p> : null}
          <Link className="write-guide__link" to="/modelos-temas">Ver todos os temas &rarr;</Link>

          <div className="write-checklist">
            <strong>Antes de enviar</strong>
            <label><input type="checkbox" readOnly checked={wordCount >= 30} /> Tema desenvolvido</label>
            <label><input type="checkbox" readOnly checked={paragraphs >= 3} /> Estrutura em par&aacute;grafos</label>
            <label><input type="checkbox" readOnly checked={wordCount >= 120} /> Argumenta&ccedil;&atilde;o desenvolvida</label>
          </div>
        </aside>

        <form className="write-editor surface" onSubmit={handleSubmit}>
          <div className="write-editor__top">
            <div className="field">
              <label htmlFor="tema">Tema</label>
              <input id="tema" name="tema" value={form.tema} onChange={updateField} placeholder="Digite ou escolha um tema" maxLength="500" />
            </div>
            <div className="field">
              <label htmlFor="titulo">T&iacute;tulo <span className="muted">(opcional)</span></label>
              <input id="titulo" name="titulo" value={form.titulo} onChange={updateField} placeholder="Titulo da redacao" maxLength="180" />
            </div>
          </div>

          <div className="write-editor__paper">
            <div className="write-editor__paper-head">
              <span>02 - escreva sua reda&ccedil;&atilde;o</span>
              <span>{wordCount} palavras &middot; {charCount} caracteres</span>
            </div>
            <textarea name="texto" value={form.texto} onChange={updateField} placeholder="Comece pela sua tese e desenvolva os argumentos com calma..." aria-label="Texto da redacao" maxLength="20000" />
          </div>

          {error ? <p className="form-message form-message--error" role="alert">{error}</p> : null}

          <div className="write-editor__footer">
            <span className="muted">A avalia&ccedil;&atilde;o autom&aacute;tica &eacute; um apoio ao estudo e n&atilde;o substitui a corre&ccedil;&atilde;o de um professor.</span>
            <button className="button button--primary" type="submit" disabled={loading}>
              {loading ? 'Analisando...' : 'Enviar para correcao ->'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
