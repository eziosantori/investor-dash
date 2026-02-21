# DEVELOPMENT_BACKLOG.md

## Milestone 1 - Foundation
- [ ] Bootstrap React + TypeScript + Tailwind + shadcn/ui
- [ ] Setup local API server
- [ ] Setup Drizzle ORM + Drizzle Kit
- [ ] Create initial SQLite migrations
- [ ] Wire DB client + repository layer
- [ ] Step gate: add/update unit tests for foundation modules
- [ ] Step gate: run unit tests before moving to Milestone 2

### Step 1 Execution Order (frontend-only bootstrap)
1. Setup workspace (`pnpm-workspace.yaml`, root scripts, `.gitignore`)
2. Scaffold `apps/web` with React + Vite + TypeScript
3. Configure Tailwind and base design tokens
4. Initialize shadcn/ui base setup and components (`Button`, `Card`, `Input`)
5. Configure test harness (`Vitest`, RTL, jsdom) and add one deterministic unit test
6. Configure ESLint + Prettier
7. Verify with `pnpm test`, `pnpm build`, `pnpm lint`

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
