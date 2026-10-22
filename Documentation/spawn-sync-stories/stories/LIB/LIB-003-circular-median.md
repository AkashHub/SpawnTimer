---
id: LIB-003
title: Circular median
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-002]
branch: story/LIB-003-circular-median
---

# LIB-003: Circular median

## Context

To find outliers we need a robust centre on the circle. Define the circular median as the input value that minimizes the sum of absolute circular distances to all inputs; ties go to the smallest value.

## Depends on

- `LIB-002`: Circular distance and mean

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/median.ts`
- `packages/shared/src/median.test.ts`

## Contract

```
export function circMedian(phases: number[]): number | null;   // null for empty input
```

## Acceptance criteria

1. `circMedian([])` is `null`; `circMedian([700])` is `700`.
2. `circMedian([100, 200, 300]) === 200`.
3. `circMedian([9900, 100, 200]) === 100` (wrap-around: sums are 500, 300, 400).
4. `circMedian([0, 1000]) === 0` (tie goes to the smallest value).
5. The input array is not mutated.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-003-circular-median`; commit message and PR title `LIB-003: Circular median`.
