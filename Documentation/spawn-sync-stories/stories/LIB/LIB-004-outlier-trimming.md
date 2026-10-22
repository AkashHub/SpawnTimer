---
id: LIB-004
title: Outlier trimming
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-003, LIB-001]
branch: story/LIB-004-outlier-trimming
---

# LIB-004: Outlier trimming

## Context

Taps by humans occasionally miss by a second or more. We drop phases farther than `OUTLIER_MS` (500) from the circular median before averaging.

## Depends on

- `LIB-003`: Circular median
- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/trim.ts`
- `packages/shared/src/trim.test.ts`

## Contract

```
export function trimOutliers(
  phases: number[],
  thresholdMs: number = OUTLIER_MS
): { kept: number[]; dropped: number[] };   // original order preserved; keep when |diff(p, median)| <= thresholdMs
```

## Acceptance criteria

1. `trimOutliers([])` returns `{ kept: [], dropped: [] }`.
2. `trimOutliers([1000, 1100, 1050, 4000])` keeps `[1000, 1100, 1050]` and drops `[4000]`.
3. Wrap-around: `trimOutliers([9900, 100, 50, 5000])` keeps `[9900, 100, 50]` and drops `[5000]`.
4. Boundary (median is 1000 in both cases): `trimOutliers([1000, 1000, 1500])` keeps all three; `trimOutliers([1000, 1000, 1501])` drops `[1501]`.
5. A custom threshold is honored: `trimOutliers([1000, 1100, 1300], 150)` drops `[1300]` and keeps `[1000, 1100]` (median 1100; |1300-1100| = 200 > 150).

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-004-outlier-trimming`; commit message and PR title `LIB-004: Outlier trimming`.
