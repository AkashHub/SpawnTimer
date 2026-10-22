---
id: API-011
title: GET /api/overview
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [API-003, DB-009, DB-007, API-007, LIB-008]
branch: story/API-011-get-api-overview
---

# API-011: GET /api/overview

## Context

One call returns all current estimates plus computed sync groups for the overview page.

## Depends on

- `API-003`: Request validation helpers
- `DB-009`: Repository: phase estimates
- `DB-007`: Repository: epochs
- `API-007`: Estimate recompute service
- `LIB-008`: Sync group clustering

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/overview.ts` (replace the stub)
- `apps/api/test/overview.test.ts`

## Contract

```
// GET /api/overview?tol=300  (OverviewQuerySchema)
// 200 { epochId, tolMs, estimates: NamedEstimate[], groups: SyncGroup[] }
// estimates ordered by mapId, channel; groups = clusterSyncGroups(estimates, tol) (all confidences included)
```

## Acceptance criteria

1. Validates against `OverviewResponseSchema`.
2. Empty database gives `estimates: []`, `groups: []`.
3. Seed phases 1000, 1200, 5000 (three combos) with `tol=300` gives one group of two members (center 1100) and the 5000 combo is in `estimates` only.
4. Default `tol` is 300; `tol=100` splits the 1000/1200 pair (no groups).
5. Estimates from older epochs are excluded.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-011-get-api-overview`; commit message and PR title `API-011: GET /api/overview`.
