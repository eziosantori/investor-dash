# PRD.md

## Product Goal
Build a trading journal web app focused on FTMO challenge discipline, risk control, and performance analytics.

## Primary User
- Ezio, swing trader (1h timeframe), FTMO challenge account.

## Core Problems
- Overtrading
- Revenge trading
- Weak pre-trade discipline
- Inconsistent risk sizing
- Too many instruments

## Must-Have Features
1. Trade journal with full metadata and psychology fields.
2. Risk calculator with position sizing and ATR support.
3. Rules/checklist enforcement and violation tracking.
4. Dashboard + analytics for performance and FTMO progress.
5. Routine tracker (daily + weekly review).
6. Finviz report ingestion and visualization.
7. Partial trade closures (scale-out events).
8. Notes with image/screenshot attachments.
9. Multi-journal management (separate journals like FTMO, IBKR).
10. Instrument catalog with trading metadata (ticker/type/leverage/lot/session hours).

## Key Functional Requirements
- A user can manage multiple journals and switch active journal context.
- Accounts and trades are scoped to a journal.
- Instruments are scoped to a journal and must include trading metadata.
- A trade can remain open with `remaining_size > 0`.
- A trade can have multiple closure events.
- Realized P&L is aggregated from closure events.
- Notes support types: `pre`, `during`, `post`, `closure`.
- Attachments support image upload and preview.

## Non-Functional Requirements
- Type-safe codebase.
- Data integrity via constraints + validation.
- Local-first in Phase 1.
- Secure multi-user cloud access in Phase 2 with RLS.

## Success Criteria
- User can create and use separate journals (e.g., FTMO and IBKR) without data mixing.
- User can maintain instrument definitions with ticker, type, leverage, min lot, and session hours.
- User can log, partially close, and fully close trades correctly.
- User can attach screenshots to notes and retrieve them.
- Dashboard metrics match trade/closure data.
- Cloud sync works with ownership isolation.
