import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Scale, Trophy, Settings, Lock, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isLoggedIn, user, logout, setShowCadastro, setShowLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        location.pathname === to
          ? 'text-[#8b1a1a] font-semibold'
          : 'text-gray-700 hover:text-[#8b1a1a]'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#8b1a1a]" />
            <span className="font-bold text-gray-900 text-sm">
              Audiências Connect
            </span>
            <span className="text-xs text-gray-400 font-medium">Nacional</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-1">
                  {navLink('/demandas', 'Demandas')}
                  <Lock className="w-3 h-3 text-gray-400 ml-0.5" />
                </div>
                <Link to="/ranking" className="text-gray-600 hover:text-[#8b1a1a]">
                  <Trophy className="w-5 h-5" />
                </Link>
                <Link to="/painel" className={`text-sm font-medium ${location.pathname === '/painel' ? 'text-[#8b1a1a] font-semibold' : 'text-gray-700 hover:text-[#8b1a1a]'}`}>
                  Painel
                </Link>
                <Link to="/publicar" className={`text-sm font-medium ${location.pathname === '/publicar' ? 'text-[#8b1a1a] font-semibold' : 'text-gray-700 hover:text-[#8b1a1a]'}`}>
                  Publicar
                </Link>
                <Link
                  to="/perfil"
                  className={`text-sm font-medium px-3 py-1 rounded-full border relative ${
                    location.pathname === '/perfil'
                      ? 'border-[#8b1a1a] text-[#8b1a1a] bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-[#8b1a1a] hover:text-[#8b1a1a]'
                  }`}
                >
                  Perfil
                  {!user?.planoAtivo && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      1
                    </span>
                  )}
                </Link>
                <button className="text-gray-500 hover:text-gray-700">
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/demandas"
                  className={`text-sm font-medium ${location.pathname === '/demandas' ? 'text-[#8b1a1a] font-semibold' : 'text-gray-700 hover:text-[#8b1a1a]'}`}
                >
                  Demandas
                </Link>
                <Link to="/ranking" className="text-gray-600 hover:text-[#8b1a1a]">
                  <Trophy className="w-5 h-5" />
                </Link>
                <button className="text-gray-500 hover:text-gray-700">
                  <Bell className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-gray-700 hover:text-[#8b1a1a]"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setShowCadastro(true)}
                  className="btn-primary text-sm py-1.5 px-4"
                >
                  Cadastrar
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
