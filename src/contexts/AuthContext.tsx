import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, Demanda, Proposta } from '../types'
import * as api from '../services/api'
import { mockUsers, mockDemandas } from '../data/mock'

const USE_API = true // muda para false para usar dados mock sem o servidor

interface AuthContextType {
  user: User | null
  demandas: Demanda[]
  isLoggedIn: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Partial<User> & { senha: string }) => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  publishDemanda: (demanda: Omit<Demanda, 'id' | 'propostas' | 'createdAt' | 'contratanteId' | 'contratanteNome'>) => Promise<void>
  candidatar: (demandaId: string, mensagem: string) => Promise<void>
  confirmarProposta: (demandaId: string, propostaId: string) => Promise<void>
  concluirDemanda: (demandaId: string) => Promise<void>
  cancelarDemanda: (demandaId: string) => Promise<void>
  showCadastro: boolean
  setShowCadastro: (v: boolean) => void
  showLogin: boolean
  setShowLogin: (v: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [demandas, setDemandas] = useState<Demanda[]>([])
  const [loading, setLoading] = useState(true)
  const [showCadastro, setShowCadastro] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  // Carrega demandas ao iniciar
  useEffect(() => {
    const load = async () => {
      try {
        if (USE_API) {
          const data = await api.getDemandas()
          setDemandas(data)
        } else {
          setDemandas(mockDemandas)
        }
      } catch {
        // Servidor offline — usa mock como fallback
        setDemandas(mockDemandas)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      if (USE_API) {
        const found = await api.getUserByEmail(email)
        if (found) { setUser(found); return true }
      } else {
        const found = mockUsers.find((u) => u.email === email)
        if (found) { setUser(found); return true }
      }
    } catch { /* servidor offline, usa demo */ }

    // Demo: qualquer email/senha funciona
    const demoUser: User = {
      id: `demo-${Date.now()}`,
      nome: email.split('@')[0],
      email,
      cpf: '',
      tipoExecutor: 'Advogado(a) — OAB ativa',
      oab: 'OAB/MG 000.000',
      celular: '',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      regioes: [],
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
    setUser(demoUser)
    return true
  }

  const logout = () => setUser(null)

  const register = async (userData: Partial<User> & { senha: string }) => {
    const regioes = typeof userData.regioes === 'string'
      ? (userData.regioes as unknown as string).split(',').map((r: string) => r.trim()).filter(Boolean)
      : (userData.regioes ?? [])

    const newUser = {
      nome: userData.nome ?? '',
      email: userData.email ?? '',
      senha: userData.senha,
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
      regioes,
      areas: [] as User['areas'],
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
      badges: [] as string[],
    }

    try {
      if (USE_API) {
        const created = await api.createUser(newUser)
        setUser(created)
      } else {
        setUser({ ...newUser, id: `user-${Date.now()}` })
      }
    } catch {
      setUser({ ...newUser, id: `user-${Date.now()}` })
    }
  }

  const updateUser = async (data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    try {
      if (USE_API) await api.updateUser(user.id, data)
    } catch { /* silencioso */ }
  }

  const publishDemanda = async (demanda: Omit<Demanda, 'id' | 'propostas' | 'createdAt' | 'contratanteId' | 'contratanteNome'>) => {
    if (!user) return
    const payload = { ...demanda, contratanteId: user.id, contratanteNome: user.nome, executorId: null }
    try {
      if (USE_API) {
        const nova = await api.createDemanda(payload)
        setDemandas((prev) => [nova, ...prev])
      } else {
        const nova: Demanda = { ...payload, id: `d${Date.now()}`, propostas: [], createdAt: new Date().toISOString() }
        setDemandas((prev) => [nova, ...prev])
      }
    } catch {
      const nova: Demanda = { ...payload, id: `d${Date.now()}`, propostas: [], createdAt: new Date().toISOString() }
      setDemandas((prev) => [nova, ...prev])
    }
  }

  const candidatar = async (demandaId: string, mensagem: string) => {
    if (!user) return
    const proposta: Omit<Proposta, 'id'> & { demandaId: string } = {
      demandaId,
      executorId: user.id,
      executorNome: user.nome,
      executorOab: user.oab,
      executorAvaliacao: user.avaliacao,
      mensagem,
      createdAt: new Date().toISOString(),
    }
    try {
      if (USE_API) {
        const criada = await api.createProposta(proposta)
        setDemandas((prev) =>
          prev.map((d) => d.id === demandaId ? { ...d, propostas: [...d.propostas, criada] } : d)
        )
      } else {
        const criada: Proposta = { ...proposta, id: `p${Date.now()}` }
        setDemandas((prev) =>
          prev.map((d) => d.id === demandaId ? { ...d, propostas: [...d.propostas, criada] } : d)
        )
      }
    } catch {
      const criada: Proposta = { ...proposta, id: `p${Date.now()}` }
      setDemandas((prev) =>
        prev.map((d) => d.id === demandaId ? { ...d, propostas: [...d.propostas, criada] } : d)
      )
    }
  }

  const confirmarProposta = async (demandaId: string, propostaId: string) => {
    const demanda = demandas.find((d) => d.id === demandaId)
    const proposta = demanda?.propostas.find((p) => p.id === propostaId)
    try {
      if (USE_API) await api.updateDemanda(demandaId, { status: 'confirmada', executorId: proposta?.executorId })
    } catch { /* silencioso */ }
    setDemandas((prev) =>
      prev.map((d) => d.id === demandaId ? { ...d, status: 'confirmada', executorId: proposta?.executorId } : d)
    )
  }

  const concluirDemanda = async (demandaId: string) => {
    try {
      if (USE_API) await api.updateDemanda(demandaId, { status: 'concluida' })
    } catch { /* silencioso */ }
    setDemandas((prev) => prev.map((d) => d.id === demandaId ? { ...d, status: 'concluida' } : d))
  }

  const cancelarDemanda = async (demandaId: string) => {
    try {
      if (USE_API) await api.updateDemanda(demandaId, { status: 'cancelada' })
    } catch { /* silencioso */ }
    setDemandas((prev) => prev.map((d) => d.id === demandaId ? { ...d, status: 'cancelada' } : d))
  }

  return (
    <AuthContext.Provider value={{
      user, demandas, isLoggedIn: !!user, loading,
      login, logout, register, updateUser,
      publishDemanda, candidatar, confirmarProposta, concluirDemanda, cancelarDemanda,
      showCadastro, setShowCadastro, showLogin, setShowLogin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
