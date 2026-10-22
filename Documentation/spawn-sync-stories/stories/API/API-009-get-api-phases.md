---
id: API-009
title: GET /api/phases
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [API-003, DB-009, DB-007, DB-006, API-007]
branch: story/API-009-get-api-phases
---

# API-009: GET /api/phases

## Context

Returns the current estimates for every channel of one map (used by the record page and map-level views).

## Depends on

- `API-003`: Request validation helpers
- `DB-009`: Repository: phase estimates
- `DB-007`: Repository: epochs
- `DB-006`: Repository: maps
- `API-007`: Estimate recompute service

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/phases.ts` (replace the stub)
- `apps/api/test/phases.test.ts`

## Contract

```
// GET /api/phases?mapId=1  (PhasesQuerySchema)
// 404 UNKNOWN_MAP if the map does not exist
// 200 { epochId, mapId, estimates: EstimateDto[] }  current epoch only, ordered by channel asc
```

## Acceptance criteria

1. Validates against `PhasesResponseSchema`.
2. A map with no estimates returns `estimates: []` and the current `epochId`.
3. Estimates from an older epoch are not returned after `createEpoch`.
4. Estimates are ordered by channel ascending and include `confidence` computed with `confidenceOf`.
5. Missing `mapId` gives 400 `INVALID_QUERY`; unknown map gives 404 `UNKNOWN_MAP`.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-009-get-api-phases`; commit message and PR title `API-009: GET /api/phases`.
