# Trading Journal Web App - Development Plan

## 🎯 Project Overview

Build a **Trading Journal & Analytics Web App** for FTMO challenge tracking with incremental complexity:
- **Phase 1:** Local-only (SQLite, no auth, runs on localhost)
- **Phase 2:** Add Supabase (cloud sync, authentication)
- **Phase 3:** Production deployment (CDN, multi-user ready)

**Stack:** React + Vite + TypeScript + shadcn/ui + Tailwind CSS  
**Backend:** SQLite (Phase 1) → Supabase (Phase 2+)  
**ORM (Mandatory):** Drizzle ORM + Drizzle Kit migrations (SQLite + PostgreSQL)  
**Hosting:** Local (Phase 1) → Vercel/Netlify CDN (Phase 3)

---

## 👤 User Context

**Name:** Ezio  
**Challenge:** FTMO #7489666  
**Account Balance:** ~$193,564  
**Trading Style:** Swing trading on 1h timeframe  
**Work Schedule:** Full-time job (2 days office, 3 days home)  
**Focus Instruments:** US100 (Nasdaq), Gold/Gold Miners, Energy sector  

**Key Problems to Solve:**
1. Overtrading (14+ trades/day → max 3/day)
2. Revenge trading after losses
3. Too many instruments (20+ → max 2)
4. No pre-trade discipline
5. Risk management not calculated properly

---

## 📋 Core Features

### 1. Trading Journal
- Log trades with all fields (entry, SL, TP, exit, P&L, R:R, ATR, position size, etc.)
- Register partial trade closures (scale-out) with separate closure events
- Auto-calculate: Position size, Risk $, Risk %, R:R ratio
- Pre-trade notes (mandatory before logging)
- Add screenshots/images to trade notes
- Emotion tracking
- Mistake tagging
- Lesson learned field

### 2. Risk Calculator
- Input: Balance, Instrument, Entry, SL, ATR
- Output: Position size, Risk $, R:R
- ATR-based SL suggestions

### 3. Rules & Checklist
- Pre-trade checklist (must complete before trade)
- Rule violation counter
- Daily trade counter (max 3)
- Consecutive loss tracker (stop after 2)

### 4. Dashboard & Analytics
- Equity curve
- Win rate (daily/weekly/monthly)
- P&L breakdown
- Mistakes analysis
- FTMO challenge progress tracker

### 5. Routine Tracker
- Daily routine checklist (morning review, evening journal)
- Streak counter
- Weekly review prompts

### 6. Finviz Report Integration
- Weekly Finviz industry performance report
- Ingest from Markdown/CSV
- Display as interactive tables/charts
- Highlight top sectors, pullback opportunities

### 7. Multi-Journal Management
- Multiple journals per user (e.g., FTMO, IBKR, personal account)
- Journal switcher in UI with strict data scoping
- Separate analytics and routine stats per journal

### 8. Instrument Registry
- Manage tradable instruments by journal
- Fields: type, ticker, leverage, min lot, lot step, contract details
- Market session data: timezone, opening/closing time, trading days

---

## 🏗️ Architecture

### Phase 1: Local-Only (MVP)

```
┌─────────────────────────────────────┐
│         Browser (localhost)         │
│  ┌───────────────────────────────┐  │
│  │  React + Vite + TypeScript    │  │
│  │  + shadcn/ui + Tailwind       │  │
│  └───────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐  │
│  │  Local API (Node + Drizzle)   │  │
│  └───────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐  │
│  │   better-sqlite3 (local)      │  │
│  │   /data/trading-journal.db    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Tech:**
- Vite + React + TypeScript
- shadcn/ui components
- Tailwind CSS
- Local API layer for DB operations (Node runtime)
- `better-sqlite3` + Drizzle ORM for local DB
- Drizzle schema as single source of truth for SQLite and Supabase PostgreSQL
- No authentication
- All data stored locally in `/data/trading-journal.db`

**Deployment:**
- `npm run dev` → localhost:5173
- Or `npm run build` + serve static files

---

### Phase 2: Supabase Integration

```
┌─────────────────────────────────────┐
│         Browser (localhost)         │
│  ┌───────────────────────────────┐  │
│  │  React + Vite + TypeScript    │  │
│  │  + shadcn/ui + Tailwind       │  │
│  └───────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐  │
│  │   Supabase Client             │  │
│  │   (Auth + DB + Storage)       │  │
│  └───────────────────────────────┘  │
│              │                      │
└──────────────┼──────────────────────┘
               │
               ▼
    ┌─────────────────────┐
    │   Supabase Cloud    │
    │  - PostgreSQL DB    │
    │  - Auth (Email/Google) │
    │  - Row Level Security │
    └─────────────────────┘
```

**New Features:**
- Supabase authentication (email + Google OAuth)
- Cloud database sync
- Row Level Security (user can only see their data)
- Local-first with sync (optional offline support)

**Migration:**
- Export SQLite data → Import to Supabase
- Dual-write during transition

---

### Phase 3: Production Deployment

```
┌─────────────────────────────────────┐
│         CDN (Vercel/Netlify)        │
│  ┌───────────────────────────────┐  │
│  │  Static React App             │  │
│  │  (Pre-built, optimized)       │  │
│  └───────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐  │
│  │   Supabase (Cloud)            │  │
│  │   - Auth                       │  │
│  │   - PostgreSQL                 │  │
│  │   - Realtime subscriptions     │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**New Features:**
- Deployed on Vercel/Netlify CDN
- Custom domain
- HTTPS
- Production environment variables
- Error tracking (Sentry)
- Analytics (optional)

---

## 🗄️ Database Schema

### Table: `users` (Phase 2+)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `journals`
```sql
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL, -- "FTMO Journal", "IBKR Journal"
  broker TEXT, -- "FTMO", "IBKR", etc.
  base_currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journals_user ON journals(user_id);
```

### Table: `accounts`
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  journal_id UUID NOT NULL REFERENCES journals(id),
  name TEXT NOT NULL, -- e.g., "FTMO #7489666"
  broker_account_id TEXT, -- external account id/reference
  balance_start DECIMAL(15,2) NOT NULL,
  balance_current DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  challenge_type TEXT, -- "FTMO", "MyForexFunds", etc.
  profit_target_pct DECIMAL(5,2) DEFAULT 10.0,
  max_daily_loss_pct DECIMAL(5,2) DEFAULT 5.0,
  max_overall_loss_pct DECIMAL(5,2) DEFAULT 10.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_journal ON accounts(journal_id);
```

### Table: `trades`
```sql
-- NOTE: ensure `instruments` table exists before creating `trades`
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  
  -- Trade Details
  instrument_id UUID REFERENCES instruments(id),
  instrument TEXT NOT NULL, -- snapshot symbol like "US100", "XAUUSD"
  direction TEXT NOT NULL CHECK (direction IN ('Long', 'Short')),
  entry_price DECIMAL(18,8) NOT NULL,
  sl_price DECIMAL(18,8) NOT NULL,
  tp_price DECIMAL(18,8) NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'partial', 'closed')),
  
  -- Position Sizing
  position_size DECIMAL(18,8) NOT NULL,
  remaining_size DECIMAL(18,8) NOT NULL,
  leverage DECIMAL(5,2) DEFAULT 10,
  
  -- Risk Management
  atr_14 DECIMAL(18,8),
  sl_atr_multiplier DECIMAL(3,2) DEFAULT 2.0,
  risk_amount DECIMAL(15,2) NOT NULL,
  risk_pct DECIMAL(5,2) DEFAULT 1.0,
  
  -- Results (aggregated from closure events)
  realized_pnl_amount DECIMAL(15,2) DEFAULT 0,
  unrealized_pnl_amount DECIMAL(15,2),
  pnl_pct DECIMAL(8,4),
  rr_ratio DECIMAL(5,2),
  avg_exit_price DECIMAL(18,8),
  exit_reason TEXT,
  
  -- Metadata
  setup_type TEXT, -- "Trend Following", "Pullback", "Breakout", etc.
  timeframe TEXT DEFAULT '1h',
  
  -- Psychology
  pre_trade_note TEXT,
  emotion TEXT, -- "Calm", "Rushed", "Frustrated", etc.
  mistakes TEXT[], -- ["FOMO", "Revenge Trading", etc.]
  lesson_learned TEXT,
  
  -- Timestamps
  trade_date DATE NOT NULL,
  trade_time TIME,
  opened_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trades_account ON trades(account_id);
CREATE INDEX idx_trades_date ON trades(trade_date);
CREATE INDEX idx_trades_instrument ON trades(instrument);
CREATE INDEX idx_trades_status ON trades(status);
```

### Table: `trade_closures`
```sql
CREATE TABLE trade_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  closed_size DECIMAL(18,8) NOT NULL CHECK (closed_size > 0),
  exit_price DECIMAL(18,8) NOT NULL,
  pnl_amount DECIMAL(15,2) NOT NULL,
  rr_ratio DECIMAL(5,2),
  reason TEXT, -- "TP1", "Manual", "Risk reduction", etc.
  note TEXT,
  closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trade_closures_trade ON trade_closures(trade_id);
CREATE INDEX idx_trade_closures_closed_at ON trade_closures(closed_at);
```

### Table: `trade_notes`
```sql
CREATE TABLE trade_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL CHECK (note_type IN ('pre', 'during', 'post', 'closure')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trade_notes_trade ON trade_notes(trade_id);
CREATE INDEX idx_trade_notes_type ON trade_notes(note_type);
```

### Table: `note_attachments`
```sql
CREATE TABLE note_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES trade_notes(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  storage_provider TEXT NOT NULL DEFAULT 'local' CHECK (storage_provider IN ('local', 'supabase')),
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width_px INT,
  height_px INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_note_attachments_note ON note_attachments(note_id);
```

### Table: `instruments`
```sql
CREATE TABLE instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  journal_id UUID NOT NULL REFERENCES journals(id),
  symbol TEXT NOT NULL, -- broker symbol, e.g. "US100", "XAUUSD"
  ticker TEXT NOT NULL, -- normalized ticker, e.g. "NQ", "GC", "AAPL"
  name TEXT, -- "Nasdaq 100", "Gold"
  instrument_type TEXT, -- "Index CFD", "Forex", "Crypto", "Stock", "Futures"
  asset_class TEXT, -- "Index", "FX", "Metal", "Energy", "Equity", etc.
  exchange TEXT, -- optional
  default_leverage DECIMAL(5,2) DEFAULT 10,
  max_leverage DECIMAL(5,2),
  min_lot DECIMAL(18,8) DEFAULT 0.01,
  lot_step DECIMAL(18,8) DEFAULT 0.01,
  max_lot DECIMAL(18,8),
  contract_size DECIMAL(18,8),
  tick_size DECIMAL(18,8),
  tick_value DECIMAL(18,8),
  market_timezone TEXT DEFAULT 'UTC',
  session_open_time TIME,
  session_close_time TIME,
  trading_days TEXT[], -- ['Mon','Tue','Wed','Thu','Fri']
  is_24h BOOLEAN DEFAULT false,
  atr_14 DECIMAL(18,8),
  atr_updated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_instruments_journal_ticker ON instruments(journal_id, ticker);
```

### Table: `daily_routines`
```sql
CREATE TABLE daily_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL UNIQUE,
  
  -- Morning Routine
  morning_review_done BOOLEAN DEFAULT false,
  morning_review_time TIME,
  setups_identified TEXT[],
  
  -- Pre-Trade
  checklist_completed INT DEFAULT 0,
  checklist_total INT DEFAULT 11,
  
  -- Evening Routine
  evening_journal_done BOOLEAN DEFAULT false,
  evening_journal_time TIME,
  daily_review_note TEXT,
  
  -- Metrics
  trades_count INT DEFAULT 0,
  rule_violations INT DEFAULT 0,
  emotion_avg TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `weekly_reviews`
```sql
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  -- Metrics
  total_trades INT DEFAULT 0,
  planned_trades INT DEFAULT 0,
  win_rate DECIMAL(5,2),
  total_pnl DECIMAL(15,2),
  mistake_pct DECIMAL(5,2),
  
  -- Reflections
  best_trade_note TEXT,
  worst_trade_note TEXT,
  checklist_compliance_pct DECIMAL(5,2),
  best_time_of_day TEXT,
  improvements_next_week TEXT,
  
  -- Goals
  next_week_goal TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `finviz_reports`
```sql
CREATE TABLE finviz_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  report_date DATE NOT NULL,
  period TEXT DEFAULT 'weekly',
  
  -- Top Sectors (JSON for flexibility)
  top_sectors JSONB,
  top_industries JSONB,
  worst_sectors JSONB,
  worst_industries JSONB,
  
  -- Watchlist
  long_watchlist JSONB,
  short_watchlist JSONB,
  
  -- Notes
  key_takeaways TEXT,
  focus_instruments TEXT[],
  
  -- Raw Data
  raw_markdown TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `rules`
```sql
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  rule_number INT NOT NULL,
  rule_text TEXT NOT NULL,
  reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default Rules for Ezio
INSERT INTO rules (user_id, rule_number, rule_text, reason) VALUES
('ezio-uuid', 1, 'Max 3 trades per day', 'Avoid overtrading'),
('ezio-uuid', 2, 'Max 2 instruments', 'Focus and mastery'),
('ezio-uuid', 3, 'Minimum 2h between trades', 'Avoid revenge trading'),
('ezio-uuid', 4, 'Stop after 2 consecutive losses', 'Protect capital'),
('ezio-uuid', 5, 'Only 1h timeframe', 'Swing consistency'),
('ezio-uuid', 6, 'NO trades on office days (or max 1)', 'Compatible with work'),
('ezio-uuid', 7, 'Write pre-trade note BEFORE entering', 'Awareness'),
('ezio-uuid', 8, 'Never move stop loss', 'Risk management'),
('ezio-uuid', 9, 'Risk max 1-2% per trade', 'Survival'),
('ezio-uuid', 10, 'SL based on ATR (min 1.5x)', 'Technical, not arbitrary');
```

---

## 📱 UI/UX Requirements

### Design System
- **Framework:** shadcn/ui (Radix primitives + Tailwind)
- **Theme:** Light/Dark mode toggle
- **Color Palette:** Professional trading (blues, greens for profit, reds for loss)
- **Typography:** Inter or similar clean sans-serif

### Key Pages

#### 1. Dashboard (Home)
- Equity curve chart (Recharts)
- Active journal indicator + quick switcher (FTMO/IBKR/...)
- Today's metrics card (trades, P&L, win rate)
- FTMO progress bars (profit target, daily loss, overall loss)
- Recent trades table (last 5)
- Rule violations alert (if any)
- Quick actions: "Log Trade", "Risk Calculator"

#### 2. Trade Log
- Full trade history table (sortable, filterable)
- Filters: Date range, Instrument, Direction, Setup Type
- Export to CSV
- Inline edit for lessons learned
- Expand row to view partial closures, realized P&L timeline, and note attachments

#### 3. Log Trade Form
- Step-by-step wizard:
  1. Instrument + Direction
  2. Entry, SL, TP (with ATR calculator)
  3. Position size (auto-calculated)
  4. Pre-trade note (REQUIRED) + optional screenshot attachments
  5. Checklist (REQUIRED, all must be checked)
- Validation: Can't submit without pre-trade note + checklist

#### 4. Trade Detail
- Header with status badge: Open / Partial / Closed
- Partial closure panel (add closure event with quantity, price, reason)
- Notes timeline (pre/during/post/closure notes)
- Attachment gallery with image preview/download

#### 5. Risk Calculator
- Interactive calculator
- Inputs: Balance, Instrument, Entry, SL, ATR
- Live results: Position Size, Risk $, R:R
- "Log This Trade" button (pre-fills trade form)

#### 6. Analytics
- Win rate trend (weekly/monthly)
- P&L by instrument (bar chart)
- Mistakes breakdown (pie chart)
- R:R distribution (histogram)
- Best/worst trades
- Heatmap (trades by day/hour)

#### 7. Routine Tracker
- Today's checklist
- Streak counter (days with complete routine)
- Morning/Evening routine forms
- Weekly review form (auto-generated every Friday)

#### 8. Finviz Reports
- List of weekly reports
- Report viewer (render Markdown)
- Interactive tables for top sectors/industries
- Watchlist with add-to-watchlist feature

#### 9. Settings
- Profile (name, email, timezone)
- Journals (create/edit/archive journals: FTMO, IBKR, etc.)
- Accounts (add/edit broker or challenge accounts per journal)
- Instruments (manage ticker/type/leverage/min lot/market sessions/ATR)
- Rules (customize trading rules)
- Data export/import

---

## 🚀 Development Phases

### Phase 1: Local MVP (Week 1-2)

**Goals:**
- Working app on localhost
- SQLite database
- Core features: Trade Log, Risk Calculator, Dashboard

**Tasks:**
1. [ ] Setup Vite + React + TypeScript + Tailwind
2. [ ] Install shadcn/ui
3. [ ] Setup local API layer + better-sqlite3
4. [ ] Setup Drizzle ORM + migrations for SQLite
5. [ ] Create database schema (SQLite) via Drizzle
6. [ ] Add unit tests for foundation modules (schema, repositories, validators)
7. [ ] Implement journals CRUD + journal switcher
8. [ ] Implement instruments CRUD with ticker/type/leverage/min lot/session hours
9. [ ] Add unit tests for journal/instrument domain logic
10. [ ] Implement partial closure domain logic (trade_closures aggregation)
11. [ ] Implement note attachments upload pipeline (local filesystem)
12. [ ] Add image validation (mime, size, max attachments)
13. [ ] Add unit tests for trade/closure/note domains
14. [ ] Build Dashboard page
15. [ ] Build Trade Log page (list + form + detail)
16. [ ] Build Risk Calculator
17. [ ] Add basic analytics (win rate, P&L, realized vs unrealized)
18. [ ] Run unit tests + local smoke test before closing Phase 1

**Deliverable:** Working app at localhost:5173

---

### Phase 2: Supabase Integration (Week 3-4)

**Goals:**
- Cloud sync
- Authentication
- Multi-device support

**Tasks:**
1. [ ] Setup Supabase project
2. [ ] Create database schema (PostgreSQL) from Drizzle models
3. [ ] Add Supabase client to app
4. [ ] Implement authentication (email + Google)
5. [ ] Setup Supabase Storage bucket for note screenshots
6. [ ] Migrate data from SQLite to Supabase
7. [ ] Add Row Level Security policies (DB + Storage)
8. [ ] Add journal-scoped RLS checks for journals/accounts/instruments/trades
9. [ ] Implement offline-first with sync
10. [ ] Add real-time updates (optional)
11. [ ] Add unit tests for sync and migration helpers
12. [ ] Run unit tests + integration smoke test before closing Phase 2

**Deliverable:** Cloud-synced app with auth

---

### Phase 3: Production Deployment (Week 5)

**Goals:**
- Deploy to CDN
- Custom domain
- Production-ready

**Tasks:**
1. [ ] Setup Vercel/Netlify project
2. [ ] Configure environment variables
3. [ ] Deploy app
4. [ ] Setup custom domain
5. [ ] Add error tracking (Sentry)
6. [ ] Add analytics (optional)
7. [ ] Performance optimization
8. [ ] Security audit

**Deliverable:** Production app at trading-journal.yourdomain.com

---

### Phase 4: Finviz Integration (Week 6)

**Goals:**
- Ingest Finviz reports
- Display as interactive data

**Tasks:**
1. [ ] Create Finviz report parser (Markdown → JSON)
2. [ ] Build report upload feature
3. [ ] Create report viewer component
4. [ ] Add interactive tables/charts
5. [ ] Weekly reminder (email/push)
6. [ ] Watchlist feature

**Deliverable:** Finviz reports integrated

---

### Phase 5: Advanced Features (Week 7+)

**Goals:**
- Enhance analytics
- Add alerts/notifications
- Mobile optimization

**Tasks:**
1. [ ] Advanced analytics (expectancy, profit factor)
2. [ ] Email notifications (daily summary, rule violations)
3. [ ] Mobile-responsive design
4. [ ] PWA support (install on phone)
5. [ ] API for third-party integrations
6. [ ] Broker API integration (auto-import trades)

---

## 📦 Tech Stack Details

### Package Manager
- `pnpm` (workspace mode)

### Frontend
```json
{
  "react": "^18.x",
  "vite": "^5.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "shadcn/ui": "latest",
  "radix-ui": "latest",
  "recharts": "^2.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "date-fns": "^3.x",
  "react-router-dom": "^6.x"
}
```

### Backend (Phase 1: Local)
```json
{
  "better-sqlite3": "^9.x",
  "drizzle-orm": "^0.x",
  "drizzle-kit": "^0.x"
}
```

### Backend (Phase 2+: Supabase)
```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/auth-ui-react": "^0.x",
  "@supabase/auth-ui-shared": "^0.x"
}
```

### ORM & Migration Strategy
- Drizzle schema definitions are the canonical DB contract.
- Generate and run migrations with Drizzle Kit in every phase.
- Keep SQLite and PostgreSQL schemas aligned from the same domain model.
- Never apply manual schema edits directly in production environments.

### Development Tools
```json
{
  "eslint": "^8.x",
  "prettier": "^3.x",
  "vitest": "^1.x",
  "playwright": "^1.x" (e2e testing)
}
```

---

## 🔐 Security Considerations

### Phase 1 (Local)
- No authentication needed
- Data stored locally in `/data/trading-journal.db`
- Backup: Manual export to JSON/CSV

### Phase 2+ (Supabase)
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- JWT-based authentication
- Environment variables for sensitive config
- HTTPS enforced

### Data Privacy
- No sensitive data (passwords, API keys) stored in DB
- Financial data encrypted at rest (Supabase default)
- GDPR compliance (data export/delete features)
- Upload constraints for screenshots (MIME allowlist + max file size)
- Private storage buckets with signed URLs for attachment access

---

## 📊 Analytics & Metrics

### Trading Metrics
- Win Rate (%)
- Profit Factor
- Expectancy
- Average R:R
- Average Win/Loss
- Max Drawdown
- Sharpe Ratio (optional)
- Realized vs Unrealized P&L
- Scale-out efficiency (partial closure quality)
- Metrics segmented by journal/account

### FTMO Challenge Metrics
- Profit Target Progress (% of 10%)
- Daily Loss Remaining (% of 5%)
- Overall Loss Remaining (% of 10%)
- Trading Days Count (min 10)
- Status: On Track / At Risk / Failed

### Routine Metrics
- Days with Complete Routine (streak)
- Checklist Compliance (%)
- Pre-Trade Note Completion (%)
- Rule Violations Count

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Journal service (create/switch/scope filtering)
- Instrument service (validation for ticker/type/leverage/min lot/session fields)
- Risk calculator functions
- Position size calculations
- R:R ratio calculations
- Data validation (Zod schemas)
- Partial closure aggregation logic
- Attachment validation rules (mime/size/limits)

### Integration Tests (Playwright)
- Trade logging flow
- Authentication flow
- Dashboard data loading
- Multi-journal isolation (FTMO vs IBKR)
- Instrument CRUD and assignment to trades
- Partial closure workflow from open -> partial -> closed
- Screenshot upload and preview in notes

### E2E Tests (Playwright)
- Complete user journey
- Critical paths (log trade, view analytics)

### Step-Based Test Gates
- Each backlog step must include at least one unit test before marked done
- Unit tests must pass before moving to the next milestone

---

## 📝 API Endpoints (Phase 2+)

### Journals
```
GET    /api/journals            - List journals
GET    /api/journals/:id        - Get journal details
POST   /api/journals            - Create journal
PUT    /api/journals/:id        - Update journal
DELETE /api/journals/:id        - Archive/delete journal
```

### Instruments
```
GET    /api/instruments?journalId=:journalId   - List instruments for journal
GET    /api/instruments/:id                     - Get instrument details
POST   /api/instruments                         - Create instrument
PUT    /api/instruments/:id                     - Update instrument
DELETE /api/instruments/:id                     - Delete instrument
```

### Trades
```
GET    /api/trades?journalId=:journalId - List trades by journal
GET    /api/trades/:id          - Get single trade
POST   /api/trades              - Create trade
PUT    /api/trades/:id          - Update trade
DELETE /api/trades/:id          - Delete trade
GET    /api/trades/stats?journalId=:journalId - Get trading stats
```

### Trade Closures
```
GET    /api/trades/:id/closures         - List closures for a trade
POST   /api/trades/:id/closures         - Add partial/full closure event
PUT    /api/trade-closures/:closureId   - Update closure event
DELETE /api/trade-closures/:closureId   - Delete closure event
```

### Trade Notes & Attachments
```
GET    /api/trades/:id/notes                    - List trade notes
POST   /api/trades/:id/notes                    - Create note
PUT    /api/trade-notes/:noteId                 - Update note
DELETE /api/trade-notes/:noteId                 - Delete note
POST   /api/trade-notes/:noteId/attachments     - Upload screenshot attachment
DELETE /api/note-attachments/:attachmentId      - Delete attachment
GET    /api/note-attachments/:attachmentId/url  - Get signed/private URL
```

### Accounts
```
GET    /api/accounts?journalId=:journalId - List accounts by journal
GET    /api/accounts/:id        - Get account details
POST   /api/accounts            - Create account
PUT    /api/accounts/:id        - Update account
```

### Routines
```
GET    /api/routines/today      - Get today's routine
POST   /api/routines            - Create/update routine
GET    /api/routines/streak     - Get current streak
```

### Finviz Reports
```
GET    /api/finviz              - List reports
POST   /api/finviz              - Upload report
GET    /api/finviz/:id          - Get report
```

---

## 🎨 Component Library (shadcn/ui)

### Required Components
- [x] Button
- [x] Input
- [x] Label
- [x] Select
- [x] Dialog/Modal
- [x] Form
- [x] Table
- [x] Card
- [x] Chart (Recharts)
- [x] Progress
- [x] Badge
- [x] Tabs
- [x] Calendar
- [x] Toast/Sonner
- [x] Dropdown Menu
- [x] Avatar
- [x] Separator
- [x] Skeleton (loading states)

### Custom Components
- TradeForm
- TradeDetail
- PartialClosurePanel
- TradeNotesTimeline
- AttachmentUploader
- JournalSwitcher
- InstrumentForm
- RiskCalculator
- EquityCurve
- WinRateChart
- MistakePieChart
- FTMOProgressBars
- RoutineChecklist
- FinvizReportViewer

---

## 📁 Project Structure

```
trading-journal/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── trade/           # Trade-related components
│   │   ├── analytics/       # Charts, metrics
│   │   ├── routine/         # Routine tracker
│   │   └── finviz/          # Finviz report viewer
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── TradeLog.tsx
│   │   ├── LogTrade.tsx
│   │   ├── TradeDetail.tsx
│   │   ├── RiskCalculator.tsx
│   │   ├── Analytics.tsx
│   │   ├── Routine.tsx
│   │   ├── FinvizReports.tsx
│   │   └── Settings.tsx
│   ├── lib/
│   │   ├── db.ts            # Database client (SQLite/Supabase)
│   │   ├── schema.ts        # Zod schemas
│   │   ├── calculations.ts  # Risk/P&L calculations
│   │   └── utils.ts         # Helpers
│   ├── hooks/
│   │   ├── useTrades.ts
│   │   ├── useAccount.ts
│   │   ├── useJournals.ts
│   │   ├── useInstruments.ts
│   │   └── useRoutine.ts
│   ├── stores/              # State management (Zustand)
│   └── App.tsx
├── server/
│   ├── api/                 # Local API routes (Phase 1)
│   ├── db/                  # Drizzle database client
│   └── uploads/             # Local screenshot attachments (Phase 1)
├── drizzle/
│   ├── schema/              # Shared Drizzle schema (SQLite + PG)
│   └── migrations/
├── data/                    # Local SQLite DB (Phase 1)
├── supabase/                # Supabase config (Phase 2+)
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 Success Criteria

### Phase 1 (MVP)
- [ ] Can log trades locally
- [ ] Can create/switch multiple journals locally
- [ ] Can manage instrument catalog with ticker/type/leverage/min lot/session hours
- [ ] Can register multiple partial closures per trade
- [ ] Can attach screenshots to trade notes
- [ ] Risk calculator works
- [ ] Dashboard shows correct metrics
- [ ] App runs on localhost without errors
- [ ] Unit tests added and passing for each completed step

### Phase 2 (Cloud)
- [ ] Can authenticate
- [ ] Data syncs to Supabase
- [ ] Can access from multiple devices
- [ ] RLS policies working
- [ ] Journal-scoped data isolation (FTMO vs IBKR) verified
- [ ] Screenshot attachments stored and retrieved via Supabase Storage policies

### Phase 3 (Production)
- [ ] Deployed on CDN
- [ ] Custom domain working
- [ ] HTTPS enabled
- [ ] Error tracking active

### Phase 4 (Finviz)
- [ ] Can upload Finviz reports
- [ ] Reports display correctly
- [ ] Interactive tables/charts working

---

## 💡 Future Enhancements

1. **Broker Integration:** Auto-import trades from MT4/MT5/cTrader
2. **AI Analysis:** LLM-powered trade review suggestions
3. **Community Features:** Share anonymized stats, leaderboards
4. **Mobile App:** React Native version
5. **Advanced Backtesting:** Test strategies on historical data
6. **Alerts:** Push/email alerts for rule violations, market conditions
7. **Multi-Account:** Track multiple challenges/accounts
8. **Tax Reports:** Generate tax documents

---

## 📞 Support & Documentation

- **README.md:** Setup instructions
- **CONTRIBUTING.md:** Development guidelines
- **CHANGELOG.md:** Version history
- **Issues:** GitHub Issues for bugs/features

---

*Created: 2026-02-21*  
*For: Ezio FTMO Challenge*  
*Version: 1.1*
