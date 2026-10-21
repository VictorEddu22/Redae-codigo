import { useEffect, useMemo, useState } from 'react';
import { essayService } from '../services/essayService';
import '../styles/desempenho.css';

function buildPolyline(values) {
  if (!values.length) return '';
  const width = 700;
  const height = 220;
  const min = Math.min(500, ...values);
  const max = 1000;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  return values.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / Math.max(1, max - min)) * height;
    return `${x},${Math.max(0, Math.min(height, y))}`;
  }).join(' ');
}

const focusCopy = {
  C1: 'Revise concordancia, pontuacao e construcao sintatica antes do proximo envio.',
  C2: 'Relacione repertorio e argumentos diretamente ao recorte proposto pelo tema.',
  C3: 'Sustente cada argumento com explicacao, evidencia e relacao clara com a tese.',
  C4: 'Varie conectivos e deixe explicita a relacao entre frases, periodos e paragrafos.',
  C5: 'Detalhe agente, acao, meio, finalidade e efeito da proposta de intervencao.',
};

export default function DesempenhoPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    essayService.performance()
      .then((result) => { if (active) setData(result); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  const timeline = data?.timeline || [];
  const scores = timeline.map((item) => Number(item.nota || 0));
  const points = buildPolyline(scores);
  const competencyAverages = data?.competencias || [];
  const nextFocus = useMemo(() => {
    if (!competencyAverages.length) return null;
    return [...competencyAverages].sort((a, b) => a.value - b.value)[0];
  }, [competencyAverages]);

  if (error) {
    return <main className="page performance-page"><div className="container error-state surface"><span className="eyebrow">Desempenho</span><h1>Nao foi possivel carregar sua evolucao.</h1><p>{error}</p></div></main>;
  }

  return (
    <main className="page performance-page">
      <div className="container performance-heading">
        <span className="eyebrow">Desempenho e evolu&ccedil;&atilde;o</span>
        <h1 className="page-heading">Mais importante que a nota &eacute; a dire&ccedil;&atilde;o.</h1>
        <p className="page-copy">Observe a tend&ecirc;ncia das suas corre&ccedil;&otilde;es e escolha uma compet&ecirc;ncia para focar no pr&oacute;ximo treino.</p>
      </div>

      <div className="container performance-kpis">
        <article><span>M&eacute;dia geral</span><strong>{data?.media ?? '...'}</strong><small>/1000</small></article>
        <article><span>Evolu&ccedil;&atilde;o</span><strong>{data ? `${data.evolucao >= 0 ? '+' : ''}${data.evolucao}` : '...'}</strong><small>pontos desde o in&iacute;cio</small></article>
        <article><span>Melhor resultado</span><strong>{data?.melhor ?? '...'}</strong><small>recorde pessoal</small></article>
        <article><span>Treinos</span><strong>{data?.total ?? '...'}</strong><small>reda&ccedil;&otilde;es corrigidas</small></article>
      </div>

      <div className="container performance-grid">
        <section className="performance-chart surface">
          <div className="performance-section-title">
            <div><span className="badge">Linha do tempo</span><h2>Notas por reda&ccedil;&atilde;o</h2></div>
            <span className="performance-trend">tend&ecirc;ncia de evolu&ccedil;&atilde;o</span>
          </div>

          <div className="score-chart">
            <div className="score-chart__labels"><span>1000</span><span>750</span><span>500</span></div>
            <svg viewBox="0 0 700 220" preserveAspectRatio="none" role="img" aria-label="Grafico de evolucao das notas">
              <line x1="0" y1="0" x2="700" y2="0" />
              <line x1="0" y1="110" x2="700" y2="110" />
              <line x1="0" y1="220" x2="700" y2="220" />
              <polyline points={points} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="score-chart__footer">{timeline.map((essay, index) => <span key={essay.id || index}>#{index + 1}</span>)}</div>
          </div>
        </section>

        <section className="competency-average surface">
          <div className="performance-section-title"><div><span className="badge">M&eacute;dia por compet&ecirc;ncia</span><h2>Onde voc&ecirc; est&aacute; mais forte</h2></div></div>
          <div className="competency-average__list">
            {competencyAverages.map((item) => (
              <div className="competency-average__item" key={item.code}>
                <div><strong>{item.code}</strong><span>{item.value}/200</span></div>
                <div className="competency-average__track"><i style={{ width: `${(item.value / 200) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="performance-tip">
            <span>Pr&oacute;ximo foco sugerido</span>
            <strong>{nextFocus ? `${nextFocus.code} - ${nextFocus.value}/200` : 'Envie sua primeira redacao'}</strong>
            <p>{nextFocus ? focusCopy[nextFocus.code] : 'Depois da primeira correcao, o Redae! indicara automaticamente a competencia com maior oportunidade de evolucao.'}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
