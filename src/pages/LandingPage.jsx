import { Link } from 'react-router-dom';
import { competences } from '../data/mockData';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <main className="page landing-page">
      <section className="landing-hero">
        <div className="container landing-hero__grid">
          <div className="landing-hero__copy">
            <span className="eyebrow">Redação com direção</span>
            <h1>
              Escreva.
              <span>Entenda.</span>
              Evolua.
            </h1>
            <p>
              O Redaê! ajuda estudantes a praticarem redações, receberem feedbacks claros e acompanharem a evolução por competências do ENEM.
            </p>

            <div className="landing-hero__actions">
              <Link className="button button--primary" to="/nova-redacao">
                Escrever uma redação →
              </Link>
              <Link className="button button--quiet" to="/modelos-temas">
                Explorar temas
              </Link>
            </div>

            <div className="landing-hero__quicklinks" aria-label="Acessos rápidos">
              <Link to="/login">Login</Link>
              <Link to="/cadastro">Cadastro</Link>
              <Link to="/nova-redacao">Nova redação</Link>
              <Link to="/modelos-temas">Modelos e temas</Link>
            </div>
          </div>

          <div className="essay-paper" aria-label="Prévia de uma correção de redação">
            <div className="essay-paper__tape">CORREÇÃO EM 5 COMPETÊNCIAS</div>
            <div className="essay-paper__top">
              <span>Redação #08</span>
              <span className="essay-paper__score">880</span>
            </div>
            <p className="essay-paper__theme">Desafios da educação na era da inteligência artificial</p>
            <div className="essay-paper__lines" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="essay-paper__notes">
              <span>✓ tese clara</span>
              <span>↗ aprofundar repertório</span>
            </div>
            <div className="essay-paper__scores">
              {['C1 180', 'C2 180', 'C3 160', 'C4 180', 'C5 180'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="competence-section" id="competencias">
        <div className="container">
          <div className="section-split-heading">
            <div>
              <span className="eyebrow">Como sua redação é lida</span>
              <h2>As 5 competências, sem linguagem complicada.</h2>
            </div>
            <p>
              Você não recebe só uma nota. O resultado mostra onde seu texto já está forte e qual habilidade merece atenção na próxima tentativa.
            </p>
          </div>

          <div className="competence-grid">
            {competences.map((item, index) => (
              <article className="competence-card" key={item.code}>
                <span className="competence-card__number">0{index + 1}</span>
                <div>
                  <span className="badge">{item.code}</span>
                  <h3>{item.title}</h3>
                  <p>{item.short}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container how-section__grid">
          <div className="how-section__title">
            <span className="eyebrow">Rápido de usar</span>
            <h2>Seu ciclo de treino em três movimentos.</h2>
          </div>
          <ol className="how-list">
            <li>
              <span>01</span>
              <div>
                <strong>Escolha um tema</strong>
                <p>Use um tema sugerido ou escreva sobre uma proposta própria.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Envie sua redação</strong>
                <p>Digite o texto em um editor simples, com contagem de palavras e salvamento local.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Leia o feedback</strong>
                <p>Veja a nota, as competências, pontos fortes e sugestões para a próxima redação.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="landing-cta">
        <div className="container landing-cta__card">
          <div>
            <span className="landing-cta__mini">Redaê!</span>
            <h2>Uma redação melhor começa com a próxima tentativa.</h2>
          </div>
          <div className="landing-cta__actions">
            <Link className="button button--primary" to="/cadastro">Criar conta</Link>
            <Link className="button button--quiet" to="/login">Já tenho conta</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
