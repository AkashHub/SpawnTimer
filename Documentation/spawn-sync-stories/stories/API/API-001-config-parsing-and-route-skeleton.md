---
id: API-001
title: Config parsing and route skeleton
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [INF-006, LIB-010]
branch: story/API-001-config-parsing-and-route-skeleton
---

# API-001: Config parsing and route skeleton

## Context

Every endpoint lives in its own route file so later stories never edit the same file. This story creates all route files as stubs returning 501, mounts them, and adds config parsing.

## Depends on

- `INF-006`: API test harness with local D1
- `LIB-010`: Response schemas (Zod)

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/config.ts`
- `apps/api/src/routes/time.ts`, `maps.ts`, `observations.ts`, `phases.ts`, `sync.ts`, `overview.ts`, `epoch.ts`, `admin.ts`
- `apps/api/src/middleware/logging.ts`, `errors.ts`, `security-headers.ts`, `cache.ts` (no-op stubs)
- `apps/api/src/index.ts` (register middleware, then mount routes)
- `apps/api/test/config.test.ts`, `apps/api/test/routes-skeleton.test.ts`

## Contract

```
// config.ts
export interface AppConfig { channelCount: number; cacheEnabled: boolean }
export function getConfig(env: Pick<Env, 'MAX_CHANNEL' | 'CACHE_ENABLED'>): AppConfig;
  // channelCount: parseInt(MAX_CHANNEL); if not an integer in 1..100 use 20
  // cacheEnabled: CACHE_ENABLED === 'true'

// each route file:  export const timeRoute = new Hono<{ Bindings: Env }>();   (and so on)
// Stub routes (all return 501 {"error":{"code":"NOT_IMPLEMENTED","message":"..."}}):
//   GET  /api/time            routes/time.ts       (export timeRoute)
//   GET  /api/maps            routes/maps.ts       (mapsRoute)
//   POST /api/observations    routes/observations.ts (observationsRoute)
//   GET  /api/phases          routes/phases.ts     (phasesRoute)
//   GET  /api/sync            routes/sync.ts       (syncRoute)
//   GET  /api/overview        routes/overview.ts   (overviewRoute)
//   GET  /api/epoch           routes/epoch.ts      (epochRoute)
//   POST /api/admin/epoch     routes/admin.ts      (adminRoute)
// index.ts mounts each with app.route('/', xRoute); route paths include the /api prefix.
// middleware/*.ts: export function register(app: Hono<{ Bindings: Env }>): void {}   (no-op stubs; each later story replaces exactly one)
// index.ts order: logging.register(app); securityHeaders.register(app); cache.register(app); errors.register(app); then the route mounts.
```

## Acceptance criteria

1. `getConfig({ MAX_CHANNEL: "12", CACHE_ENABLED: "true" })` equals `{ channelCount: 12, cacheEnabled: true }`.
2. Invalid `MAX_CHANNEL` values (`"abc"`, `"0"`, `"101"`, `""`) give `channelCount: 20`; `CACHE_ENABLED: "false"` or anything else gives `cacheEnabled: false`.
3. Each of the 8 stub endpoints returns status 501 with `error.code === "NOT_IMPLEMENTED"` (test loops over them).
4. `GET /api/health` still returns 200 `{ ok: true }`.
5. Eight route files and four middleware stub files exist with the exported names above, registered in the stated order.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-001-config-parsing-and-route-skeleton`; commit message and PR title `API-001: Config parsing and route skeleton`.
