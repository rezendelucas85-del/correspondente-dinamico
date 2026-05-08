import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import DemandasPage from './pages/DemandasPage'
import RankingPage from './pages/RankingPage'
import PerfilPage from './pages/PerfilPage'
import PainelPage from './pages/PainelPage'
import PublicarPage from './pages/PublicarPage'
import CadastroModal from './components/CadastroModal'
import LoginModal from './components/LoginModal'

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demandas" element={<DemandasPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/painel" element={<PainelPage />} />
        <Route path="/publicar" element={<PublicarPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CadastroModal />
      <LoginModal />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  )
}
