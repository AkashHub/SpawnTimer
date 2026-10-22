---
id: REC-007
title: TapButton component with Space hotkey
epic: REC
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-013]
branch: story/REC-007-tapbutton-component-with-space-hotkey
---

# REC-007: TapButton component with Space hotkey

## Context

The tap button is the core control. It must register exactly one tap per click or Space press, work for keyboard-only use, and never double-fire.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-013`: Display formatting helpers

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/TapButton.tsx`
- `apps/web/src/components/TapButton.test.tsx`

## Contract

```
// <TapButton onTap={() => void} disabled={boolean} count={number} max={number} lastTapTs={number | null} />
// data-testid: "tap-button" (the <button>, text "Tap (Space)"), "tap-count" (text `${count}/${max}`, aria-live="polite"),
//              "last-tap" (formatSecondOfMinute(lastTapTs) or "-")
// Window keydown for Space (event.code === 'Space') calls onTap once, preventDefault, ignores event.repeat,
// and is ignored when event.target is input/select/textarea/[contenteditable] or when disabled or count >= max.
// The button swallows its own Space/Enter keyup default so keyboard activation cannot also fire a click.
```

## Acceptance criteria

1. A mouse click calls `onTap` once.
2. With the button focused, pressing Space calls `onTap` exactly once (not twice).
3. Pressing Space with focus in a text input or select does not call `onTap`.
4. Holding Space (repeat events) calls `onTap` once.
5. `disabled` or `count >= max` prevents both click and Space.
6. `tap-count` shows `3/10` for `count=3,max=10` and `last-tap` shows `:12.4` for `lastTapTs=72400`, `-` for `null`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-007-tapbutton-component-with-space-hotkey`; commit message and PR title `REC-007: TapButton component with Space hotkey`.
