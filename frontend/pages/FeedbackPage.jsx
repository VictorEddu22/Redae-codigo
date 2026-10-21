import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { essayService } from '../services/essayService';
import '../styles/feedback.css';

function normalizeCompetencies(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => ({
    code: item.code || `C${index + 1}`,
    label: item.label || item.nome || `Competencia ${index + 1}`,
    score: Number(item.score ?? item.nota ?? 0),
    comentario: item.comentario || '',
  }));
}

export default function FeedbackPage() {
  const { id } = useParams();
  const location = useLocation();
  const initial = location.state?.result?.feedback ? location.state.result : null;
  const [result, setResult] = useState(initial);
  const [error, setError] = useState('');

  useEffect(() => {
    if (result) return undefined;
    let active = true;
    essayService.getById(id)
      .then((item) => { if (active) setResult(item); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [id, result]);

  if (error) return <main className="page feedback-page"><div className="container error-state surface"><span className="eyebrow">Feedback</span><h1>Nao foi possivel abrir esta correcao.</h1><p>{error}</p><Link className="button button--quiet" to="/historico">Voltar ao historico</Link></div></main>;
  if (!result) return <main className="page feedback-page"><div className="container route-loading"><span className="route-loading__dot" /><p>Carregando resultado...</p></div></main>;

  const score = Number(result.nota ?? result.nota_final ?? result.score ?? 0);
  const competencies = normalizeCompetencies(result.competencias);
  const strengths = result.pontosFortes || result.pontos_fortes || [];
  const improvements = result.pontosMelhorar || result.pontos_melhorar || [];

  return (
    <main className="page feedback-page">
      <div className="container feedback-top">
        <div><span className="eyebrow">Feedback da reda&ccedil;&atilde;o</span><h1 className="page-heading">Seu texto j&aacute; mostra progresso.</h1><p className="page-copy">{result.tema || 'Resultado da avaliacao da redacao enviada.'}</p></div>
        <div className="feedback-score-card"><span>Nota estimada</span><strong>{score || '-'}</strong><small>de 1000 pontos</small></div>
      </div>

      <div className="container feedback-grid">
        <section className="feedback-main surface">
          <div className="feedback-main__header"><div><span className="badge">Vis&atilde;o geral</span><h2>{result.titulo || 'Sua redacao'}</h2></div><span className="feedback-status">corre&ccedil;&atilde;o conclu&iacute;da</span></div>
          <p className="feedback-summary">{result.feedback || 'A redacao apresenta pontos claros de evolucao para o proximo treino.'}</p>

          <div className="competency-results">
            {competencies.map((item) => {
              const percent = Math.min(100, Math.max(0, (item.score / 200) * 100));
              return (
                <article className="competency-result" key={item.code} title={item.comentario}>
                  <div className="competency-result__head"><span>{item.code}</span><div><strong>{item.label}</strong><small>{item.score} / 200</small></div></div>
                  <div className="competency-result__track" aria-label={`${item.score} de 200 pontos`}><i style={{ width: `${percent}%` }} /></div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="feedback-side">
          <section className="feedback-list feedback-list--good"><span className="feedback-list__symbol">+</span><h2>O que funcionou</h2><ul>{strengths.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="feedback-list feedback-list--next"><span className="feedback-list__symbol">&rarr;</span><h2>Pr&oacute;ximo foco</h2><ul>{improvements.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </aside>
      </div>

      <div className="container feedback-actions">
        <div><span>Pr&oacute;ximo treino</span><strong>{result.proximoTreino || 'Reescreva um paragrafo aplicando uma das sugestoes acima.'}</strong></div>
        <div><Link className="button button--quiet" to="/historico">Ver hist&oacute;rico</Link><Link className="button button--primary" to="/nova-redacao">Nova reda&ccedil;&atilde;o &rarr;</Link></div>
      </div>
    </main>
  );
}
