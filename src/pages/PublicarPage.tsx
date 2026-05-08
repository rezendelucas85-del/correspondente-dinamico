import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { TipoDemanda, AreaAtuacao } from '../types'

const TIPOS: TipoDemanda[] = [
  'Audiência Inaugural',
  'AIJ — Instrução e Julgamento',
  'Tentativa de Conciliação',
  'Preposto',
  'Sustentação Oral',
  'Diligência',
  'Protocolo',
]

const AREAS: AreaAtuacao[] = [
  'Trabalhista',
  'Cível',
  'Consumidor',
  'Família',
  'Criminal',
  'Tributário',
  'Previdenciário',
]

export default function PublicarPage() {
  const { user, demandas, isLoggedIn, publishDemanda, cancelarDemanda } = useAuth()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    tipo: 'Audiência Inaugural' as TipoDemanda,
    area: 'Trabalhista' as AreaAtuacao,
    valor: '',
    data: '',
    hora: '',
    vara: '',
    comarca: '',
    estado: '',
    perfil: 'ADVOGADO(A)' as 'ADVOGADO(A)' | 'PREPOSTO' | 'ADVOGADO(A) / PREPOSTO',
    descricao: '',
  })

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Voce precisa estar logado para publicar demandas.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Voltar</button>
      </div>
    )
  }

  const minhasDemandas = demandas.filter((d) => d.contratanteId === user?.id)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handlePublish = () => {
    if (!form.tipo || !form.valor || !form.data || !form.hora) return
    publishDemanda({
      tipo: form.tipo,
      area: form.area,
      valor: parseFloat(form.valor),
      data: form.data,
      hora: form.hora,
      vara: form.vara,
      comarca: form.comarca,
      estado: form.estado,
      perfilRequerido: form.perfil,
      descricao: form.descricao,
      status: 'ativa',
    })
    setShowForm(false)
    setForm({
      tipo: 'Audiência Inaugural' as TipoDemanda,
      area: 'Trabalhista' as AreaAtuacao,
      valor: '',
      data: '',
      hora: '',
      vara: '',
      comarca: '',
      estado: '',
      perfil: 'ADVOGADO(A)',
      descricao: '',
    })
  }

  const statusColor: Record<string, string> = {
    ativa: 'bg-green-100 text-green-700',
    confirmada: 'bg-blue-100 text-blue-700',
    em_andamento: 'bg-yellow-100 text-yellow-700',
    concluida: 'bg-gray-100 text-gray-600',
    cancelada: 'bg-red-100 text-red-600',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Publicar <span className="text-[#8b1a1a]">Demanda</span>
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Demanda
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6">
        <p className="text-sm text-blue-700">
          i A taxa de 10% e retida pela plataforma como garantia ao executor em caso de inadimplencia do contratante.
        </p>
      </div>

      {minhasDemandas.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-500">Voce nao publicou nenhuma demanda ainda.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">
            Publicar primeira demanda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {minhasDemandas.map((d) => (
            <div key={d.id} className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">{d.tipo}</h3>
                <span className={`badge ${statusColor[d.status]}`}>
                  {d.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <div className="flex items-center gap-1">
                  <span>⚖️</span> {d.vara}
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span> {d.data} as {d.hora}
                </div>
                <div>
                  <span className={`badge bg-red-100 text-[#8b1a1a]`}>{d.perfilRequerido}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span>{d.propostas.length} proposta{d.propostas.length !== 1 ? 's' : ''}</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    Ver Propostas
                  </button>
                  {d.status === 'ativa' && (
                    <button
                      onClick={() => cancelarDemanda(d.id)}
                      className="flex items-center gap-1 text-[#8b1a1a] border border-[#8b1a1a] rounded-lg px-3 py-1.5 font-medium hover:bg-red-50"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Nova Demanda</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Tipo de Demanda *</label>
                    <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)} className="input-field">
                      {TIPOS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Area</label>
                    <select value={form.area} onChange={(e) => set('area', e.target.value)} className="input-field">
                      {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Valor (R$) *</label>
                    <input type="number" value={form.valor} onChange={(e) => set('valor', e.target.value)} placeholder="150.00" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Data *</label>
                    <input type="date" value={form.data} onChange={(e) => set('data', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Hora *</label>
                    <input type="time" value={form.hora} onChange={(e) => set('hora', e.target.value)} className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Vara / Orgao</label>
                    <input value={form.vara} onChange={(e) => set('vara', e.target.value)} placeholder="Ex: 36º VT de BH" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Comarca</label>
                    <input value={form.comarca} onChange={(e) => set('comarca', e.target.value)} placeholder="Belo Horizonte" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Estado</label>
                    <input value={form.estado} onChange={(e) => set('estado', e.target.value)} placeholder="MG" className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Perfil Requerido</label>
                    <select value={form.perfil} onChange={(e) => set('perfil', e.target.value)} className="input-field">
                      <option value="ADVOGADO(A)">Advogado(a)</option>
                      <option value="PREPOSTO">Preposto</option>
                      <option value="ADVOGADO(A) / PREPOSTO">Advogado(a) / Preposto</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Descricao</label>
                    <textarea
                      value={form.descricao}
                      onChange={(e) => set('descricao', e.target.value)}
                      rows={3}
                      placeholder="Detalhes adicionais sobre a demanda..."
                      className="input-field resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 btn-outline text-sm py-2.5">
                    Cancelar
                  </button>
                  <button onClick={handlePublish} className="flex-1 btn-primary text-sm py-2.5">
                    Publicar Demanda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
