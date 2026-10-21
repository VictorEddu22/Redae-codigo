import '../styles/auth.css';

export default function AuthLayout({ eyebrow, title, copy, children, footer }) {
  return (
    <main className="page auth-page">
      <div className="auth-layout">
        <section className="auth-visual">
          <span className="auth-visual__back">Redaê! · acesso seguro</span>
          <div className="auth-visual__content">
            <span className="auth-visual__kicker">Redaê!</span>
            <h2>Treinar escrita fica mais simples quando você sabe o que melhorar.</h2>
            <div className="auth-note">
              <span>feedback</span>
              <strong>clareza + prática + evolução</strong>
            </div>
            <div className="auth-score-line">
              <span>700</span><i /><span>820</span><i /><span>880</span>
            </div>
          </div>
        </section>

        <section className="auth-form-side">
          <div className="auth-form-card">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p className="auth-form-card__copy">{copy}</p>
            {children}
            {footer ? <div className="auth-form-card__footer">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
