import { Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import NovaRedacaoPage from './pages/NovaRedacaoPage';
import FeedbackPage from './pages/FeedbackPage';
import HistoricoPage from './pages/HistoricoPage';
import DesempenhoPage from './pages/DesempenhoPage';
import ModelosTemasPage from './pages/ModelosTemasPage';
import ProfilePage from './pages/ProfilePage';

function protectedPage(page) {
  return <ProtectedRoute>{page}</ProtectedRoute>;
}

function publicOnlyPage(page) {
  return <PublicOnlyRoute>{page}</PublicOnlyRoute>;
}

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <Routes>
        <Route path="/login" element={publicOnlyPage(<LoginPage />)} />
        <Route path="/cadastro" element={publicOnlyPage(<CadastroPage />)} />
        <Route path="/" element={publicOnlyPage(<LandingPage />)} />
        <Route path="/nova-redacao" element={protectedPage(<NovaRedacaoPage />)} />
        <Route path="/feedback" element={protectedPage(<Navigate to="/historico" replace />)} />
        <Route path="/feedback/:id" element={protectedPage(<FeedbackPage />)} />
        <Route path="/historico" element={protectedPage(<HistoricoPage />)} />
        <Route path="/desempenho" element={protectedPage(<DesempenhoPage />)} />
        <Route path="/modelos-temas" element={protectedPage(<ModelosTemasPage />)} />
        <Route path="/perfil" element={protectedPage(<ProfilePage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
