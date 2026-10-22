---
id: API-004
title: GET /api/time
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [API-002]
branch: story/API-004-get-api-time
---

# API-004: GET /api/time

## Context

Browsers call this several times to estimate their clock offset (see LIB-012). It must be fast and never cached.

## Depends on

- `API-002`: Error handling and 404

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/time.ts` (replace the stub)
- `apps/api/test/time.test.ts`

## Contract

```
// 200  { "serverNow": <integer ms since epoch> }   header: Cache-Control: no-store
```

## Acceptance criteria

1. Status 200; the body validates against `TimeResponseSchema`.
2. With fake timers set to `1_700_000_000_123`, `serverNow === 1_700_000_000_123`.
3. The response has header `Cache-Control: no-store`.
4. Only GET is allowed; `POST /api/time` returns 404 or 405 with the standard error body.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

Useful commands:

```
pnpm dev:api then: curl -i http://localhost:8787/api/time
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-004-get-api-time`; commit message and PR title `API-004: GET /api/time`.
