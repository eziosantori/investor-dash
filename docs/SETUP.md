# SETUP.md

## Local Development (Planned Commands)

## 1) Install dependencies
```bash
npm install
```

## 2) Initialize Drizzle + SQLite
```bash
npm run db:generate
npm run db:migrate
```

## 3) Start local development
```bash
npm run dev
```

## 4) Step validation (recommended after every small slice)
```bash
npm run test
```

## Suggested Scripts (to add in package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

## Phase 2 Setup (Supabase)
- Configure `.env` with Supabase URL and anon key.
- Create storage bucket for note attachments.
- Apply RLS policies to DB and storage.
- Run PostgreSQL migrations generated from Drizzle schema.
