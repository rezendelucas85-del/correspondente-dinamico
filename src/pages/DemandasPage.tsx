import { useState } from 'react'
import { Lock, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import DemandCard from '../components/DemandCard'
import { comarcas, areas, faixasValor } from '../data/mock'
import type { Demanda } from '../types'

export default function DemandasPage() {
  const { demandas, isLoggedIn, candidatar, setShowCadastro } = useAuth()
  const [comarca, setComarca] = useState('')
  const [area, setArea] = useState('')
  const [perfil, setPerfil] = useState('')
  const [faixaIdx, setFaixaIdx] = useState(0)
  const [candidatandoId, setCandidatandoId] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [successId, setSuccessId] = useState<string | null>(null)

  const faixa = faixasValor[faixaIdx]

  const filtered = demandas.filter((d) => {
    if (d.status !== 'ativa') return false
    if (comarca && d.comarca !== comarca) return false
    if (area && d.area !== area) return false
    if (perfil) {
      const pLower = perfil.toLowerCase()
      if (!d.perfilRequerido.toLowerCase().includes(pLower)) return false
    }
    if (d.valor < faixa.min || d.valor > faixa.max) return false
    return true
  })

  const handleCandidatar = (id: string) => {
    if (!isLoggedIn) { setShowCadastro(true); return }
    setCandidatandoId(id)
  }

  const submitProposta = () => {
    if (!candidatandoId) return
    candidatar(candidatandoId, mensagem || 'Tenho disponibilidade para atender a demanda.')
    setSuccessId(candidatandoId)
    setCandidatandoId(null)
    setMensagem('')
    setTimeout(() => setSuccessId(null), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Demandas <span className="text-[#8b1a1a]">Disponiveis</span>
      </h1>

      {!isLoggedIn && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            <button onClick={() => setShowCadastro(true)} className="font-semibold underline">
              Crie sua conta
            </button>{' '}
            para se candidatar. Visitantes veem apenas tipo, data, hora e valor.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          value={comarca}
          onChange={(e) => setComarca(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]"
        >
          <option value="">Todas as comarcas</option>
          {comarcas.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]"
        >
          <option value="">Todas as areas</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]"
        >
          <option value="">Todos os perfis</option>
          <option value="advogado">Advogado(a)</option>
          <option value="preposto">Preposto</option>
        </select>

        <select
          value={faixaIdx}
          onChange={(e) => setFaixaIdx(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]"
        >
          {faixasValor.map((f, i) => <option key={f.label} value={i}>{f.label}</option>)}
        </select>

        <span className="ml-auto text-sm text-gray-500 font-medium">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {successId && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 text-green-700 text-sm font-medium">
          Proposta enviada com sucesso! O contratante sera notificado.
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Nenhuma demanda encontrada com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DemandCardWithStatus
              key={d.id}
              demanda={d}
              onCandidatar={handleCandidatar}
              isLoggedIn={isLoggedIn}
              isSuccess={successId === d.id}
            />
          ))}
        </div>
      )}

      {/* Candidatar Modal */}
      {candidatandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Enviar Proposta</h2>
              <button onClick={() => setCandidatandoId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Adicione uma mensagem para o contratante (opcional):
            </p>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={4}
              placeholder="Ex: Tenho disponibilidade e experiencia em audiencias trabalhistas..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCandidatandoId(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitProposta}
                className="flex-1 btn-primary text-sm py-2.5"
              >
                Enviar Proposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DemandCardWithStatus({
  demanda,
  onCandidatar,
  isLoggedIn,
  isSuccess,
}: {
  demanda: Demanda
  onCandidatar: (id: string) => void
  isLoggedIn: boolean
  isSuccess: boolean
}) {
  return (
    <div className={`relative ${isSuccess ? 'ring-2 ring-green-400 rounded-xl' : ''}`}>
      <DemandCard demanda={demanda} onCandidatar={onCandidatar} />
    </div>
  )
}
