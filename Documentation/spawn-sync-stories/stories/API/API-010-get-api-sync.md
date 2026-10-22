---
id: API-010
title: GET /api/sync
epic: API
priority: must
verification: api
size: M
status: ready
depends_on: [API-003, DB-009, DB-007, DB-006, API-007, LIB-007, API-001]
branch: story/API-010-get-api-sync
---

# API-010: GET /api/sync

## Context

The core feature: given a reference combination, return every other combination within tolerance.

## Depends on

- `API-003`: Request validation helpers
- `DB-009`: Repository: phase estimates
- `DB-007`: Repository: epochs
- `DB-006`: Repository: maps
- `API-007`: Estimate recompute service
- `LIB-007`: Sync match search
- `API-001`: Config parsing and route skeleton

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/sync.ts` (replace the stub)
- `apps/api/test/sync.test.ts`

## Contract

```
// GET /api/sync?mapId=&channel=&tol=300  (SyncQuerySchema)
// 404 UNKNOWN_MAP; 400 INVALID_CHANNEL (channel > channelCount); 404 NO_ESTIMATE if the reference has no estimate in the current epoch
// 200 { epochId, tolMs, reference: NamedEstimate, matches: SyncMatch[] }
// matches = findSyncMatches(reference, allEstimatesAsCombos, tol) mapped to SyncMatch (adds mapName; confidence via rowToEstimateDto)
// All confidences are returned (clients filter).
```

## Acceptance criteria

1. Validates against `SyncResponseSchema`.
2. Seed: ref (map 1, ch 1, phase 3000), (map 2, ch 3, phase 3100), (map 3, ch 1, phase 3250), (map 1, ch 2, phase 3400). With `tol=300` matches are exactly the 3100 and 3250 combos in that order with `distanceMs` 100 and 250.
3. With `tol=500` the 3400 combo is also included (distance 400).
4. Across the wrap: reference phase 100, candidate 9900 is returned with `distanceMs === -200`.
5. `NO_ESTIMATE` when the reference combo has no data; `tol=10` gives 400 `INVALID_QUERY`.
6. Estimates from a previous epoch are ignored.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-010-get-api-sync`; commit message and PR title `API-010: GET /api/sync`.
