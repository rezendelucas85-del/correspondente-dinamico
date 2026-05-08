import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, Demanda, Proposta } from '../types'
import { mockUsers, mockDemandas } from '../data/mock'

interface AuthContextType {
  user: User | null
  demandas: Demanda[]
  isLoggedIn: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (userData: Partial<User> & { senha: string }) => void
  updateUser: (data: Partial<User>) => void
  publishDemanda: (demanda: Omit<Demanda, 'id' | 'propostas' | 'createdAt' | 'contratanteId' | 'contratanteNome'>) => void
  candidatar: (demandaId: string, mensagem: string) => void
  confirmarProposta: (demandaId: string, propostaId: string) => void
  concluirDemanda: (demandaId: string) => void
  cancelarDemanda: (demandaId: string) => void
  showCadastro: boolean
  setShowCadastro: (v: boolean) => void
  showLogin: boolean
  setShowLogin: (v: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [demandas, setDemandas] = useState<Demanda[]>(mockDemandas)
  const [showCadastro, setShowCadastro] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const login = (email: string, _password: string) => {
    const found = mockUsers.find((u) => u.email === email)
    if (found) {
      setUser(found)
      return true
    }
    // Demo: any email/password works
    const demoUser: User = {
      id: 'demo',
      nome: 'lucas lima',
      email,
      cpf: '000.000.000-00',
      tipoExecutor: 'Advogado(a) — OAB ativa',
      oab: 'OAB/MG 165.121',
      celular: '(31) 99999-9999',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      regioes: ['Belo Horizonte', 'Contagem', 'Betim'],
      areas: ['Trabalhista', 'Cível', 'Consumidor'],
      avaliacao: 4.9,
      totalDemandas: 47,
      taxaConclusao: 100,
      saldo: 0,
      saldoRecebido: 0,
      planoAtivo: false,
      codigoIndicacao: 'AC7I8639',
      indicadosAtivos: 3,
      desconto: 9,
      mensalidade: 91,
      desde: 'Jan/2025',
      badges: [],
    }
    setUser(demoUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const register = (userData: Partial<User> & { senha: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      nome: userData.nome ?? '',
      email: userData.email ?? '',
      cpf: userData.cpf ?? '',
      rg: userData.rg,
      cnh: userData.cnh,
      tipoExecutor: userData.tipoExecutor ?? 'Advogado(a) — OAB ativa',
      oab: userData.oab,
      cnpj: userData.cnpj,
      telefone: userData.telefone,
      celular: userData.celular ?? '',
      cep: userData.cep,
      estado: userData.estado,
      rua: userData.rua,
      numero: userData.numero,
      bairro: userData.bairro,
      cidade: userData.cidade,
      regioes: userData.regioes ?? [],
      areas: [],
      avaliacao: 0,
      totalDemandas: 0,
      taxaConclusao: 0,
      saldo: 0,
      saldoRecebido: 0,
      planoAtivo: false,
      codigoIndicacao: `AC${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      indicadosAtivos: 0,
      desconto: 0,
      mensalidade: 100,
      desde: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      badges: [],
    }
    setUser(newUser)
  }

  const updateUser = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data })
  }

  const publishDemanda = (demanda: Omit<Demanda, 'id' | 'propostas' | 'createdAt' | 'contratanteId' | 'contratanteNome'>) => {
    if (!user) return
    const nova: Demanda = {
      ...demanda,
      id: `d${Date.now()}`,
      propostas: [],
      createdAt: new Date().toISOString(),
      contratanteId: user.id,
      contratanteNome: user.nome,
    }
    setDemandas((prev) => [nova, ...prev])
  }

  const candidatar = (demandaId: string, mensagem: string) => {
    if (!user) return
    const proposta: Proposta = {
      id: `p${Date.now()}`,
      executorId: user.id,
      executorNome: user.nome,
      executorOab: user.oab,
      executorAvaliacao: user.avaliacao,
      mensagem,
      createdAt: new Date().toISOString(),
    }
    setDemandas((prev) =>
      prev.map((d) =>
        d.id === demandaId ? { ...d, propostas: [...d.propostas, proposta] } : d
      )
    )
  }

  const confirmarProposta = (demandaId: string, propostaId: string) => {
    setDemandas((prev) =>
      prev.map((d) => {
        if (d.id !== demandaId) return d
        const proposta = d.propostas.find((p) => p.id === propostaId)
        return { ...d, status: 'confirmada', executorId: proposta?.executorId }
      })
    )
  }

  const concluirDemanda = (demandaId: string) => {
    setDemandas((prev) =>
      prev.map((d) => (d.id === demandaId ? { ...d, status: 'concluida' } : d))
    )
  }

  const cancelarDemanda = (demandaId: string) => {
    setDemandas((prev) =>
      prev.map((d) => (d.id === demandaId ? { ...d, status: 'cancelada' } : d))
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        demandas,
        isLoggedIn: !!user,
        login,
        logout,
        register,
        updateUser,
        publishDemanda,
        candidatar,
        confirmarProposta,
        concluirDemanda,
        cancelarDemanda,
        showCadastro,
        setShowCadastro,
        showLogin,
        setShowLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
