---
id: LIB-014
title: Period and drift fit
epic: LIB
priority: should
verification: unit
size: S
status: ready
depends_on: [LIB-001]
branch: story/LIB-014-period-and-drift-fit
---

# LIB-014: Period and drift fit

## Context

Used by the Period Lab to test the assumption that spawns happen every exactly 10 000 ms. Each tap belongs to a cycle number k (rounded from its offset to the first tap). A least-squares line through (k, timestamp) has slope = measured period and residuals = tap noise plus drift.

## Depends on

- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/period.ts`
- `packages/shared/src/period.test.ts`

## Contract

```
export interface PeriodFit {
  periodMs: number;        // slope, float
  driftMsPerHour: number;  // (periodMs - 10000) * 360   (360 cycles per hour)
  residualRmsMs: number;   // RMS of residuals
  residualsMs: number[];   // per tap, in ascending-time order: t_i - (intercept + slope * k_i)
  cycles: number;          // number of distinct k values (>= 3 required)
  taps: number;
}
export function fitPeriod(tapsMs: number[], nominalMs: number = 10_000): PeriodFit | null;
  // sort ascending; k_i = Math.round((t_i - t_0) / nominalMs); least squares of t on k;
  // null if fewer than 3 distinct k values.
```

## Acceptance criteria

1. Perfect taps `[0, 10000, 20000, 30000]` give `periodMs === 10000`, `residualRmsMs === 0`, `cycles === 4`.
2. Taps at exactly 10 010 ms spacing (`k * 10010`, k = 0..5) give `periodMs` within 0.001 of 10010 and `driftMsPerHour` within 0.5 of 3600.
3. Fewer than 3 distinct cycles (e.g. `[0, 100, 10000]` has k = 0,0,1) returns `null`.
4. Unsorted input gives the same result as sorted input; `residualsMs.length === taps` and all residuals are 0 for perfect taps.
5. Noise: taps `[0, 10050, 19950, 30000, 40050, 49950]` give `periodMs` within 10 of 10000 and `residualRmsMs` greater than 0 and less than 100.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-014-period-and-drift-fit`; commit message and PR title `LIB-014: Period and drift fit`.
