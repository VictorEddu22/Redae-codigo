import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { essayService } from '../services/essayService';
import '../styles/historico.css';

export default function HistoricoPage() {
  const [essays, setEssays] = useState([]);
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    essayService.list()
      .then((items) => { if (active) setEssays(items); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return essays.filter((essay) => {
      const matchesText = !normalized || `${essay.titulo || ''} ${essay.tema || ''}`.toLowerCase().includes(normalized);
      const score = Number(essay.nota || 0);
      const matchesRange = range === 'todas' || (range === '900' && score >= 900) || (range === '800' && score >= 800 && score < 900) || (range === 'abaixo' && score < 800);
      return matchesText && matchesRange;
    });
  }, [essays, query, range]);

  const average = essays.length ? Math.round(essays.reduce((sum, item) => sum + Number(item.nota || 0), 0) / essays.length) : 0;

  return (
    <main className="page history-page">
      <div className="container history-heading">
        <div>
          <span className="eyebrow">Hist&oacute;rico de reda&ccedil;&otilde;es</span>
          <h1 className="page-heading">Seu arquivo de evolu&ccedil;&atilde;o.</h1>
          <p className="page-copy">Releia resultados, compare notas e descubra padr&otilde;es no seu desempenho.</p>
        </div>
        <Link className="button button--primary" to="/nova-redacao">Nova reda&ccedil;&atilde;o &rarr;</Link>
      </div>

      <div className="container history-stats">
        <article><span>Reda&ccedil;&otilde;es</span><strong>{essays.length}</strong><small>corrigidas</small></article>
        <article><span>M&eacute;dia atual</span><strong>{average}</strong><small>de 1000</small></article>
        <article><span>Melhor nota</span><strong>{Math.max(...essays.map((item) => Number(item.nota || 0)), 0)}</strong><small>seu recorde</small></article>
      </div>

      <section className="container history-board surface">
        <div className="history-toolbar">
          <div className="field history-search"><label htmlFor="buscar-redacao">Buscar reda&ccedil;&atilde;o</label><input id="buscar-redacao" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titulo ou tema..." /></div>
          <div className="field history-filter"><label htmlFor="filtro-nota">Faixa de nota</label><select id="filtro-nota" value={range} onChange={(event) => setRange(event.target.value)}><option value="todas">Todas</option><option value="900">900 ou mais</option><option value="800">800 a 899</option><option value="abaixo">Abaixo de 800</option></select></div>
        </div>

        {loading ? <p className="history-empty">Carregando seu hist&oacute;rico...</p> : null}
        {error ? <p className="form-message form-message--error">{error}</p> : null}

        <div className="history-list">
          {filtered.map((essay, index) => {
            const date = new Date(essay.createdAt || Date.now()).toLocaleDateString('pt-BR');
            return (
              <article className="history-item" key={essay.id || index}>
                <div className="history-item__number">{String(index + 1).padStart(2, '0')}</div>
                <div className="history-item__content">
                  <div><span className="badge">{essay.status || 'Corrigida'}</span><h2>{essay.titulo || 'Redacao sem titulo'}</h2><p>{essay.tema}</p></div>
                  <div className="history-item__meta"><span>{date}</span><span className="score-badge">{essay.nota ?? '-'} <small>/1000</small></span><Link to={`/feedback/${essay.id}`}>Ver feedback &rarr;</Link></div>
                </div>
              </article>
            );
          })}
          {!loading && !error && !filtered.length ? <p className="history-empty">Nenhuma reda&ccedil;&atilde;o encontrada com esses filtros.</p> : null}
        </div>
      </section>
    </main>
  );
}
