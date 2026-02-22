# Investor Dash - Trading Journal

Execution docs for building a Trading Journal & Analytics app with phased delivery.

## Quick Start
- `pnpm install`
- `pnpm dev`
- `pnpm dev:api`
- `pnpm test`
- `pnpm test:api`
- `pnpm build`
- `pnpm build:api`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm lint`
- `pnpm lint:api`

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

## API Health Check
- Run API: `pnpm dev:api`
- Endpoint: `GET http://127.0.0.1:3001/api/health`

## Demo Seed Data (In-Memory)
- During local API development (in-memory mode), demo journals/instruments are preloaded.
- Seed can be disabled with: `SEED_DEMO_DATA=false pnpm dev:api`
- Default seeded journal IDs:
  - `journal-ftmo`
  - `journal-ibkr`

## VSCode Tasks/Launch
- Tasks: `.vscode/tasks.json`
- Launch configs: `.vscode/launch.json`
- Keep these files aligned whenever root scripts in `package.json` change.
