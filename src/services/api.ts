import type { User, Demanda, Proposta } from '../types'

const BASE = 'http://localhost:3001'

// ── Usuários ──────────────────────────────────────────────
export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users`)
  return res.json()
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await fetch(`${BASE}/users?email=${encodeURIComponent(email)}`)
  const users: User[] = await res.json()
  return users[0] ?? null
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  return res.json()
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// ── Demandas ──────────────────────────────────────────────
export async function getDemandas(): Promise<Demanda[]> {
  const [demandasRes, propostasRes] = await Promise.all([
    fetch(`${BASE}/demandas`),
    fetch(`${BASE}/propostas`),
  ])
  const demandas: Omit<Demanda, 'propostas'>[] = await demandasRes.json()
  const propostas: (Proposta & { demandaId: string })[] = await propostasRes.json()

  return demandas.map((d) => ({
    ...d,
    propostas: propostas.filter((p) => p.demandaId === d.id),
  }))
}

export async function createDemanda(demanda: Omit<Demanda, 'id' | 'propostas' | 'createdAt'>): Promise<Demanda> {
  const res = await fetch(`${BASE}/demandas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...demanda, createdAt: new Date().toISOString() }),
  })
  const nova = await res.json()
  return { ...nova, propostas: [] }
}

export async function updateDemanda(id: string, data: Partial<Omit<Demanda, 'propostas'>>): Promise<void> {
  await fetch(`${BASE}/demandas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

// ── Propostas ─────────────────────────────────────────────
export async function createProposta(proposta: Omit<Proposta, 'id'> & { demandaId: string }): Promise<Proposta> {
  const res = await fetch(`${BASE}/propostas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...proposta, createdAt: new Date().toISOString() }),
  })
  return res.json()
}
