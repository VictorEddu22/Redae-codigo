import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { essayService } from '../services/essayService';
import '../styles/feedback.css';

function normalizeCompetencies(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return { code: `C${index + 1}`, label: item, score: 160 };
    }
    return {
      code: item.code || `C${index + 1}`,
      label: item.label || item.nome || `Competência ${index + 1}`,
      score: Number(item.score ?? item.nota ?? 0),
    };
  });
}

export default function FeedbackPage() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);

  useEffect(() => {
    if (!result) {
      essayService.getById(id).then(setResult);
    }
  }, [id, result]);

  if (!result) {
    return <main className="page feedback-page"><div className="container"><p>Carregando resultado...</p></div></main>;
  }

  const score = Number(result.nota ?? result.nota_final ?? result.score ?? 0);
  const competencies = normalizeCompetencies(result.competencias);
  const strengths = result.pontosFortes || result.pontos_fortes || [];
  const improvements = result.pontosMelhorar || result.pontos_melhorar || [];

  return (
    <main className="page feedback-page">
      <div className="container feedback-top">
        <div>
          <span className="eyebrow">Feedback da redação</span>
          <h1 className="page-heading">Seu texto já mostra progresso.</h1>
          <p className="page-copy">{result.tema || 'Resultado da avaliação da redação enviada.'}</p>
        </div>
        <div className="feedback-score-card">
          <span>Nota estimada</span>
          <strong>{score || '—'}</strong>
          <small>de 1000 pontos</small>
        </div>
      </div>

      <div className="container feedback-grid">
        <section className="feedback-main surface">
          <div className="feedback-main__header">
            <div>
              <span className="badge">Visão geral</span>
              <h2>{result.titulo || 'Sua redação'}</h2>
            </div>
            <span className="feedback-status">✓ correção concluída</span>
          </div>

          <p className="feedback-summary">
            {result.feedback || 'A redação apresenta estrutura adequada e pontos claros de evolução para o próximo treino.'}
          </p>

          <div className="competency-results">
            {competencies.map((item) => {
              const percent = Math.min(100, Math.max(0, (item.score / 200) * 100));
              return (
                <article className="competency-result" key={item.code}>
                  <div className="competency-result__head">
                    <span>{item.code}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <small>{item.score} / 200</small>
                    </div>
                  </div>
                  <div className="competency-result__track" aria-label={`${item.score} de 200 pontos`}>
                    <i style={{ width: `${percent}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="feedback-side">
          <section className="feedback-list feedback-list--good">
            <span className="feedback-list__symbol">+</span>
            <h2>O que funcionou</h2>
            <ul>
              {(strengths.length ? strengths : ['Estrutura organizada.', 'Boa leitura do tema.', 'Tese identificável.']).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="feedback-list feedback-list--next">
            <span className="feedback-list__symbol">→</span>
            <h2>Próximo foco</h2>
            <ul>
              {(improvements.length ? improvements : ['Aprofundar repertório.', 'Variar conectivos.', 'Detalhar a intervenção.']).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </aside>
      </div>

      <div className="container feedback-actions">
        <div>
          <span>Próximo treino</span>
          <strong>Reescreva um parágrafo aplicando uma das sugestões acima.</strong>
        </div>
        <div>
          <Link className="button button--quiet" to="/historico">Ver histórico</Link>
          <Link className="button button--primary" to="/nova-redacao">Nova redação →</Link>
        </div>
      </div>
    </main>
  );
}
