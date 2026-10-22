---
id: LIB-005
title: Phase estimate from observations
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-004, LIB-002]
branch: story/LIB-005-phase-estimate-from-observations
---

# LIB-005: Phase estimate from observations

## Context

An estimate combines trimming and circular averaging into the integer values we store: mean phase, concentration `r`, spread (ms) and the number of observations actually used.

## Depends on

- `LIB-004`: Outlier trimming
- `LIB-002`: Circular distance and mean

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/estimate.ts`
- `packages/shared/src/estimate.test.ts`

## Contract

```
export interface PhaseEstimate {
  meanPhaseMs: number;   // integer 0..9999 (round; 10000 becomes 0)
  r: number;             // 0..1
  spreadMs: number;      // integer, rounded
  n: number;             // observations kept after trimming
  dropped: number;       // observations trimmed
}
export function estimatePhase(phases: number[]): PhaseEstimate | null;   // null if phases is empty
```

## Acceptance criteria

1. `estimatePhase([])` is `null`.
2. `estimatePhase([2000, 2000, 2000])` has `meanPhaseMs: 2000`, `spreadMs: 0`, `n: 3`, `dropped: 0`, and `r` within 1e-9 of 1.
3. `estimatePhase([9900, 100])` has `meanPhaseMs` equal to `0` (rounded and wrapped) and `n === 2`.
4. `estimatePhase([1000, 1100, 900, 6000])` drops the 6000: `n === 3`, `dropped === 1`, `meanPhaseMs === 1000`.
5. `meanPhaseMs` is always an integer in `[0, 9999]` (property check over 100 seeded random inputs; use a small inline PRNG here, not LIB-011).

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-005-phase-estimate-from-observations`; commit message and PR title `LIB-005: Phase estimate from observations`.
