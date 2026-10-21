import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { competences } from '../data/competences';
import { contentService } from '../services/contentService';
import '../styles/modelos-temas.css';

export default function ModelosTemasPage() {
  const [themes, setThemes] = useState([]);
  const [models, setModels] = useState([]);
  const [learning, setLearning] = useState(null);
  const [category, setCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([contentService.themes(), contentService.models(), contentService.learning()])
      .then(([themeItems, modelItems, learningGuide]) => {
        if (!active) return;
        setThemes(themeItems);
        setModels(modelItems);
        setLearning(learningGuide);
      })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ['Todos', ...new Set(themes.map((item) => item.category))], [themes]);
  const filtered = useMemo(() => category === 'Todos' ? themes : themes.filter((item) => item.category === category), [category, themes]);
  const primaryModel = models[0];

  return (
    <main className="page themes-page">
      <section className="themes-hero">
        <div className="container themes-hero__grid">
          <div>
            <span className="eyebrow">Modelos e temas</span>
            <h1 className="page-heading">Quando falta assunto, comece por uma boa pergunta.</h1>
            <p className="page-copy">Escolha um recorte, entenda o que a proposta pede e use a estrutura como ponto de partida - nunca como texto pronto.</p>
          </div>
          <div className="themes-hero__prompt">
            <span>pergunta-guia</span>
            <strong>Qual problema existe, por que ele acontece e quem pode agir para muda-lo?</strong>
          </div>
        </div>
      </section>

      <section className="container themes-content">
        {loading ? <p className="muted">Carregando biblioteca...</p> : null}
        {error ? <p className="form-message form-message--error">{error}</p> : null}
        {!loading && !error ? (
          <>
            <div className="themes-filter" aria-label="Filtrar temas">
              {categories.map((item) => (
                <button key={item} type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>

            <div className="theme-card-grid">
              {filtered.map((theme, index) => (
                <article className="theme-card" key={theme.id}>
                  <div className="theme-card__top">
                    <span className="theme-card__number">{String(index + 1).padStart(2, '0')}</span>
                    <div><span className="badge">{theme.category}</span><span className="theme-card__level">{theme.level}</span></div>
                  </div>
                  <h2>{theme.title}</h2>
                  <p>{theme.summary}</p>
                  <div className="theme-card__tags">{(theme.tags || []).map((tag) => <span key={tag}>#{tag}</span>)}</div>
                  <Link className="theme-card__action" to={`/nova-redacao?tema=${encodeURIComponent(theme.title)}`}>Usar este tema <span>&rarr;</span></Link>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="model-section">
        <div className="container model-section__grid">
          <div className="model-section__intro">
            <span className="eyebrow">Estrutura de apoio</span>
            <h2>Um mapa simples para organizar o texto.</h2>
            <p>{primaryModel?.warning || 'Use modelos como estrutura de planejamento. O conteudo e a autoria continuam sendo seus.'}</p>
          </div>

          <div className="essay-model">
            {(primaryModel?.sections || []).map((section, index) => (
              <div className="essay-model__row" key={section.name}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{section.name}</strong><p>{section.objective}</p></div>
              </div>
            ))}
            {!primaryModel ? (
              <>
                <div className="essay-model__row"><span>01</span><div><strong>Introducao</strong><p>Contextualize o tema, apresente o problema e deixe sua tese clara.</p></div></div>
                <div className="essay-model__row"><span>02</span><div><strong>Desenvolvimento 1</strong><p>Explique o primeiro eixo e sustente com repertorio pertinente.</p></div></div>
                <div className="essay-model__row"><span>03</span><div><strong>Desenvolvimento 2</strong><p>Amplie a analise com outro argumento conectado a tese.</p></div></div>
                <div className="essay-model__row"><span>04</span><div><strong>Conclusao</strong><p>Retome o problema e apresente uma intervencao detalhada e viavel.</p></div></div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container competence-guide">
        <div className="competence-guide__heading">
          <span className="eyebrow">Checklist ENEM</span>
          <h2>Antes de entregar, faca cinco perguntas.</h2>
        </div>
        <div className="competence-guide__grid">
          {competences.map((item) => (
            <article key={item.code}><span>{item.code}</span><strong>{item.title}</strong><p>{item.description}</p></article>
          ))}
        </div>
      </section>
      {models.length > 1 ? (
        <section className="container model-library">
          <div className="competence-guide__heading">
            <span className="eyebrow">Outros modelos de planejamento</span>
            <h2>Use a estrutura para pensar, n&atilde;o para decorar.</h2>
          </div>
          <div className="model-library__grid">
            {models.slice(1).map((model) => (
              <article className="surface model-library__card" key={model.id}>
                <span className="badge">Guia pr&aacute;tico</span>
                <h3>{model.title}</h3>
                <p>{model.warning}</p>
                <ol>
                  {(model.sections || []).map((section) => (
                    <li key={section.name}><strong>{section.name}</strong><span>{section.objective}</span><small>{section.template}</small></li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {learning ? (
        <section className="container learning-guide surface">
          <div>
            <span className="eyebrow">Como usar o Reda&ecirc;!</span>
            <h2>{learning.title}</h2>
          </div>
          <div className="learning-guide__columns">
            <div><strong>Princ&iacute;pios</strong><ul>{(learning.principles || []).map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><strong>Checklist antes de enviar</strong><ul>{(learning.checklist || []).map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </section>
      ) : null}

    </main>
  );
}
