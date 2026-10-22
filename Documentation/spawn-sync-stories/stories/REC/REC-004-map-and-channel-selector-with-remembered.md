---
id: REC-004
title: Map and channel selector with remembered choice
epic: REC
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-010]
branch: story/REC-004-map-and-channel-selector-with-remembered
---

# REC-004: Map and channel selector with remembered choice

## Context

Players repeat the same map/channel often, so the last choice is remembered in `localStorage` (guarded: storage can throw or be empty).

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-010`: Response schemas (Zod)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/MapChannelSelect.tsx`
- `apps/web/src/hooks/useSelection.ts`
- `apps/web/src/components/MapChannelSelect.test.tsx`
- `apps/web/src/hooks/useSelection.test.tsx`

## Contract

```
export interface Selection { mapId: number | null; channel: number | null }
// <MapChannelSelect maps={MapDto[]} channelCount={number} value={Selection} onChange={(s: Selection) => void} />
//   <select data-testid="map-select" aria-label="Map">  first option value "" text "Select map", then one option per map
//   <select data-testid="channel-select" aria-label="Channel"> first option "" text "Select channel", then "Ch 1".."Ch N"
//   Changing the map keeps the channel; clearing the map sets both to null.
export function useSelection(maps: MapDto[], channelCount: number): [Selection, (s: Selection) => void];
//   localStorage key 'ss_last_selection' = JSON {mapId, channel}. On load, a stored value is used only if the map exists
//   in `maps` and 1 <= channel <= channelCount, otherwise null/null. All storage access in try/catch.
```

## Acceptance criteria

1. Renders one option per map plus the placeholder; `Ch 1`..`Ch 20` for `channelCount 20`.
2. Selecting a map calls `onChange` with the numeric id (not a string) and keeps the current channel.
3. `useSelection` restores a valid stored choice and ignores an invalid one (unknown map id, channel 99).
4. Selecting persists to `localStorage["ss_last_selection"]`.
5. If `localStorage` throws on read and write, the hook still works in memory (no exception).

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-004-map-and-channel-selector-with-remembered`; commit message and PR title `REC-004: Map and channel selector with remembered choice`.
