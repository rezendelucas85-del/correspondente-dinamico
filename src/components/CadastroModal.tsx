import { useState } from 'react'
import { X, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { User } from '../types'

const TERMS = `TERMOS DE USO, NORMAS E ANUENCIA — AUDIENCIAS CONNECT

Versao vigente: Janeiro de 2025 | Aplicavel em todo o territorio nacional

1. NATUREZA DA PLATAFORMA
A plataforma Audiencias Connect atua exclusivamente como intermediaria entre advogados contratantes e executores (advogados correspondentes e prepostos), nao sendo parte das relacoes juridicas ou contratuais estabelecidas entre eles. A plataforma nao presta servicos juridicos, nao representa clientes finais e nao se responsabiliza por danos, prejuizos ou descumprimentos de obrigacoes entre as partes.

2. CADASTRO E HABILITACAO
2.1. O acesso as funcionalidades da plataforma exige cadastro completo, com dados verídicos e atualizados, sob pena de suspensao imediata.
2.2. O executor deve possuir OAB ativa ou habilitacao como preposto, conforme o perfil selecionado no cadastro.

3. TAXAS E PAGAMENTOS
3.1. A plataforma cobra uma taxa de 10% sobre o valor de cada demanda concluida, retida automaticamente antes do repasse ao executor.
3.2. Os repasses sao realizados toda segunda-feira, referentes as demandas concluidas na semana anterior.
3.3. A mensalidade padrao e de R$100,00/mes, com descontos progressivos pelo programa de indicacoes.

4. PROGRAMA DE INDICACOES
4.1. O executor pode indicar novos cadastros e receber 3% de desconto por indicado ativo, ate o limite de 30% (10 indicacoes).
4.2. O desconto e aplicado automaticamente na proxima fatura apos a confirmacao da indicacao.

5. RESPONSABILIDADES DO EXECUTOR
5.1. Comparecer pessoalmente ao ato judicial no horario e local especificados.
5.2. Portar documentos necessarios e apresentacao profissional adequada.
5.3. Relatar o resultado da audiencia atraves da plataforma em ate 24 horas apos o ato.

6. INADIMPLENCIA
6.1. Em caso de inadimplencia do contratante, a plataforma utilizara a taxa retida de 10% como garantia de pagamento parcial ao executor.
6.2. O executor reconhece este instrumento como titulo executivo extrajudicial nos termos do art. 784, III do CPC.`

type Step = 1 | 2 | 3

export default function CadastroModal() {
  const { showCadastro, setShowCadastro, setShowLogin, register } = useAuth()
  const [step, setStep] = useState<Step>(1)
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [form, setForm] = useState<Partial<User> & { senha?: string }>({
    tipoExecutor: 'Advogado(a) — OAB ativa',
    regioes: [],
  })

  if (!showCadastro) return null

  const close = () => {
    setShowCadastro(false)
    setStep(1)
    setAceitouTermos(false)
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleContinue = () => {
    if (step < 3) setStep((s) => (s + 1) as Step)
    else {
      if (!aceitouTermos) return
      register({ ...form, regioes: form.regioes ?? [] })
      close()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cadastro — Executor</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Passo {step} de 3 &middot; Todos os dados sao protegidos pela LGPD
            </p>
          </div>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {step === 1 && <Step1 form={form} set={set} />}
          {step === 2 && <Step2 form={form} set={set} />}
          {step === 3 && (
            <Step3 aceitouTermos={aceitouTermos} setAceitouTermos={setAceitouTermos} />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={step === 1 ? close : () => setStep((s) => (s - 1) as Step)}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? 'Cancelar' : 'Voltar'}
          </button>
          <button
            onClick={handleContinue}
            disabled={step === 3 && !aceitouTermos}
            className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step < 3 ? 'Continuar →' : 'Finalizar Cadastro'}
          </button>
        </div>

        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-500">
            Ja tem conta?{' '}
            <button
              onClick={() => { close(); setShowLogin(true) }}
              className="text-[#8b1a1a] font-medium hover:underline"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function Step1({ form, set }: { form: Partial<User> & { senha?: string }; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-2">
        <Lock className="w-4 h-4 text-blue-500" />
        <p className="text-xs text-blue-700">Seus dados sao acessados exclusivamente pela plataforma, conforme a LGPD.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Nome Completo *</label>
          <input value={form.nome ?? ''} onChange={(e) => set('nome', e.target.value)} placeholder="Nome completo" className="input-field" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">E-mail *</label>
          <input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="seu@email.com" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">CPF *</label>
          <input value={form.cpf ?? ''} onChange={(e) => set('cpf', e.target.value)} placeholder="000.000.000-00" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">RG</label>
          <input value={form.rg ?? ''} onChange={(e) => set('rg', e.target.value)} placeholder="MG-0000000" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">CNH</label>
          <input value={form.cnh ?? ''} onChange={(e) => set('cnh', e.target.value)} placeholder="00000000000" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Tipo de Executor *</label>
          <select value={form.tipoExecutor} onChange={(e) => set('tipoExecutor', e.target.value)} className="input-field">
            <option value="Advogado(a) — OAB ativa">Advogado(a) — OAB ativa</option>
            <option value="Preposto">Preposto</option>
            <option value="Advogado(a) / Preposto">Advogado(a) / Preposto</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Nº OAB *</label>
          <input value={form.oab ?? ''} onChange={(e) => set('oab', e.target.value)} placeholder="OAB/MG 000.000" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">CNPJ (Pessoa Juridica)</label>
          <input value={form.cnpj ?? ''} onChange={(e) => set('cnpj', e.target.value)} placeholder="00.000.000/0001-00" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Senha *</label>
          <input type="password" value={form.senha ?? ''} onChange={(e) => set('senha', e.target.value)} placeholder="Minimo 8 caracteres" className="input-field" />
        </div>
      </div>
    </div>
  )
}

function Step2({ form, set }: { form: Partial<User> & { senha?: string }; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Telefone</label>
          <input value={form.telefone ?? ''} onChange={(e) => set('telefone', e.target.value)} placeholder="(31) 3333-3333" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Celular *</label>
          <input value={form.celular ?? ''} onChange={(e) => set('celular', e.target.value)} placeholder="(31) 99999-9999" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">CEP</label>
          <input value={form.cep ?? ''} onChange={(e) => set('cep', e.target.value)} placeholder="00000-000" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Estado</label>
          <input value={form.estado ?? ''} onChange={(e) => set('estado', e.target.value)} placeholder="MG" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Rua / Avenida</label>
          <input value={form.rua ?? ''} onChange={(e) => set('rua', e.target.value)} placeholder="Rua das Flores" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Numero</label>
          <input value={form.numero ?? ''} onChange={(e) => set('numero', e.target.value)} placeholder="100" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Bairro</label>
          <input value={form.bairro ?? ''} onChange={(e) => set('bairro', e.target.value)} placeholder="Centro" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Cidade</label>
          <input value={form.cidade ?? ''} onChange={(e) => set('cidade', e.target.value)} placeholder="Belo Horizonte" className="input-field" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Regioes / Cidades que Atua *</label>
          <textarea
            value={(form.regioes ?? []).join(', ')}
            onChange={(e) => set('regioes', e.target.value)}
            rows={3}
            placeholder="Ex: Belo Horizonte, Contagem, Betim, Santa Luzia, MG"
            className="input-field resize-none"
          />
        </div>
      </div>
    </div>
  )
}

function Step3({
  aceitouTermos,
  setAceitouTermos,
}: {
  aceitouTermos: boolean
  setAceitouTermos: (v: boolean) => void
}) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-52 overflow-y-auto">
        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
          {TERMS}
        </pre>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={aceitouTermos}
          onChange={(e) => setAceitouTermos(e.target.checked)}
          className="w-4 h-4 mt-0.5 accent-[#8b1a1a] flex-shrink-0"
        />
        <span className="text-xs text-gray-700">
          Li e aceito integralmente os Termos de Uso e Politica da Plataforma, reconhecendo este instrumento como{' '}
          <strong>titulo executivo extrajudicial</strong> nos termos do art. 784, III do CPC, podendo ser cobrado a qualquer tempo em caso de inadimplencia.
        </span>
      </label>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Apos o cadastro voce precisara assinar o plano mensal (R$100/mes) para acessar as demandas.
        </p>
      </div>
    </div>
  )
}
