# DEVELOPMENT_BACKLOG.md

## Milestone 1 - Foundation
- [x] Bootstrap React + TypeScript + Tailwind + shadcn/ui
- [x] Setup local API server
- [x] Setup Drizzle ORM + Drizzle Kit
- [x] Create initial SQLite migrations
- [x] Wire DB client + repository layer
- [x] Step gate: add/update unit tests for foundation modules
- [x] Step gate: run unit tests before moving to Milestone 2

### Step 1 Execution Order (frontend-only bootstrap)
1. Setup workspace (`pnpm-workspace.yaml`, root scripts, `.gitignore`)
2. Scaffold `apps/web` with React + Vite + TypeScript
3. Configure Tailwind and base design tokens
4. Initialize shadcn/ui base setup and components (`Button`, `Card`, `Input`)
5. Configure test harness (`Vitest`, RTL, jsdom) and add one deterministic unit test
6. Configure ESLint + Prettier
7. Verify with `pnpm test`, `pnpm build`, `pnpm lint`

### Step 2 Execution Order (API scaffold only)
1. Scaffold `apps/api` with Fastify + TypeScript
2. Add app factory and server bootstrap (`HOST=127.0.0.1`, `PORT=3001`)
3. Add `GET /api/health` route
4. Add API test harness (`Vitest`) with unit/integration-light tests
5. Add API lint/format baseline
6. Update root scripts (`dev:api`, `test:api`, `build:api`, `lint:api`)
7. Update docs (`README`, `SETUP`, `API_SPEC`, `openapi`)
8. Verify with `pnpm test:api`, `pnpm build:api`, `pnpm lint:api`, and manual `curl`

### Step 3 Execution Order (Drizzle setup only)
1. Add Drizzle dependencies to `apps/api` (`drizzle-orm`, `drizzle-kit`, `better-sqlite3`)
2. Add Drizzle scripts (`db:generate`, `db:migrate`) in API package and root workspace
3. Add `drizzle.config.ts` for local SQLite target
4. Add DB scaffold files (`src/db/schema.ts`, `src/db/client.ts`)
5. Add lightweight DB foundation test without migration/domain coupling
6. Verify with `pnpm test:api`, `pnpm build:api`, `pnpm lint:api`

### Step 4 Execution Order (initial SQLite migrations)
1. Keep a minimal Drizzle schema scaffold for migration bootstrap
2. Run `pnpm db:generate` to create first SQL migration
3. Confirm migration artifact exists under `apps/api/drizzle/`
4. Verify with `pnpm test:api`, `pnpm build:api`, `pnpm lint:api`

### Step 5 Execution Order (DB client + repository layer)
1. Keep DB client as single entry point (`src/db/client.ts`)
2. Add repository abstractions (`SystemMetaStore`, `SystemMetaRepository`)
3. Add Drizzle adapter store implementation for repository IO
4. Add repository wiring factory (`createRepositories`)
5. Wire repository container into Fastify app options/decorator
6. Add repository unit tests with in-memory store
7. Verify with `pnpm test:api`, `pnpm build:api`, `pnpm lint:api`

### Step 6 Execution Order (foundation test gate closure)
1. Add/refresh unit tests for newly added foundation modules
2. Run web unit tests (`pnpm test`)
3. Run API unit tests (`pnpm test:api`)
4. Run API lint/build sanity (`pnpm lint:api`, `pnpm build:api`)
5. Mark Milestone 1 test gates as completed

## Milestone 2 - Journals + Instruments
- [ ] Create journal CRUD (FTMO, IBKR, etc.)
- [ ] Add journal switcher in UI
- [ ] Create instrument catalog CRUD
- [ ] Add instrument fields: ticker, type, default leverage, min lot, lot step, session hours
- [ ] Link instruments to selected journal/account context
- [ ] Step gate: add/update unit tests for journal/instrument services
- [ ] Step gate: run unit tests before moving to Milestone 3

## Milestone 3 - Trading Core
- [ ] Create trade CRUD
- [ ] Create trade closure events CRUD
- [ ] Implement closure aggregation service
- [ ] Implement status transitions (`open/partial/closed`)
- [ ] Add trade list and trade detail UI
- [ ] Step gate: add/update unit tests for trade/closure logic
- [ ] Step gate: run unit tests before moving to Milestone 4

## Milestone 4 - Notes + Screenshots
- [ ] Create trade notes CRUD
- [ ] Create attachment upload endpoint
- [ ] Add image validation policy
- [ ] Add note timeline UI
- [ ] Add attachment gallery/preview UI
- [ ] Step gate: add/update unit tests for notes/attachments validation
- [ ] Step gate: run unit tests before moving to Milestone 5

## Milestone 5 - Analytics + Rules
- [ ] Dashboard metrics (realized/unrealized, win rate, P&L)
- [ ] Rules/checklist tracking
- [ ] Routine tracker
- [ ] Finviz report ingest/viewer baseline
- [ ] Step gate: add/update unit tests for analytics/rules calculations
- [ ] Step gate: run unit tests before moving to Milestone 6

## Milestone 6 - Cloud Migration
- [ ] Port schema to Supabase PostgreSQL using Drizzle
- [ ] Configure Supabase Auth
- [ ] Configure Supabase Storage for note attachments
- [ ] Apply RLS policies
- [ ] Data migration from SQLite
- [ ] Step gate: add/update unit tests for sync/migration helpers
- [ ] Step gate: run unit tests before moving to Milestone 7

## Milestone 7 - Hardening
- [ ] Unit/integration/e2e coverage for critical flows
- [ ] Error handling and observability
- [ ] Performance pass
- [ ] Security pass
