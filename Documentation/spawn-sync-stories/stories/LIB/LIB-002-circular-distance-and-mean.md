---
id: LIB-002
title: Circular distance and mean
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-001]
branch: story/LIB-002-circular-distance-and-mean
---

# LIB-002: Circular distance and mean

## Context

Phases sit on a 10 000 ms circle: 9 900 and 100 are 200 ms apart, so ordinary averaging is wrong. `diff` gives the signed shortest distance; `circMean` averages with unit vectors.

## Depends on

- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/circular.ts`
- `packages/shared/src/circular.test.ts`

### Out of scope

- Median and outlier trimming (LIB-003, LIB-004).

## Contract

```
export function diff(a: number, b: number): number;
  // signed shortest distance from b to a, in (-5000, 5000]. Reference implementation:
  //   let d = (((a - b) % P) + P) % P;  if (d > P / 2) d -= P;  return d;
export interface CircStats { mean: number; r: number; spread: number; n: number }
export function circMean(phases: number[]): CircStats | null;
  // null for empty input
  // mean: float in [0, 10000)
  // r: resultant length in [0,1] (clamp to 1 for float error)
  // spread = sqrt(-2*ln(r)) * (PERIOD_MS / (2*PI)); 0 when r >= 1; 5000 when r <= 1e-9
```

## Acceptance criteria

1. `diff(100, 9900) === 200` and `diff(9900, 100) === -200`.
2. `diff(5000, 0) === 5000` and `diff(0, 5000) === 5000` (the antipode maps to +5000 in both directions).
3. `circMean([])` is `null`.
4. `circMean([9900, 100])`: `mean` is within 1 of 0 or 10000 (i.e. `Math.min(mean, 10000 - mean) < 1`), `r` within 0.001 of 0.9980 (it is cos(pi/50)), `n === 2`.
5. `circMean([0, 5000])`: `r < 0.01` and `spread === 5000`.
6. `circMean([1234, 1234, 1234])`: `mean` within 0.001 of 1234, `r` within 1e-9 of 1, `spread < 0.01`.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-002-circular-distance-and-mean`; commit message and PR title `LIB-002: Circular distance and mean`.
