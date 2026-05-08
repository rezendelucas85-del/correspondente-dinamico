export type TipoExecutor = 'Advogado(a) — OAB ativa' | 'Preposto' | 'Advogado(a) / Preposto'

export type AreaAtuacao =
  | 'Trabalhista'
  | 'Cível'
  | 'Consumidor'
  | 'Família'
  | 'Criminal'
  | 'Tributário'
  | 'Previdenciário'

export type TipoDemanda =
  | 'Audiência Inaugural'
  | 'AIJ — Instrução e Julgamento'
  | 'Tentativa de Conciliação'
  | 'Preposto'
  | 'Sustentação Oral'
  | 'Diligência'
  | 'Protocolo'

export type StatusDemanda = 'ativa' | 'confirmada' | 'em_andamento' | 'concluida' | 'cancelada'

export interface User {
  id: string
  nome: string
  email: string
  cpf: string
  rg?: string
  cnh?: string
  tipoExecutor: TipoExecutor
  oab?: string
  cnpj?: string
  telefone?: string
  celular: string
  cep?: string
  estado?: string
  rua?: string
  numero?: string
  bairro?: string
  cidade?: string
  regioes: string[]
  areas: AreaAtuacao[]
  avatar?: string
  avaliacao: number
  totalDemandas: number
  taxaConclusao: number
  saldo: number
  saldoRecebido: number
  planoAtivo: boolean
  pixChave?: string
  codigoIndicacao: string
  indicadosAtivos: number
  desconto: number
  mensalidade: number
  desde: string
  badges: string[]
}

export interface Demanda {
  id: string
  tipo: TipoDemanda
  area: AreaAtuacao
  valor: number
  data: string
  hora: string
  vara: string
  comarca: string
  estado: string
  perfilRequerido: 'ADVOGADO(A)' | 'PREPOSTO' | 'ADVOGADO(A) / PREPOSTO'
  descricao: string
  status: StatusDemanda
  contratanteId: string
  contratanteNome: string
  executorId?: string
  propostas: Proposta[]
  createdAt: string
}

export interface Proposta {
  id: string
  executorId: string
  executorNome: string
  executorOab?: string
  executorAvaliacao: number
  mensagem: string
  createdAt: string
}

export interface RankingEntry {
  posicao: number
  user: User
  badges: string[]
  destaque: boolean
}
