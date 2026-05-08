import { Calendar, Lock } from 'lucide-react'
import type { Demanda } from '../types'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  demanda: Demanda
  onCandidatar?: (id: string) => void
  showFullDetails?: boolean
}

export default function DemandCard({ demanda, onCandidatar, showFullDetails = false }: Props) {
  const { isLoggedIn } = useAuth()

  const statusColor: Record<string, string> = {
    ativa: 'bg-green-100 text-green-700',
    confirmada: 'bg-blue-100 text-blue-700',
    em_andamento: 'bg-yellow-100 text-yellow-700',
    concluida: 'bg-gray-100 text-gray-600',
    cancelada: 'bg-red-100 text-red-600',
  }

  const statusLabel: Record<string, string> = {
    ativa: 'ATIVA',
    confirmada: 'CONFIRMADA',
    em_andamento: 'EM ANDAMENTO',
    concluida: 'CONCLUÍDA',
    cancelada: 'CANCELADA',
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm">{demanda.tipo}</h3>
        <span className="text-[#8b1a1a] font-bold text-sm whitespace-nowrap ml-2">
          R$ {demanda.valor.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>{demanda.data} às {demanda.hora}</span>
      </div>

      {isLoggedIn || showFullDetails ? (
        <>
          <div className="text-xs text-gray-600 mb-1 font-medium">{demanda.vara}</div>
          <div className="text-xs text-gray-500 mb-3">{demanda.comarca}, {demanda.estado}</div>
        </>
      ) : (
        <div className="mb-3">
          <div className="h-3 bg-gray-200 rounded blur-sm w-32 mb-1" />
          <div className="h-3 bg-gray-200 rounded blur-sm w-24" />
        </div>
      )}

      {isLoggedIn ? (
        <button
          onClick={() => onCandidatar?.(demanda.id)}
          className="w-full btn-primary text-xs py-2 mt-1"
        >
          Candidatar-se
        </button>
      ) : (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-1">
          <p className="text-xs text-[#8b1a1a] font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Faca cadastro para ver todos os detalhes e candidatar-se
          </p>
        </div>
      )}
    </div>
  )
}
