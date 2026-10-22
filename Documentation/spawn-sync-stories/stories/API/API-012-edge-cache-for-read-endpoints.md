---
id: API-012
title: Edge cache for read endpoints
epic: API
priority: should
verification: api
size: M
status: ready
depends_on: [API-005, API-009, API-010, API-011]
branch: story/API-012-edge-cache-for-read-endpoints
---

# API-012: Edge cache for read endpoints

## Context

Most traffic repeats the same reads. Cache GET responses at the edge for a short time using the Workers Cache API (`caches.default`). Caching is controlled by `CACHE_ENABLED`; tests and local dev keep it off.

## Depends on

- `API-005`: GET /api/maps
- `API-009`: GET /api/phases
- `API-010`: GET /api/sync
- `API-011`: GET /api/overview

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/cache.ts`
- `apps/api/src/middleware/cache.ts` (replace the stub: apply `cacheFor` to the listed routes)
- `apps/api/test/cache.test.ts`

## Contract

```
export function cacheFor(ttlSeconds: number): MiddlewareHandler<{ Bindings: Env }>;
  // if !getConfig(env).cacheEnabled -> next() untouched
  // GET only. Key = request URL. Hit: return cached response with header X-Cache: HIT.
  // Miss: run handler; if status 200 store a copy with Cache-Control: public, max-age=<ttl> and return with X-Cache: MISS.
// Apply: /api/maps -> 3600 s;  /api/phases, /api/sync, /api/overview -> 45 s.  Never /api/time, /api/health, /api/epoch, or POST.
```

## Acceptance criteria

1. With `CACHE_ENABLED = "true"` the first request to `/api/overview` has `X-Cache: MISS` and the second identical request `X-Cache: HIT` (even after the DB changed in between).
2. With `CACHE_ENABLED = "false"` there is no `X-Cache` header and changes show immediately.
3. Non-200 responses are not cached (a 404 twice is MISS twice).
4. `/api/time` and `POST /api/observations` are never cached.
5. Different query strings are cached separately.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-012-edge-cache-for-read-endpoints`; commit message and PR title `API-012: Edge cache for read endpoints`.
