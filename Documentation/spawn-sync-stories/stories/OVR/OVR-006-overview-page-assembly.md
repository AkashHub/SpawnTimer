---
id: OVR-006
title: Overview page assembly
epic: OVR
priority: must
verification: ui
size: M
status: ready
depends_on: [OVR-001, OVR-003, OVR-004, OVR-005, SYN-002, REC-002, INF-009]
branch: story/OVR-006-overview-page-assembly
---

# OVR-006: Overview page assembly

## Context

Compose the overview: tolerance control, optional map filter, ring, heatmap and sync groups.

## Depends on

- `OVR-001`: Overview client and hook
- `OVR-003`: SpawnRing interactions: tooltip, highlight, select
- `OVR-004`: Heatmap component and phaseToColor
- `OVR-005`: SyncGroupsList component
- `SYN-002`: ToleranceControl component
- `REC-002`: Maps client and useMaps hook
- `INF-009`: Playwright end-to-end harness

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/pages/OverviewPage.tsx`
- `apps/web/src/pages/OverviewPage.test.tsx`
- `apps/web/e2e/overview.spec.ts`

## Contract

```
// State: tol (default 300, local state), map filter <select data-testid="overview-map-filter"> ("All maps" + maps that have estimates).
// Data: useOverview(tol) and useMaps(). Ring points: one per estimate (key `${mapId}-${channel}`, label `${mapName} ch ${channel}`), after the map filter.
// Heatmap: all maps from useMaps with channelCount; all estimates (not filtered).
// Groups: SyncGroupsList with onHover wired to the ring's highlightKeys.
// States: loading "overview-loading"; error "overview-error"; no estimates "overview-empty" "No data yet. Record some spawns first."
```

## Acceptance criteria

1. With 3 mocked estimates the ring has 3 `ring-dot` elements and the heatmap has the matching filled cells.
2. Changing the map filter to one map reduces the ring dots to that map only, heatmap unchanged.
3. Changing tolerance triggers a request with the new `tol` and re-renders the groups.
4. Hovering a group highlights exactly its member dots (`data-highlighted="true"`).
5. Empty estimates show `overview-empty`; a mocked 500 shows `overview-error`.
6. Playwright (`overview.spec.ts`, mocked API) covers: dots count, filter, tolerance change.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/OVR-006-overview-page-assembly`; commit message and PR title `OVR-006: Overview page assembly`.
