---
id: LAB-001
title: Period Lab page: tap capture
epic: LAB
priority: must
verification: ui
size: S
status: ready
depends_on: [REC-003, REC-007, INF-008]
branch: story/LAB-001-period-lab-page-tap-capture
---

# LAB-001: Period Lab page: tap capture

## Context

The design assumes a 10.000 s period and stable phases. The Period Lab lets a human test that in game: stand on one map/channel and tap at every spawn for several minutes. This story is capture only and works without the backend (except `/api/time` for clock sync).

## Depends on

- `REC-003`: useServerClock hook
- `REC-007`: TapButton component with Space hotkey
- `INF-008`: Web test harness (Vitest + React Testing Library)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/hooks/useLabTaps.ts`
- `apps/web/src/pages/LabPage.tsx`
- `apps/web/src/pages/LabPage.test.tsx`

## Contract

```
// useLabTaps(serverNow): { taps: number[]; addTap(): boolean; undo(); clear() }  max 500 taps; same rules as useTapSession otherwise.
// LabPage: <h1 data-testid="page-title">Period Lab</h1>; clock-status (same text as the record page); <TapButton max={500} .../>;
//   lab-count (text `${taps.length} taps`); undo-button; lab-clear (button "Clear all", asks window.confirm first);
//   a note: "Local only. Nothing is sent to the server."
```

## Acceptance criteria

1. `/lab` renders the title `Period Lab`, the clock status and the tap button.
2. Tapping is disabled until the clock is ready.
3. Each tap increments `lab-count` (`3 taps`); the cap is 500.
4. `lab-clear` removes taps only after `window.confirm` returns true.
5. No `POST` request is made at any point (test asserts fetch was only called for `/api/time`).

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LAB-001-period-lab-page-tap-capture`; commit message and PR title `LAB-001: Period Lab page: tap capture`.
