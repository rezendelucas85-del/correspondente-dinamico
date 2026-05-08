import { useState } from 'react'
import { Trophy, Star } from 'lucide-react'
import { mockRanking } from '../data/mock'
import type { RankingEntry } from '../types'

export default function RankingPage() {
  const [tab, setTab] = useState<'todos' | 'advogados' | 'prepostos'>('todos')

  const filtered = mockRanking.filter((r) => {
    if (tab === 'advogados') return r.user.tipoExecutor.includes('Advogado')
    if (tab === 'prepostos') return r.user.tipoExecutor === 'Preposto'
    return true
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="w-7 h-7 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900">
          Ranking de <span className="text-[#8b1a1a]">Executores</span>
        </h1>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-blue-700">
          Ranking baseado em avaliacoes sigilosas dos contratantes (0–5 estrelas), numero de demandas e taxa de conclusao. Valores nao sao divulgados.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(['todos', 'advogados', 'prepostos'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'border-b-2 border-[#8b1a1a] text-[#8b1a1a]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((entry) => (
          <RankingCard key={entry.user.id} entry={entry} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">Nenhum executor nesta categoria.</p>
        )}
      </div>
    </div>
  )
}

function RankingCard({ entry }: { entry: RankingEntry }) {
  const medalColors: Record<number, string> = {
    1: 'text-yellow-500',
    2: 'text-gray-400',
    3: 'text-amber-600',
  }

  const initials = entry.user.nome
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className={`border rounded-xl p-4 flex items-center gap-4 bg-white hover:shadow-sm transition-shadow ${entry.destaque ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
      <div className={`w-10 text-center font-bold text-lg ${medalColors[entry.posicao] ?? 'text-gray-500'}`}>
        {entry.posicao}º
      </div>

      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-[#8b1a1a] font-bold text-sm">{initials}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm">{entry.user.nome}</span>
          {entry.destaque && (
            <span className="badge bg-[#8b1a1a] text-white flex items-center gap-1">
              <Star className="w-3 h-3" /> Destaque
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {entry.user.tipoExecutor.includes('Advogado') ? 'Advogado' : 'Preposto'} &middot; {entry.user.oab ?? '—'} &middot; {entry.user.cidade}/{entry.user.estado}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(entry.user.avaliacao) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs font-semibold text-gray-700 ml-1">{entry.user.avaliacao.toFixed(1)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{entry.user.totalDemandas} demandas realizadas</p>
        {entry.badges.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {entry.badges.map((b) => (
              <span key={b} className="badge bg-red-100 text-[#8b1a1a] text-[10px]">{b}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
