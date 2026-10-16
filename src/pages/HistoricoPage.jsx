import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { essayService } from '../services/essayService';
import '../styles/historico.css';

export default function HistoricoPage() {
  const [essays, setEssays] = useState([]);
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('todas');

  useEffect(() => {
    essayService.list().then(setEssays);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return essays.filter((essay) => {
      const matchesText = !normalized || `${essay.titulo} ${essay.tema}`.toLowerCase().includes(normalized);
      const score = Number(essay.nota || 0);
      const matchesRange =
        range === 'todas' ||
        (range === '900' && score >= 900) ||
        (range === '800' && score >= 800 && score < 900) ||
        (range === 'abaixo' && score < 800);
      return matchesText && matchesRange;
    });
  }, [essays, query, range]);

  const average = essays.length
    ? Math.round(essays.reduce((sum, item) => sum + Number(item.nota || 0), 0) / essays.length)
    : 0;

  return (
    <main className="page history-page">
      <div className="container history-heading">
        <div>
          <span className="eyebrow">Histórico de redações</span>
          <h1 className="page-heading">Seu arquivo de evolução.</h1>
          <p className="page-copy">Releia resultados, compare notas e descubra padrões no seu desempenho.</p>
        </div>
        <Link className="button button--primary" to="/nova-redacao">Nova redação →</Link>
      </div>

      <div className="container history-stats">
        <article><span>Redações</span><strong>{essays.length}</strong><small>corrigidas</small></article>
        <article><span>Média atual</span><strong>{average}</strong><small>de 1000</small></article>
        <article><span>Melhor nota</span><strong>{Math.max(...essays.map((item) => Number(item.nota || 0)), 0)}</strong><small>seu recorde</small></article>
      </div>

      <section className="container history-board surface">
        <div className="history-toolbar">
          <div className="field history-search">
            <label htmlFor="buscar-redacao">Buscar redação</label>
            <input id="buscar-redacao" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título ou tema..." />
          </div>
          <div className="field history-filter">
            <label htmlFor="filtro-nota">Faixa de nota</label>
            <select id="filtro-nota" value={range} onChange={(event) => setRange(event.target.value)}>
              <option value="todas">Todas</option>
              <option value="900">900 ou mais</option>
              <option value="800">800 a 899</option>
              <option value="abaixo">Abaixo de 800</option>
            </select>
          </div>
        </div>

        <div className="history-list">
          {filtered.map((essay, index) => {
            const date = new Date(essay.createdAt || Date.now()).toLocaleDateString('pt-BR');
            return (
              <article className="history-item" key={essay.id || index}>
                <div className="history-item__number">{String(index + 1).padStart(2, '0')}</div>
                <div className="history-item__content">
                  <div>
                    <span className="badge">{essay.status || 'Corrigida'}</span>
                    <h2>{essay.titulo || 'Redação sem título'}</h2>
                    <p>{essay.tema}</p>
                  </div>
                  <div className="history-item__meta">
                    <span>{date}</span>
                    <span className="score-badge">{essay.nota || '—'} <small>/1000</small></span>
                    <Link to={`/feedback/${essay.id}`} state={{ result: essay }}>Ver feedback →</Link>
                  </div>
                </div>
              </article>
            );
          })}
          {!filtered.length ? <p className="history-empty">Nenhuma redação encontrada com esses filtros.</p> : null}
        </div>
      </section>
    </main>
  );
}
