---
id: LIB-001
title: Constants and phaseOf
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [INF-003]
branch: story/LIB-001-constants-and-phaseof
---

# LIB-001: Constants and phaseOf

## Context

The spawn cycle is 10 000 ms. A "phase" is where inside that cycle a timestamp falls. All tunables live in one constants file so every package agrees.

## Depends on

- `INF-003`: Vitest setup for the shared package

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/constants.ts`
- `packages/shared/src/phase.ts`
- `packages/shared/src/phase.test.ts`

## Contract

```
// constants.ts
export const PERIOD_MS = 10_000;
export const TOLERANCE_DEFAULT_MS = 300;
export const TOLERANCE_MIN_MS = 50;
export const TOLERANCE_MAX_MS = 1000;
export const WINDOW = 50;                 // newest observations per estimate
export const OUTLIER_MS = 500;
export const MAX_TAPS_PER_REQUEST = 10;
export const MAX_CLOCK_SKEW_MS = 30_000;
export const MIN_N_MEDIUM = 5;
export const MIN_N_HIGH = 10;
export const MAX_SPREAD_MEDIUM_MS = 250;
export const MAX_SPREAD_HIGH_MS = 120;

// phase.ts
export function phaseOf(tsMs: number): number;   // integer 0..9999; throws RangeError if !Number.isFinite(tsMs)
```

## Acceptance criteria

1. `phaseOf(12_000) === 2000`.
2. `phaseOf(1_700_000_012_345) === 2345`.
3. `phaseOf(10_000) === 0` and `phaseOf(9_999) === 9999`.
4. `phaseOf(-1) === 9999` (negative inputs wrap).
5. `phaseOf(NaN)` and `phaseOf(Infinity)` throw `RangeError`.
6. All constants exist with the exact values above (a test asserts them).

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-001-constants-and-phaseof`; commit message and PR title `LIB-001: Constants and phaseOf`.
