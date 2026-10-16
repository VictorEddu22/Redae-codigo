import { Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import NovaRedacaoPage from './pages/NovaRedacaoPage';
import FeedbackPage from './pages/FeedbackPage';
import HistoricoPage from './pages/HistoricoPage';
import DesempenhoPage from './pages/DesempenhoPage';
import ModelosTemasPage from './pages/ModelosTemasPage';

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/nova-redacao" element={<NovaRedacaoPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/feedback/:id" element={<FeedbackPage />} />
        <Route path="/historico" element={<HistoricoPage />} />
        <Route path="/desempenho" element={<DesempenhoPage />} />
        <Route path="/modelos-temas" element={<ModelosTemasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
