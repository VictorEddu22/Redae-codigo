import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  ['/nova-redacao', 'Nova reda\u00e7\u00e3o'],
  ['/historico', 'Hist\u00f3rico'],
  ['/desempenho', 'Evolu\u00e7\u00e3o'],
  ['/modelos-temas', 'Modelos e temas'],
];

export default function AppHeader() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" aria-label="Ir para a pagina inicial do Redae!">
          <span className="brand__mark">R.</span>
          <span className="brand__name">Reda&ecirc;!</span>
        </Link>

        <nav className="site-nav" aria-label="Navegacao principal">
          {isAuthenticated ? navItems.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `site-nav__link ${isActive ? 'is-active' : ''}`}
            >
              {label}
            </NavLink>
          )) : null}
        </nav>

        <div className="site-header__actions">
          {isAuthenticated ? (
            <>
              <Link className="session-profile" to="/perfil" aria-label="Abrir perfil">
                {user?.fotoUrl ? <img src={user.fotoUrl} alt="" /> : <span>{user?.nome?.[0]?.toUpperCase() || 'R'}</span>}
                <strong>{user?.nome?.split(' ')[0] || 'estudante'}</strong>
              </Link>
              <button className="button button--quiet button--small" type="button" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link className="button button--quiet button--small" to="/login">Entrar</Link>
              <Link className="button button--primary button--small" to="/cadastro">Criar conta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
