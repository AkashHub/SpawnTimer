---
id: INF-005
title: Cloudflare Worker scaffold with health endpoint
epic: INF
priority: must
verification: api
size: M
status: ready
depends_on: [INF-001]
branch: story/INF-005-cloudflare-worker-scaffold-with-health
---

# INF-005: Cloudflare Worker scaffold with health endpoint

## Context

The API is a Hono app running on Cloudflare Workers with a D1 binding named `DB`. `GET /api/health` proves the toolchain works end to end.

## Depends on

- `INF-001`: Monorepo scaffold with pnpm workspaces

## Scope

Files to create or modify (touch nothing else):

- `apps/api/package.json`: dependencies `hono`; devDependencies `wrangler`, `@cloudflare/workers-types`, `typescript`; scripts `dev`, `build`, `typecheck`
- `apps/api/wrangler.toml`
- `apps/api/src/index.ts`
- `apps/api/src/env.ts`
- `apps/api/.dev.vars.example`
- `apps/api/tsconfig.json`: add `@cloudflare/workers-types` to `types`
- Root `package.json`: script `dev:api`

## Contract

```
// apps/api/src/env.ts
export interface Env {
  DB: D1Database;
  MAX_CHANNEL: string;      // e.g. "20"
  CACHE_ENABLED: string;    // "true" | "false"
  ADMIN_TOKEN?: string;
  TURNSTILE_SECRET?: string;
}

// apps/api/src/index.ts
export const app = new Hono<{ Bindings: Env }>();
app.get('/api/health', (c) => c.json({ ok: true }));
export default app;

# wrangler.toml essentials
name = "spawn-sync"
main = "src/index.ts"
compatibility_date = "<today, YYYY-MM-DD>"
[vars]
MAX_CHANNEL = "20"
CACHE_ENABLED = "true"
[[d1_databases]]
binding = "DB"
database_name = "spawn-sync-db"
database_id = "00000000-0000-0000-0000-000000000000"
migrations_dir = "migrations"

# package.json scripts (api)
"dev": "wrangler dev --port 8787 --var CACHE_ENABLED:false",   # local mode, no remote resources
"build": "wrangler deploy --dry-run --outdir dist",
"typecheck": "tsc --noEmit"
```

## Acceptance criteria

1. `pnpm dev:api` starts a local Worker on port 8787 without needing Cloudflare login.
2. `curl -i http://localhost:8787/api/health` returns 200 and body `{"ok":true}`.
3. `pnpm typecheck` and `pnpm build` exit 0.
4. `.dev.vars.example` lists `ADMIN_TOKEN=` and `TURNSTILE_SECRET=` with empty values; `.dev.vars` itself is gitignored.
5. The all-zero `database_id` placeholder is present (H-001 replaces it).

## How to verify

Run `pnpm --filter (see criteria) test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

Useful commands:

```
pnpm dev:api &  then  curl -i http://localhost:8787/api/health
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-005-cloudflare-worker-scaffold-with-health`; commit message and PR title `INF-005: Cloudflare Worker scaffold with health endpoint`.
