---
id: SEC-002
title: Per-client submission rate limit
epic: SEC
priority: should
verification: api
size: S
status: ready
depends_on: [SEC-001, API-008]
branch: story/SEC-002-per-client-submission-rate-limit
---

# SEC-002: Per-client submission rate limit

## Context

Without limits one client could flood the table. Allow at most 60 taps per client per rolling 60 seconds.

## Depends on

- `SEC-001`: Index for per-client rate limiting
- `API-008`: Return the estimate from POST /api/observations

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/db/ratelimit.ts`
- `apps/api/src/lib/ratelimit.ts`
- `apps/api/src/routes/observations.ts` (call the limiter after body validation, before insert)
- `apps/api/test/ratelimit.test.ts`

## Contract

```
export const RATE_LIMIT_TAPS = 60;
export const RATE_LIMIT_WINDOW_MS = 60_000;
// db/ratelimit.ts: countRecentByClient(db, clientId, sinceMs): Promise<number>
// lib/ratelimit.ts: assertWithinClientLimit(db, clientId, incomingTaps, nowMs): Promise<void>
//   if existing + incoming > RATE_LIMIT_TAPS -> ApiError(429, 'RATE_LIMITED', 'Too many submissions', { retryAfterSeconds: 60 }) and set header Retry-After: 60
```

## Acceptance criteria

1. A client with 55 taps in the last 60 s submitting 5 more is accepted (total 60); submitting 6 more returns 429 `RATE_LIMITED` with header `Retry-After: 60` and stores nothing.
2. After advancing fake time by 61 s the same client can submit again.
3. Limits are per `clientId`: a different client is unaffected.
4. Rejected requests do not create observation rows or estimates.
5. Normal 10-tap submissions by a fresh client are unaffected.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-002-per-client-submission-rate-limit`; commit message and PR title `SEC-002: Per-client submission rate limit`.
