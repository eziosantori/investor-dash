# ARCHITECTURE.md

## Phases

## Phase 1 (Local MVP)
- Frontend: React + Vite.
- Local API server: handles DB and file uploads.
- Database: SQLite.
- ORM: Drizzle ORM + Drizzle migrations.
- File storage: local filesystem (for note screenshots).

## Phase 2 (Supabase)
- Keep same frontend structure.
- Replace/augment local DB access with Supabase.
- Database: PostgreSQL (Supabase) via Drizzle schema parity.
- Auth: Supabase Auth.
- Storage: Supabase Storage bucket for note attachments.
- Security: RLS on all user-owned tables and storage paths.

## Phase 3 (Production)
- Deploy frontend to Vercel/Netlify.
- API strategy:
  - Use Supabase directly where possible.
  - Optional backend API for custom logic and signed URL orchestration.
- Observability: error tracking + analytics.

## Domain Model Boundaries
- Journal scope:
  - `journal` is the top-level container for accounts, trades, routines, and reports.
  - active journal context drives query filtering in UI and API.
- Account scope:
  - accounts belong to exactly one journal.
- Instrument scope:
  - instruments belong to one journal and include broker metadata (ticker, lot rules, session hours).
- Trade lifecycle:
  - `open` -> `partial` -> `closed`
- Closures:
  - immutable event records in `trade_closures`.
- Notes:
  - text in `trade_notes`.
  - binary media metadata in `note_attachments`.

## Calculation Ownership
- Server-side source of truth for:
  - realized P&L aggregation
  - remaining size updates
  - status transitions
- Client can show previews but cannot be authoritative.

## Incremental Delivery Rule
- Work in small slices from `DEVELOPMENT_BACKLOG.md`.
- Each slice must include unit tests before moving to the next slice.
