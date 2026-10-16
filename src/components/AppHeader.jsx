import { NavLink, Link, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../services/session';

const navItems = [
  ['/nova-redacao', 'Nova redação'],
  ['/historico', 'Histórico'],
  ['/desempenho', 'Evolução'],
  ['/modelos-temas', 'Modelos e temas'],
];

export default function AppHeader() {
  const navigate = useNavigate();
  const session = getSession();

  const logout = () => {
    clearSession();
    navigate('/');
    window.dispatchEvent(new Event('redae-session-change'));
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" aria-label="Ir para a página inicial do Redaê!">
          <span className="brand__mark">R.</span>
          <span className="brand__name">Redaê!</span>
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          {navItems.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          {session ? (
            <>
              <span className="session-chip">Olá, {session.nome?.split(' ')[0] || 'estudante'}</span>
              <button className="button button--quiet button--small" type="button" onClick={logout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link className="button button--quiet button--small" to="/login">
                Entrar
              </Link>
              <Link className="button button--primary button--small" to="/cadastro">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
