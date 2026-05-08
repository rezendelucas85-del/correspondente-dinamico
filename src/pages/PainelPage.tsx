import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Coins } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { StatusDemanda } from '../types'

const TAB_OPTIONS: { key: StatusDemanda | 'todas'; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'confirmada', label: 'Confirmadas' },
  { key: 'em_andamento', label: 'Em andamento' },
  { key: 'concluida', label: 'Concluidas' },
  { key: 'cancelada', label: 'Canceladas' },
]

export default function PainelPage() {
  const { user, demandas, isLoggedIn, concluirDemanda, cancelarDemanda } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<StatusDemanda | 'todas'>('todas')
  const [busca, setBusca] = useState('')
  const [areaFilter, setAreaFilter] = useState('')
  const [showSaque, setShowSaque] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Voce precisa estar logado para ver o painel.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Voltar</button>
      </div>
    )
  }

  const minhasDemandas = demandas.filter((d) => {
    const isExecutor = d.executorId === user?.id
    const isContratante = d.contratanteId === user?.id
    return isExecutor || isContratante
  })

  const filtered = minhasDemandas.filter((d) => {
    if (tab !== 'todas' && d.status !== tab) return false
    if (busca && !d.tipo.toLowerCase().includes(busca.toLowerCase()) && !d.comarca.toLowerCase().includes(busca.toLowerCase())) return false
    if (areaFilter && d.area !== areaFilter) return false
    return true
  })

  const confirmadas = minhasDemandas.filter((d) => d.status === 'confirmada').length
  const concluidas = minhasDemandas.filter((d) => d.status === 'concluida').length
  const total = minhasDemandas.length
  const aReceber = filtered.filter((d) => d.status === 'confirmada' || d.status === 'em_andamento').reduce((s, d) => s + d.valor * 0.9, 0)

  const statusLabel: Record<StatusDemanda, string> = {
    ativa: 'ATIVA',
    confirmada: 'CONFIRMADA',
    em_andamento: 'EM ANDAMENTO',
    concluida: 'CONCLUIDA',
    cancelada: 'CANCELADA',
  }

  const statusColor: Record<StatusDemanda, string> = {
    ativa: 'bg-green-100 text-green-700',
    confirmada: 'bg-blue-100 text-blue-700',
    em_andamento: 'bg-yellow-100 text-yellow-700',
    concluida: 'bg-gray-100 text-gray-600',
    cancelada: 'bg-red-100 text-red-600',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Meu <span className="text-[#8b1a1a]">Painel</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSaque(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Coins className="w-4 h-4 text-yellow-500" />
            Sacar
          </button>
          <button
            onClick={() => navigate('/publicar')}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            + Nova
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'TOTAL', value: total, color: 'text-gray-900' },
          { label: 'CONFIRMADAS', value: confirmadas, color: 'text-gray-900' },
          { label: 'CONCLUIDAS', value: concluidas, color: 'text-gray-900' },
          { label: 'A RECEBER (LIQUIDO)', value: `R$ ${aReceber.toFixed(2).replace('.', ',')}`, color: 'text-[#8b1a1a]' },
          { label: 'JA RECEBIDO', value: `R$ ${user?.saldoRecebido.toFixed(2).replace('.', ',') ?? '0,00'}`, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="border border-gray-200 rounded-xl p-4 text-center bg-white">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
        {TAB_OPTIONS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.key
                ? 'border-b-2 border-[#8b1a1a] text-[#8b1a1a]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 items-center">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar..."
            className="border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]"
          />
        </div>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none"
        >
          <option value="">Todas as areas</option>
          <option value="Trabalhista">Trabalhista</option>
          <option value="Civel">Civel</option>
          <option value="Consumidor">Consumidor</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none">
          <option>Todos pagamentos</option>
          <option>A receber</option>
          <option>Recebidos</option>
        </select>
        <span className="ml-auto text-sm text-gray-500">{filtered.length} demandas</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">⚖️</div>
          <p className="text-gray-500 font-medium text-lg">Nenhuma demanda cadastrada</p>
          <p className="text-gray-400 text-sm mt-1">Clique em + Nova para comecar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div key={d.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{d.tipo}</h3>
                    <span className={`badge ${statusColor[d.status]}`}>
                      {statusLabel[d.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{d.vara} &middot; {d.data} as {d.hora}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>{d.comarca}, {d.estado}</span>
                    <span>&middot;</span>
                    <span>{d.area}</span>
                    <span>&middot;</span>
                    <span>{d.propostas.length} proposta{d.propostas.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#8b1a1a]">
                    R$ {d.valor.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-xs text-gray-400">
                    Liquido: R$ {(d.valor * 0.9).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              {(d.status === 'confirmada' || d.status === 'em_andamento') && d.contratanteId === user?.id && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => concluirDemanda(d.id)}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Marcar Concluida
                  </button>
                  <button
                    onClick={() => cancelarDemanda(d.id)}
                    className="btn-outline text-xs py-1.5 px-3"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Saque modal */}
      {showSaque && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Solicitar Saque</h2>
            <p className="text-sm text-gray-600 mb-4">
              Saldo disponivel: <strong className="text-green-600">R$ {user?.saldo.toFixed(2) ?? '0,00'}</strong>
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Os repasses sao realizados toda segunda-feira. Configure sua chave PIX no perfil para receber.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSaque(false)} className="flex-1 btn-outline text-sm py-2">
                Fechar
              </button>
              <button className="flex-1 btn-primary text-sm py-2">
                Solicitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
