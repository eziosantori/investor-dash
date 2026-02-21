# TEST_PLAN.md

## Test Pyramid
- Unit tests (calculation and validation logic)
- Integration tests (API + DB behavior)
- E2E tests (critical user journeys)

## Unit Tests
- Journal service:
  - create/switch active journal
  - enforce journal-scoped filtering
- Instrument service:
  - validate ticker/type/leverage/min lot/lot step/session fields
  - prevent duplicate ticker in same journal
- Position sizing and risk calculations
- Closure aggregation:
  - multiple partial closures
  - weighted average exit
  - status transition logic
- Zod payload validation
- Attachment validation:
  - mime allowlist
  - max size

## Integration Tests
- Journal CRUD and isolation between journals (FTMO vs IBKR)
- Instrument CRUD with journal association
- Trade create/update/delete
- Add closure updates trade aggregates atomically
- Prevent closure beyond remaining size
- Notes CRUD with attachments metadata persistence
- Signed URL/local path retrieval behavior

## E2E Tests
- Create two journals and verify independent dashboards/logs
- Add instrument with full metadata and use it in a trade
- Log trade -> add partial closure -> close fully
- Create pre-trade note with screenshot upload
- View trade detail timeline and attachment preview
- Dashboard shows correct metrics after closures

## Step-Based Test Gates
- Milestone 1: foundation unit tests must pass before Milestone 2.
- Milestone 2: journal/instrument unit tests must pass before Milestone 3.
- Milestone 3: trade/closure unit tests must pass before Milestone 4.
- Milestone 4: notes/attachments unit tests must pass before Milestone 5.
- Milestone 5: analytics/rules unit tests must pass before Milestone 6.
- Milestone 6: sync/migration unit tests must pass before Milestone 7.

## Exit Criteria
- All critical paths green.
- No failing migration or schema drift.
- No regression on trade status and P&L math.
