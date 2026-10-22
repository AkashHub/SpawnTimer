---
id: API-008
title: Return the estimate from POST /api/observations
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [API-006, API-007]
branch: story/API-008-return-the-estimate-from-post-api
---

# API-008: Return the estimate from POST /api/observations

## Context

Players want to see the updated estimate right after submitting. Replace the interim response.

## Depends on

- `API-006`: POST /api/observations: validate and persist
- `API-007`: Estimate recompute service

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/observations.ts`
- `apps/api/test/observations.test.ts`

## Contract

```
// After insertObservations: estimate = recomputeEstimate(db, { mapId, channel, epochId, nowMs: Date.now() })
// 200  { "accepted": n, "estimate": EstimateDto }     (validates against ObservationResponseSchema)
```

## Acceptance criteria

1. A valid submission returns a body that validates against `ObservationResponseSchema`.
2. Submitting 5 taps at phase 3000 (all within 50 ms) to an empty combo returns `estimate.n === 5`, `estimate.meanPhaseMs` within 50 of 3000 and `confidence === "medium"`.
3. Submitting again adds to the estimate (`n` grows; 5 more taps -> `n === 10`).
4. `GET`-style reads of the table `phase_estimates` show the same values as the response.
5. Existing validation tests from API-006 still pass unchanged apart from the response shape.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-008-return-the-estimate-from-post-api`; commit message and PR title `API-008: Return the estimate from POST /api/observations`.
