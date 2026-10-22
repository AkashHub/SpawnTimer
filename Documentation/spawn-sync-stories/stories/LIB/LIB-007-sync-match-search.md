---
id: LIB-007
title: Sync match search
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-002, LIB-006]
branch: story/LIB-007-sync-match-search
---

# LIB-007: Sync match search

## Context

Given a reference combination, find other combinations whose phase is within a tolerance. The result order is part of the contract so UI and API agree.

## Depends on

- `LIB-002`: Circular distance and mean
- `LIB-006`: Confidence classification

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/sync.ts`
- `packages/shared/src/sync.test.ts`

## Contract

```
export interface Combo {
  mapId: number; channel: number; meanPhaseMs: number;
  confidence: Confidence; n: number; spreadMs: number;
}
export interface SyncMatchCore extends Combo { distanceMs: number }   // signed: diff(candidate, reference)
export function findSyncMatches(
  reference: Pick<Combo, 'mapId' | 'channel' | 'meanPhaseMs'>,
  candidates: Combo[],
  tolMs: number
): SyncMatchCore[];
// Excludes the reference itself (same mapId AND channel). Includes |distanceMs| <= tolMs (inclusive).
// Sort: |distanceMs| asc, then CONFIDENCE_RANK desc, then n desc, then mapId asc, then channel asc.
```

## Acceptance criteria

1. The reference combination is never in the result, even if present in `candidates`.
2. Reference phase 100 with candidates at 300 (ok), 400 (exactly 300 away, included at tol 300), 401 (excluded) and 9900 (200 away across the wrap, included with `distanceMs === -200`).
3. Sorting: two matches with equal |distance| and different confidence put the higher confidence first; with equal confidence the higher `n` first; then lower `mapId`, then lower `channel`.
4. Same-map other channels are included; same channel on other maps are included.
5. `tolMs = 0` returns only exact phase equals (excluding the reference itself).

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-007-sync-match-search`; commit message and PR title `LIB-007: Sync match search`.
