# API_SPEC.md

## Conventions
- JSON request/response.
- Validate all inputs with Zod.
- Return stable error shape: `{ code, message, details? }`.
- Require journal context for journal-scoped resources (`journalId` in route or query).

## System
- `GET /api/health`
  - Returns `200 OK`
  - Payload:
    - `status: "ok"`
    - `service: "api"`
    - `timestamp: string` (ISO-8601)
    - `uptime: number`

## Journals
- `GET /api/journals`
- `GET /api/journals/:id`
- `POST /api/journals`
- `PUT /api/journals/:id`
- `DELETE /api/journals/:id`

## Instruments
- `GET /api/instruments?journalId=:journalId`
- `GET /api/instruments/:id`
- `POST /api/instruments`
- `PUT /api/instruments/:id`
- `DELETE /api/instruments/:id`

### Instrument Payload Minimum Fields
- `journalId`
- `ticker`
- `instrumentType`
- `defaultLeverage`
- `minLot`
- `lotStep`
- `marketTimezone`
- `sessionOpenTime`
- `sessionCloseTime`

## Accounts
- `GET /api/accounts?journalId=:journalId`
- `GET /api/accounts/:id`
- `POST /api/accounts`
- `PUT /api/accounts/:id`
- `DELETE /api/accounts/:id`

## Trades
- `GET /api/trades?journalId=:journalId`
- `GET /api/trades/:id`
- `POST /api/trades`
- `PUT /api/trades/:id`
- `DELETE /api/trades/:id`
- `GET /api/trades/stats?journalId=:journalId`

## Trade Closures
- `GET /api/trades/:id/closures`
- `POST /api/trades/:id/closures`
- `PUT /api/trade-closures/:closureId`
- `DELETE /api/trade-closures/:closureId`

### POST /api/trades/:id/closures (important checks)
- `closed_size > 0`
- `closed_size <= remaining_size`
- Recalculate:
  - `remaining_size`
  - `realized_pnl_amount`
  - `avg_exit_price`
  - `status`

## Trade Notes
- `GET /api/trades/:id/notes`
- `POST /api/trades/:id/notes`
- `PUT /api/trade-notes/:noteId`
- `DELETE /api/trade-notes/:noteId`

## Note Attachments
- `POST /api/trade-notes/:noteId/attachments`
- `DELETE /api/note-attachments/:attachmentId`
- `GET /api/note-attachments/:attachmentId/url`

### Upload Validation
- Accept only configured MIME allowlist.
- Reject files over size limit.
- Store metadata in `note_attachments`.
- Local phase: store path under local uploads root.
- Cloud phase: store object path in Supabase bucket.
