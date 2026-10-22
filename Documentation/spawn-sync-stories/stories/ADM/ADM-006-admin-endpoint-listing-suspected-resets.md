---
id: ADM-006
title: Admin endpoint listing suspected resets
epic: ADM
priority: could
verification: api
size: M
status: ready
depends_on: [ADM-002, LIB-015, DB-008, DB-009]
branch: story/ADM-006-admin-endpoint-listing-suspected-resets
---

# ADM-006: Admin endpoint listing suspected resets

## Context

Uses the pure detector from LIB-015 to flag combinations whose newest taps disagree with their history, so an admin can decide to start a new epoch.

## Depends on

- `ADM-002`: POST /api/admin/epoch
- `LIB-015`: Reset suspicion detector
- `DB-008`: Repository: observations
- `DB-009`: Repository: phase estimates

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/db/observations-detail.ts`
- `apps/api/src/routes/admin.ts` (add the route; same file as ADM-002 so it depends on it being merged)
- `apps/api/test/admin-suspects.test.ts`

## Contract

```
// GET /api/admin/suspects   (admin token required)
// For every estimate in the current epoch with n >= 10:
//   recent = newest 10 observations { phaseMs, clientId }; baseline = the 40 before those (phases)
//   result = detectResetSuspicion({ baseline, recent })
// 200 { suspects: [{ mapId, channel, deviating, distinctClients }] }   (only suspected === true)
// observations-detail.ts: getRecentObservations(db, {mapId, channel, epochId, limit, offset}) -> { phaseMs, clientId }[]
```

## Acceptance criteria

1. Requires the admin token (401 otherwise).
2. A combo with 40 baseline taps near 2000 and 10 recent taps near 6000 from 3+ clients appears in `suspects`.
3. A combo whose recent taps agree with its baseline does not appear.
4. A combo with fewer than 50 observations does not appear.
5. Response for no suspects is `{ suspects: [] }`.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/ADM-006-admin-endpoint-listing-suspected-resets`; commit message and PR title `ADM-006: Admin endpoint listing suspected resets`.
