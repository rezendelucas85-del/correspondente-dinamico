import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Settings, Star, Camera } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function PerfilPage() {
  const { user, isLoggedIn, updateUser } = useAuth()
  const navigate = useNavigate()
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nome: user?.nome ?? '',
    oab: user?.oab ?? '',
    areas: user?.areas.join(', ') ?? '',
    cidade: user?.cidade ?? '',
    estado: user?.estado ?? '',
    regioes: user?.regioes.join(', ') ?? '',
    pix: user?.pixChave ?? '',
  })

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Voce precisa estar logado para ver seu perfil.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Voltar</button>
      </div>
    )
  }

  if (!user) return null

  const initials = user.nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  const saveEdit = () => {
    updateUser({
      nome: form.nome,
      oab: form.oab,
      areas: form.areas.split(',').map((a) => a.trim()) as typeof user.areas,
      cidade: form.cidade,
      estado: form.estado,
      regioes: form.regioes.split(',').map((r) => r.trim()),
      pixChave: form.pix,
    })
    setEditando(false)
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Meu <span className="text-[#8b1a1a]">Perfil</span>
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="col-span-1 space-y-4">
          {/* Avatar card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-24 bg-[#8b1a1a]" />
            <div className="px-4 pb-4 -mt-8">
              <div className="relative inline-block">
                <div className="w-16 h-16 bg-red-100 border-4 border-white rounded-full flex items-center justify-center">
                  <span className="text-[#8b1a1a] font-bold text-lg">{initials}</span>
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-sm">Foto: profissional, rosto visivel, sem decotes ou imagens inadequadas</p>
              <h2 className="font-bold text-gray-900 mt-3">{user.nome}</h2>
              <p className="text-xs text-gray-500">{user.oab}</p>

              <div className="mt-4 space-y-2 text-sm">
                {[
                  { label: 'Tipo', value: user.tipoExecutor.includes('Preposto') ? 'Advogada / Preposto' : user.tipoExecutor },
                  { label: 'Demandas', value: user.totalDemandas.toString() },
                  { label: 'Avaliacao', value: `${user.avaliacao.toFixed(1)} ★` },
                  { label: 'Conclusao', value: `${user.taxaConclusao}%` },
                  { label: 'Desde', value: user.desde },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-[#8b1a1a] font-medium text-xs">{item.label}</span>
                    <span className="text-gray-700 font-semibold text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5">
              🎁 Programa de Indicacoes
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Indique novos cadastros e ganhe ate 30% de desconto na mensalidade (3% por indicado ativo, maximo 10 indicados).
            </p>
            <div className="text-xs text-gray-500 mb-1 font-medium">Seu codigo de indicacao</div>
            <div className="bg-white border border-amber-300 rounded-lg px-3 py-2 font-mono font-bold text-[#8b1a1a] tracking-widest text-center text-lg">
              {user.codigoIndicacao}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{user.indicadosAtivos}</div>
                <div className="text-[10px] text-gray-500 uppercase">Indicados ativos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{user.desconto}%</div>
                <div className="text-[10px] text-gray-500 uppercase">Seu desconto</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#8b1a1a]">R$ {user.mensalidade.toFixed(0)}</div>
                <div className="text-[10px] text-gray-500 uppercase">Mensalidade</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>Progresso: {user.desconto}% de 30% maximo</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#8b1a1a] h-1.5 rounded-full"
                  style={{ width: `${(user.desconto / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="col-span-2 space-y-4">
          {/* Professional data */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Dados Profissionais</h3>
              <button
                onClick={() => setEditando(!editando)}
                className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {editando ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {editando ? (
              <div className="space-y-3">
                {[
                  { label: 'Nome Completo', key: 'nome', placeholder: 'Seu nome' },
                  { label: 'Inscricao OAB', key: 'oab', placeholder: 'OAB/UF 000.000' },
                  { label: 'Areas de Atuacao', key: 'areas', placeholder: 'Trabalhista, Civel...' },
                  { label: 'Cidade', key: 'cidade', placeholder: 'Cidade' },
                  { label: 'Estado', key: 'estado', placeholder: 'UF' },
                  { label: 'Regioes / Comarcas', key: 'regioes', placeholder: 'BH, Contagem...' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {f.label}
                    </label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="input-field"
                    />
                  </div>
                ))}
                <button onClick={saveEdit} className="btn-primary text-sm py-2">
                  Salvar alteracoes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Nome Completo', value: user.nome },
                  { label: 'Inscricao OAB', value: user.oab ?? '—' },
                  { label: 'Areas de Atuacao', value: user.areas.join(', ') || '—' },
                  { label: 'Cidade / Sede', value: user.cidade ? `${user.cidade}, ${user.estado}` : '—' },
                  { label: 'Regioes / Comarcas que Atua', value: user.regioes.join(', ') || '—' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {item.label}
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment account */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Conta para Recebimento</h3>
              <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                <Settings className="w-3.5 h-3.5" />
                Configurar
              </button>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center gap-2 mb-3">
              <span className="text-sm">📅</span>
              <span className="text-sm text-green-700">
                Repasses toda segunda-feira · Proximo:{' '}
                <strong>segunda-feira, 11/05</strong>
              </span>
            </div>
            {user.pixChave ? (
              <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-500">Chave PIX: </span>
                <span className="font-medium text-gray-800">{user.pixChave}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Configure sua chave PIX ou dados bancarios para receber os repasses semanais da plataforma.
              </p>
            )}
            {editando && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Chave PIX</label>
                <input
                  value={form.pix}
                  onChange={(e) => set('pix', e.target.value)}
                  placeholder="CPF, email, telefone ou chave aleatoria"
                  className="input-field"
                />
              </div>
            )}
          </div>

          {/* Plan */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Plano de Assinatura</h3>
            {user.planoAtivo ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <p className="text-sm text-green-700 font-semibold">Plano ativo — R$ {user.mensalidade.toFixed(0)}/mes</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-center gap-2">
                <span className="text-sm">🔒</span>
                <span className="text-sm text-[#8b1a1a] font-medium">Sem assinatura ativa</span>
              </div>
            )}
            {!user.planoAtivo && (
              <button className="mt-3 btn-primary text-sm py-2 w-full">
                Assinar Plano — R$ {user.mensalidade}/mes
              </button>
            )}
          </div>

          {/* Stars */}
          {user.avaliacao > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Avaliacao</h3>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.floor(user.avaliacao) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900">{user.avaliacao.toFixed(1)}</span>
                <span className="text-sm text-gray-500">baseado em avaliacoes sigilosas dos contratantes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
