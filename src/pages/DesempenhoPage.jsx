import { useEffect, useMemo, useState } from 'react';
import { essayService } from '../services/essayService';
import '../styles/desempenho.css';

function buildPolyline(values) {
  if (!values.length) return '';
  const width = 700;
  const height = 220;
  const min = 500;
  const max = 1000;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / (max - min)) * height;
      return `${x},${Math.max(0, Math.min(height, y))}`;
    })
    .join(' ');
}

export default function DesempenhoPage() {
  const [essays, setEssays] = useState([]);

  useEffect(() => {
    essayService.list().then((items) => setEssays([...items].reverse()));
  }, []);

  const scores = essays.map((item) => Number(item.nota || 0));
  const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0;
  const gain = scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0;
  const best = Math.max(...scores, 0);
  const points = buildPolyline(scores);

  const competencyAverages = useMemo(() => {
    const groups = Array.from({ length: 5 }, () => []);
    essays.forEach((essay) => {
      (essay.competencias || []).forEach((item, index) => {
        const score = Number(item.score ?? item.nota ?? 0);
        if (groups[index]) groups[index].push(score);
      });
    });
    return groups.map((group, index) => ({
      code: `C${index + 1}`,
      value: group.length ? Math.round(group.reduce((sum, item) => sum + item, 0) / group.length) : 0,
    }));
  }, [essays]);

  return (
    <main className="page performance-page">
      <div className="container performance-heading">
        <span className="eyebrow">Desempenho e evolução</span>
        <h1 className="page-heading">Mais importante que a nota é a direção.</h1>
        <p className="page-copy">Observe a tendência das suas correções e escolha uma competência para focar no próximo treino.</p>
      </div>

      <div className="container performance-kpis">
        <article><span>Média geral</span><strong>{average}</strong><small>/1000</small></article>
        <article><span>Evolução</span><strong>{gain >= 0 ? '+' : ''}{gain}</strong><small>pontos desde o início</small></article>
        <article><span>Melhor resultado</span><strong>{best}</strong><small>recorde pessoal</small></article>
        <article><span>Treinos</span><strong>{essays.length}</strong><small>redações corrigidas</small></article>
      </div>

      <div className="container performance-grid">
        <section className="performance-chart surface">
          <div className="performance-section-title">
            <div>
              <span className="badge">Linha do tempo</span>
              <h2>Notas por redação</h2>
            </div>
            <span className="performance-trend">↗ tendência de evolução</span>
          </div>

          <div className="score-chart">
            <div className="score-chart__labels"><span>1000</span><span>750</span><span>500</span></div>
            <svg viewBox="0 0 700 220" preserveAspectRatio="none" role="img" aria-label="Gráfico de evolução das notas">
              <line x1="0" y1="0" x2="700" y2="0" />
              <line x1="0" y1="110" x2="700" y2="110" />
              <line x1="0" y1="220" x2="700" y2="220" />
              <polyline points={points} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="score-chart__footer">
              {essays.map((essay, index) => <span key={essay.id || index}>#{index + 1}</span>)}
            </div>
          </div>
        </section>

        <section className="competency-average surface">
          <div className="performance-section-title">
            <div>
              <span className="badge">Média por competência</span>
              <h2>Onde você está mais forte</h2>
            </div>
          </div>
          <div className="competency-average__list">
            {competencyAverages.map((item) => (
              <div className="competency-average__item" key={item.code}>
                <div><strong>{item.code}</strong><span>{item.value}/200</span></div>
                <div className="competency-average__track"><i style={{ width: `${(item.value / 200) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="performance-tip">
            <span>Próximo foco sugerido</span>
            <strong>C3 — Argumentação</strong>
            <p>Experimente sustentar cada argumento com um exemplo específico e explique por que ele comprova sua tese.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
