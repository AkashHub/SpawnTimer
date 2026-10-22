---
id: API-006
title: POST /api/observations: validate and persist
epic: API
priority: must
verification: api
size: M
status: ready
depends_on: [API-003, API-001, DB-008, LIB-001]
branch: story/API-006-post-api-observations-validate-and
---

# API-006: POST /api/observations: validate and persist

## Context

Players submit 1 to 10 taps (timestamps in server time). The server validates, computes each phase itself with `phaseOf`, stores the rows in the current epoch, and returns how many it accepted. Estimates arrive in API-007/008, so the interim response is `{ accepted }`.

## Depends on

- `API-003`: Request validation helpers
- `API-001`: Config parsing and route skeleton
- `DB-008`: Repository: observations
- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/observations.ts` (replace the stub)
- `apps/api/test/observations.test.ts`

## Contract

```
// Body: ObservationRequestSchema.  Order of checks:
// 1. parseJsonBody -> 400 INVALID_BODY
// 2. getMapById -> 404 UNKNOWN_MAP (message "Unknown map")
// 3. channel > getConfig(env).channelCount -> 400 INVALID_CHANNEL
// 4. any |tap - Date.now()| > MAX_CLOCK_SKEW_MS -> 400 CLOCK_SKEW
// 5. epoch = getCurrentEpoch; rows = taps.map(t => ({ mapId, channel, serverTsMs: t, phaseMs: phaseOf(t), clientId, epochId: epoch.id, createdAt: Date.now() }))
//    insertObservations(db, rows)
// 200 { "accepted": taps.length }     (interim; replaced in API-008)
```

## Acceptance criteria

1. A valid request with 3 taps returns 200 `{ accepted: 3 }` and 3 rows exist with correct `phase_ms` (e.g. tap `1_700_000_002_000` -> 2000) and `epoch_id = 1`.
2. Unknown `mapId` returns 404 `UNKNOWN_MAP` and stores nothing.
3. With `MAX_CHANNEL` 20, `channel: 21` returns 400 `INVALID_CHANNEL`.
4. A tap 31 s from now returns 400 `CLOCK_SKEW` and stores nothing; a tap exactly 30 s away is accepted.
5. A body failing the schema (e.g. 11 taps) returns 400 `INVALID_BODY` and stores nothing.
6. `created_at` equals the (fake) current time in ms.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

Useful commands:

```
pnpm dev:api then POST with curl using a tap of $(date +%s%3N)
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-006-post-api-observations-validate-and`; commit message and PR title `API-006: POST /api/observations: validate and persist`.
