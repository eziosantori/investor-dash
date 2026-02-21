# Investor Dash - Trading Journal

Execution docs for building a Trading Journal & Analytics app with phased delivery.

## Quick Start
- `pnpm install`
- `pnpm dev`
- `pnpm test`
- `pnpm build`
- `pnpm lint`

## Start Here
- `docs/PLAN.md`: full roadmap and scope.
- `AGENTS.md`: autonomous execution rules for coding agents.
- `docs/DEVELOPMENT_BACKLOG.md`: ordered implementation checklist.

## Core Requirements
- React + TypeScript + Tailwind + shadcn/ui.
- Local-first Phase 1 with SQLite.
- Phase 2 migration to Supabase (PostgreSQL + Auth + Storage + RLS).
- **Drizzle ORM required** across both DB backends.
- Multi-journal support (FTMO, IBKR, etc.) with strict isolation.
- Instrument catalog with ticker/type/leverage/lot/session metadata.
- Partial trade closures.
- Screenshot attachments in trade notes.
- Step-by-step delivery with mandatory unit tests per step.

## Documentation Index
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/FLOW_DIAGRAMS.md`
- `docs/API_SPEC.md`
- `docs/openapi.yaml`
- `docs/TEST_PLAN.md`
- `docs/SETUP.md`
