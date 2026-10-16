import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { competences, themes } from '../data/mockData';
import '../styles/modelos-temas.css';

const categories = ['Todos', ...new Set(themes.map((item) => item.category))];

export default function ModelosTemasPage() {
  const [category, setCategory] = useState('Todos');
  const filtered = useMemo(
    () => (category === 'Todos' ? themes : themes.filter((item) => item.category === category)),
    [category],
  );

  return (
    <main className="page themes-page">
      <section className="themes-hero">
        <div className="container themes-hero__grid">
          <div>
            <span className="eyebrow">Modelos e temas</span>
            <h1 className="page-heading">Quando falta assunto, comece por uma boa pergunta.</h1>
            <p className="page-copy">
              Escolha um recorte, entenda o que a proposta pede e use a estrutura como ponto de partida — nunca como texto pronto.
            </p>
          </div>
          <div className="themes-hero__prompt">
            <span>pergunta-guia</span>
            <strong>Qual problema existe, por que ele acontece e quem pode agir para mudá-lo?</strong>
          </div>
        </div>
      </section>

      <section className="container themes-content">
        <div className="themes-filter" aria-label="Filtrar temas">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'is-active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="theme-card-grid">
          {filtered.map((theme, index) => (
            <article className="theme-card" key={theme.id}>
              <div className="theme-card__top">
                <span className="theme-card__number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <span className="badge">{theme.category}</span>
                  <span className="theme-card__level">{theme.level}</span>
                </div>
              </div>
              <h2>{theme.title}</h2>
              <p>{theme.summary}</p>
              <div className="theme-card__tags">
                {theme.tags.map((tag) => <span key={tag}>#{tag}</span>)}
              </div>
              <Link
                className="theme-card__action"
                to={`/nova-redacao?tema=${encodeURIComponent(theme.title)}`}
              >
                Usar este tema <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="model-section">
        <div className="container model-section__grid">
          <div className="model-section__intro">
            <span className="eyebrow">Estrutura de apoio</span>
            <h2>Um mapa simples para organizar o texto.</h2>
            <p>
              O modelo abaixo serve para planejar a argumentação. O conteúdo, os exemplos e a autoria continuam sendo seus.
            </p>
          </div>

          <div className="essay-model">
            <div className="essay-model__row">
              <span>01</span>
              <div><strong>Introdução</strong><p>Contextualize o tema, apresente o problema e deixe sua tese clara.</p></div>
            </div>
            <div className="essay-model__row">
              <span>02</span>
              <div><strong>Desenvolvimento 1</strong><p>Explique uma causa ou aspecto do problema e sustente com repertório.</p></div>
            </div>
            <div className="essay-model__row">
              <span>03</span>
              <div><strong>Desenvolvimento 2</strong><p>Amplie a análise com outro argumento e conecte-o à tese.</p></div>
            </div>
            <div className="essay-model__row">
              <span>04</span>
              <div><strong>Conclusão</strong><p>Retome o problema e apresente uma intervenção detalhada e viável.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container competence-guide">
        <div className="competence-guide__heading">
          <span className="eyebrow">Checklist ENEM</span>
          <h2>Antes de entregar, faça cinco perguntas.</h2>
        </div>
        <div className="competence-guide__grid">
          {competences.map((item) => (
            <article key={item.code}>
              <span>{item.code}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
