# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:5173 (Vite HMR)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

No test runner is configured.

## Architecture

**Audiências Connect** is a Brazilian legal marketplace SPA where law firms post court hearing demands and lawyers/prepostos submit proposals (bids) to fulfill them.

### State management

All application state lives in a single `AuthContext` ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)). It holds the logged-in user, the full `demandas` array, and modal visibility flags. Every CRUD operation (publish demand, submit proposal, confirm/complete/cancel demand) mutates this in-memory state directly — there is no backend or persistence layer.

The custom hook `useAuth()` is the only way components should consume this context.

### Data flow

Mock seed data is in [src/data/mock.ts](src/data/mock.ts) (users, demands, ranking, filter options). On login, `AuthContext` initialises from this mock. All writes are local state mutations (`setDemandas`, `setUser`); data resets on page reload.

### Routing

Six routes defined in [src/App.tsx](src/App.tsx) via React Router v6. `AuthProvider` wraps the entire tree; the two global modals (`LoginModal`, `CadastroModal`) are rendered at the `App` level and toggled via context flags. There are no protected routes.

### Domain types

All TypeScript interfaces are in [src/types/index.ts](src/types/index.ts). Key concepts:

- **`Demanda`** — a court hearing request with `status` lifecycle: `ativa → confirmada → em_andamento → concluida | cancelada`
- **`Proposta`** — a bid attached to a `Demanda`, submitted by an executor
- **`User`** — covers both demand publishers (contratantes) and executors (advogados/prepostos); `tipoExecutor` discriminates the role; `oab` is the Brazilian Bar Association registration number

### Styling

Tailwind CSS with a custom primary color palette built around `#8b1a1a` (burgundy). Global utility classes (`.btn-primary`, `.btn-outline`, `.badge`, `.input-field`) are defined in [src/index.css](src/index.css).

## Language

All UI copy, variable names in domain objects, and user-facing strings are in Portuguese (pt-BR). Keep new code consistent with this convention.
