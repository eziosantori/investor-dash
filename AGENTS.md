# AGENTS.md

## Purpose
This repository contains the implementation plan and execution docs for the Trading Journal Web App.
Agents should use these docs to deliver production-quality increments without relying on hidden assumptions.

## Canonical Sources
1. `docs/PLAN.md` (master plan and scope)
2. `docs/PRD.md` (product requirements)
3. `docs/ARCHITECTURE.md` (system boundaries and runtime model)
4. `docs/DATABASE_SCHEMA.md` (data model, constraints, migrations)
5. `docs/API_SPEC.md` (contracts)
6. `docs/openapi.yaml` (API contract for tooling/codegen)
7. `docs/DEVELOPMENT_BACKLOG.md` (execution order)
8. `docs/TEST_PLAN.md` (verification)

If docs conflict, `docs/PLAN.md` wins and the agent must update the other files to restore consistency.

## Non-Negotiable Requirements
- Use **Drizzle ORM** as mandatory ORM for both SQLite (Phase 1) and PostgreSQL/Supabase (Phase 2+).
- Support **partial trade closures** (`trade_closures` events).
- Support **image screenshot attachments** in trade notes.
- Support **multi-journal** management (e.g., FTMO, IBKR) with clear data scoping.
- Support **instrument catalog** management including ticker, type, leverage, min lot, and trading sessions.
- Keep data ownership by `user_id` for all cloud tables and enforce RLS in Phase 2.
- Never ship endpoints without validation and tests.

## Execution Protocol
1. Pick the next unchecked item in `docs/DEVELOPMENT_BACKLOG.md`.
2. Implement the smallest vertical slice that is testable end-to-end.
3. Define or update at least one unit test for that slice before marking it done.
4. Update schema/migrations first, then backend/API, then UI.
5. Run targeted unit tests for the slice before moving to the next backlog item.
6. Update relevant docs if behavior or schema changes.

## Code Quality Bar
- TypeScript strict mode enabled.
- Zod validation for API payloads.
- No duplicated business logic between client/server.
- Keep calculation logic in isolated pure functions.
- Add concise comments only for non-obvious logic.

## Definition of Done (Per Task)
- Feature works locally.
- DB schema/migrations aligned with docs.
- At least one new or updated unit test covers the implemented step.
- Targeted unit tests for the implemented step pass.
- No unresolved TODO for core behavior.
- Docs updated.
