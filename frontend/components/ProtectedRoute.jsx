import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { status, isAuthenticated, error, refresh } = useAuth();

  if (status === 'loading') {
    return (
      <main className="page">
        <div className="container route-loading" role="status" aria-live="polite">
          <span className="route-loading__dot" />
          <p>Verificando acesso...</p>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="page">
        <div className="container error-state surface">
          <span className="eyebrow">Conexao com o servidor</span>
          <h1>Nao foi possivel validar seu acesso.</h1>
          <p>{error}</p>
          <button className="button button--primary" type="button" onClick={refresh}>Tentar novamente</button>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  return children;
}
