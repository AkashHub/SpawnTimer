---
id: INF-006
title: API test harness with local D1
epic: INF
priority: must
verification: unit
size: M
status: ready
depends_on: [INF-005, INF-003]
branch: story/INF-006-api-test-harness-with-local-d1
---

# INF-006: API test harness with local D1

## Context

API and repository tests must run against a real local D1 (SQLite) inside the Workers runtime, using `@cloudflare/vitest-pool-workers`. Follow that package's current documentation for configuration details.

## Depends on

- `INF-005`: Cloudflare Worker scaffold with health endpoint
- `INF-003`: Vitest setup for the shared package

## Scope

Files to create or modify (touch nothing else):

- `apps/api/package.json`: devDependencies `vitest`, `@cloudflare/vitest-pool-workers`; script `"test": "vitest run"`
- `apps/api/vitest.config.ts` (workers pool; reads SQL files from `migrations/` and applies them; binding `CACHE_ENABLED = "false"`, `MAX_CHANNEL = "20"`, `ADMIN_TOKEN = "test-admin-token"`)
- `apps/api/test/helpers.ts`
- `apps/api/test/health.test.ts`
- `apps/api/migrations/.gitkeep`

## Contract

```
// apps/api/test/helpers.ts
export function req(path: string, init?: RequestInit): Promise<Response>;
  // calls the Hono app in-process with the test env, e.g. req('/api/health')
export async function resetDb(): Promise<void>;
  // 1) applies pending migrations; 2) DELETE FROM every user table (not sqlite_*, not d1_migrations)
  // and clears sqlite_sequence; 3) if table `epochs` exists, inserts (id=1, started_at=0, note='test baseline').
  // Must work when there are zero migrations.
export const testEnv: Env;   // the env object used by req()
```

## Acceptance criteria

1. `pnpm --filter @spawn-sync/api test` passes.
2. `health.test.ts` calls `req("/api/health")` and asserts status 200 and body `{ ok: true }`.
3. A second test asserts `testEnv.DB.prepare("SELECT 1 AS one").first()` resolves to `{ one: 1 }`.
4. `resetDb()` is called in a `beforeEach` in at least one test and does not throw with zero migrations.
5. Root `pnpm test` includes the api tests and exits 0.

## How to verify

Run `pnpm --filter (see criteria) test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

Useful commands:

```
pnpm test
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-006-api-test-harness-with-local-d1`; commit message and PR title `INF-006: API test harness with local D1`.
