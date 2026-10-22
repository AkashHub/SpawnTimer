---
id: REC-006
title: useTapSession hook
epic: REC
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-001]
branch: story/REC-006-usetapsession-hook
---

# REC-006: useTapSession hook

## Context

A tap session is the list of taps (server timestamps) the player has made for the selected combination, before submitting.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/hooks/useTapSession.ts`
- `apps/web/src/hooks/useTapSession.test.tsx`

## Contract

```
export function useTapSession(serverNow: () => number | null): {
  taps: number[];
  addTap: () => boolean;     // false (and no change) if serverNow() is null or taps.length >= MAX_TAPS_PER_REQUEST
  undo: () => void;          // removes the last tap (no-op if empty)
  clear: () => void;
  isFull: boolean;
  lastTap: number | null;
};
```

## Acceptance criteria

1. `addTap` appends `serverNow()` rounded to an integer and returns `true`.
2. When `serverNow()` returns `null`, `addTap` returns `false` and `taps` stays empty.
3. After 10 taps `isFull === true` and an 11th `addTap` returns `false`.
4. `undo` removes only the last tap; `clear` empties; `lastTap` tracks the newest or `null`.
5. Two rapid `addTap` calls in one render pass both register (state updates are functional).

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-006-usetapsession-hook`; commit message and PR title `REC-006: useTapSession hook`.
