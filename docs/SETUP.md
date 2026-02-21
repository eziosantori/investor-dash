# SETUP.md

## Local Development (Step 1)

## 1) Install dependencies
```bash
pnpm install
```

## 2) Start development server
```bash
pnpm dev
```

## 3) Run unit tests
```bash
pnpm test
```

## 4) Build production bundle
```bash
pnpm build
```

## 5) Lint source
```bash
pnpm lint
```

## Workspace Scripts (root `package.json`)
```json
{
  "scripts": {
    "dev": "pnpm --filter web dev",
    "test": "pnpm --filter web test",
    "build": "pnpm --filter web build",
    "lint": "pnpm --filter web lint"
  }
}
```

## Phase 2 Setup (planned, not in Step 1)
- Configure `.env` with Supabase URL and anon key.
- Create storage bucket for note attachments.
- Apply RLS policies to DB and storage.
- Run PostgreSQL migrations generated from Drizzle schema.
