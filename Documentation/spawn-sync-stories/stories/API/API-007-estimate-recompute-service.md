---
id: API-007
title: Estimate recompute service
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [DB-008, DB-009, LIB-005, LIB-006, LIB-010]
branch: story/API-007-estimate-recompute-service
---

# API-007: Estimate recompute service

## Context

After new taps are stored, the estimate for that combination is recomputed from the newest `WINDOW` (50) phases, trimmed and averaged, then upserted into the cache table.

## Depends on

- `DB-008`: Repository: observations
- `DB-009`: Repository: phase estimates
- `LIB-005`: Phase estimate from observations
- `LIB-006`: Confidence classification
- `LIB-010`: Response schemas (Zod)

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/estimate.ts`
- `apps/api/test/estimate-service.test.ts`

## Contract

```
export async function recomputeEstimate(
  db: D1Database,
  q: { mapId: number; channel: number; epochId: number; nowMs: number }
): Promise<EstimateDto | null>;
  // phases = getRecentPhases(limit WINDOW); null if none
  // e = estimatePhase(phases); upsertEstimate({... meanPhaseMs: e.meanPhaseMs, r: e.r, spreadMs: e.spreadMs, n: e.n, updatedAt: nowMs})
  // returns EstimateDto including confidence = confidenceOf(e.n, e.spreadMs)
export function rowToEstimateDto(row: EstimateRow): EstimateDto;   // adds confidence
```

## Acceptance criteria

1. With no observations `recomputeEstimate` returns `null` and writes nothing.
2. With 12 observations at phase 2000 the result is `{ meanPhaseMs: 2000, n: 12, spreadMs: 0, confidence: "high", ... }` and the row exists in `phase_estimates`.
3. Only the newest 50 are used: 60 old observations at phase 1000 (created earlier) followed by 50 new at 6000 give `meanPhaseMs === 6000`.
4. An outlier among consistent taps is dropped: 10 at 2000 plus 1 at 7000 gives `n === 10`.
5. Calling twice keeps exactly one estimate row (upsert); `updatedAt` equals `nowMs`.
6. Result validates against `EstimateDtoSchema`.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-007-estimate-recompute-service`; commit message and PR title `API-007: Estimate recompute service`.
