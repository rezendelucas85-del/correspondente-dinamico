import { useState } from 'react'
import { X, Scale } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginModal() {
  const { showLogin, setShowLogin, setShowCadastro, login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  if (!showLogin) return null

  const close = () => { setShowLogin(false); setError('') }

  const handleLogin = async () => {
    if (!email || !senha) { setError('Preencha todos os campos.'); return }
    const ok = await login(email, senha)
    if (ok) close()
    else setError('Email ou senha invalidos.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#8b1a1a]" />
            <h2 className="text-xl font-bold text-gray-900">Entrar</h2>
          </div>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="input-field"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              className="input-field"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button onClick={handleLogin} className="btn-primary w-full py-3">
            Entrar
          </button>

          <p className="text-xs text-center text-gray-500">
            Nao tem conta?{' '}
            <button
              onClick={() => { close(); setShowCadastro(true) }}
              className="text-[#8b1a1a] font-medium hover:underline"
            >
              Criar conta gratis
            </button>
          </p>

          <p className="text-xs text-center text-gray-400 mt-2 border-t pt-3">
            Demo: use qualquer email/senha para entrar
          </p>
        </div>
      </div>
    </div>
  )
}
