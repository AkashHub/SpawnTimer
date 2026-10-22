---
id: LIB-006
title: Confidence classification
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-001]
branch: story/LIB-006-confidence-classification
---

# LIB-006: Confidence classification

## Context

Players need to know how much to trust an estimate. Confidence depends on how many observations and how tightly they cluster.

## Depends on

- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/confidence.ts`
- `packages/shared/src/confidence.test.ts`

## Contract

```
export type Confidence = 'low' | 'medium' | 'high';
export function confidenceOf(n: number, spreadMs: number): Confidence;
  // low    if n < MIN_N_MEDIUM or spreadMs > MAX_SPREAD_MEDIUM_MS
  // high   if n >= MIN_N_HIGH and spreadMs < MAX_SPREAD_HIGH_MS
  // medium otherwise
export const CONFIDENCE_RANK: Record<Confidence, number>;   // high 3, medium 2, low 1
```

## Acceptance criteria

1. `confidenceOf(4, 10) === "low"`; `confidenceOf(20, 300) === "low"`.
2. `confidenceOf(5, 250) === "medium"` (both boundaries inclusive for medium).
3. `confidenceOf(10, 119) === "high"`; `confidenceOf(10, 120) === "medium"`; `confidenceOf(9, 50) === "medium"`.
4. `CONFIDENCE_RANK` is `{ high: 3, medium: 2, low: 1 }`.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-006-confidence-classification`; commit message and PR title `LIB-006: Confidence classification`.
