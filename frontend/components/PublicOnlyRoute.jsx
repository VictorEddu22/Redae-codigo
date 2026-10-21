import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PublicOnlyRoute({ children }) {
  const { status, isAuthenticated } = useAuth();

  if (status === 'loading') return null;
  if (isAuthenticated) return <Navigate to="/nova-redacao" replace />;
  return children;
}
