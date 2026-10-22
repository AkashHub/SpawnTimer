---
id: LIB-008
title: Sync group clustering
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-002]
branch: story/LIB-008-sync-group-clustering
---

# LIB-008: Sync group clustering

## Context

For the overview we want clusters of combinations that sit within tolerance of their neighbours (single linkage) on the circle, including across the 9999-to-0 wrap. Groups with a single member are not interesting and are omitted.

## Depends on

- `LIB-002`: Circular distance and mean

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/groups.ts`
- `packages/shared/src/groups.test.ts`

## Contract

```
export interface GroupItem { mapId: number; channel: number; meanPhaseMs: number }
export interface SyncGroupCore {
  members: { mapId: number; channel: number; meanPhaseMs: number }[];  // in circular order starting at the group's start
  centerPhaseMs: number;   // integer, rounded circMean of members, wrapped into 0..9999
  spanMs: number;          // circular distance from first to last member, integer
}
export function clusterSyncGroups(items: GroupItem[], tolMs: number, minSize = 2): SyncGroupCore[];
// Sort items by phase; neighbours join when the gap <= tolMs; merge last and first clusters across the wrap when
// (first + 10000 - last) <= tolMs. If every gap (including wrap) is <= tolMs the whole set is one group that starts
// just after the largest gap. Output sorted by member count desc, then centerPhaseMs asc.
```

## Acceptance criteria

1. `[]` input returns `[]`; one item returns `[]` (below `minSize`).
2. Phases `[1000, 1200, 5000, 5100, 8000]` at tol 300 give two groups: members at 1000/1200 (span 200, center 1100) and 5000/5100 (span 100, center 5050); 8000 is excluded.
3. Wrap: phases `[100, 300, 9900]` at tol 300 give ONE group with members ordered `9900, 100, 300`, `spanMs === 400`, `centerPhaseMs` within 1 of 100.
4. Chaining: phases `[0, 250, 500]` at tol 300 give ONE group with `spanMs === 500` (single linkage).
5. Full circle: phases `[0, 2500, 5000, 7500]` at tol 2500 give one group with 4 members.
6. Ordering: a 3-member group sorts before a 2-member group.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-008-sync-group-clustering`; commit message and PR title `LIB-008: Sync group clustering`.
