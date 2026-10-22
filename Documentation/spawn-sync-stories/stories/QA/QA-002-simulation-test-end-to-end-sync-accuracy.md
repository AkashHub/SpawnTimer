---
id: QA-002
title: Simulation test: end-to-end sync accuracy
epic: QA
priority: should
verification: api
size: S
status: ready
depends_on: [API-010, API-008, LIB-011]
branch: story/QA-002-simulation-test-end-to-end-sync-accuracy
---

# QA-002: Simulation test: end-to-end sync accuracy

## Context

Proves that noisy human taps still produce the right sync matches. Uses the seeded generator to simulate players tapping three combinations.

## Depends on

- `API-010`: GET /api/sync
- `API-008`: Return the estimate from POST /api/observations
- `LIB-011`: Deterministic test-data generator

## Scope

Files to create or modify (touch nothing else):

- `apps/api/test/simulation.test.ts`

## Contract

```
// Combos: A=(map1, ch1) true phase 3000; B=(map2, ch2) true phase 3150; C=(map3, ch1) true phase 7000.
// Each gets 3 submissions of 10 taps via POST /api/observations using generateTaps({ noiseMs: 80, n: 10, seed: ..., startTsMs: Date.now() })
// (use fake timers so every tap passes the clock-skew check; vary clientId per submission; keep under the rate limit)
```

## Acceptance criteria

1. `GET /api/sync` for A with `tol=300` returns B and not C.
2. B's `distanceMs` is within 80 of 150.
3. Estimates for A, B, C have `n === 30` and `confidence` `high` or `medium`.
4. With `tol=100`, B is no longer a match.
5. The test is deterministic across 5 consecutive runs.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/QA-002-simulation-test-end-to-end-sync-accuracy`; commit message and PR title `QA-002: Simulation test: end-to-end sync accuracy`.
