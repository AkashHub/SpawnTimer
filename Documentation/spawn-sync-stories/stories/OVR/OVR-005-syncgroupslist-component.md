---
id: OVR-005
title: SyncGroupsList component
epic: OVR
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-010, LIB-013]
branch: story/OVR-005-syncgroupslist-component
---

# OVR-005: SyncGroupsList component

## Context

Lists clusters of combinations that spawn together.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-010`: Response schemas (Zod)
- `LIB-013`: Display formatting helpers

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/SyncGroupsList.tsx`
- `apps/web/src/components/SyncGroupsList.test.tsx`

## Contract

```
// <SyncGroupsList groups={SyncGroup[]} mapNames={Record<number, string>} onHover={(keys: ReadonlySet<string> | null) => void} />
// Each group: <section data-testid={`group-${index}`}> heading `Group ${index + 1}: ~${formatPhase(centerPhaseMs)} (${n} combos, span ${spanMs} ms)`
//   list items `${mapName} ch ${channel}` (fallback `Map ${mapId}`), in the order given.
// Hover or focus on a group calls onHover(new Set(members.map(m => `${m.mapId}-${m.channel}`))); leave/blur calls onHover(null).
// No groups -> data-testid="groups-empty" "No sync groups at this tolerance."
```

## Acceptance criteria

1. A group with center 2400, 3 members, span 120 has heading `Group 1: ~2.40 s (3 combos, span 120 ms)`.
2. Members render as `Map A ch 3` using `mapNames`, with the `Map 9 ch 1` fallback for unknown ids.
3. Hovering a group calls `onHover` with a Set of keys like `"1-3"`; leaving calls `onHover(null)`.
4. Empty array shows `groups-empty`.
5. Groups render in the order given (no re-sorting).

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/OVR-005-syncgroupslist-component`; commit message and PR title `OVR-005: SyncGroupsList component`.
