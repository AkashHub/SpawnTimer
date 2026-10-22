---
id: OVR-003
title: SpawnRing interactions: tooltip, highlight, select
epic: OVR
priority: should
verification: ui
size: S
status: ready
depends_on: [OVR-002]
branch: story/OVR-003-spawnring-interactions-tooltip-highlight
---

# OVR-003: SpawnRing interactions: tooltip, highlight, select

## Context

Dots are small; players need to identify them by hover, focus or tap, and the page needs to highlight a group's dots.

## Depends on

- `OVR-002`: SpawnRing SVG component

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/SpawnRing.tsx`
- `apps/web/src/components/SpawnRing.test.tsx`

## Contract

```
// New optional props: highlightKeys?: ReadonlySet<string>; onSelect?: (key: string) => void
// Dots get tabIndex={0}, role="button". Hover or focus shows <g data-testid="ring-tooltip"> with `${label}`, formatPhase, and confidence text; mouseleave/blur/Escape hides it.
// Dots in highlightKeys get r=9 and data-highlighted="true"; if highlightKeys is non-empty, dots NOT in it get opacity 0.2.
// Click or Enter/Space on a dot calls onSelect(key).
```

## Acceptance criteria

1. Hovering a dot shows `ring-tooltip` with the label, `2.40 s` and the confidence; leaving hides it.
2. Focusing a dot with the keyboard shows the tooltip; pressing Escape hides it.
3. `highlightKeys={new Set(["a"])}` makes dot `a` radius 9 with `data-highlighted="true"` and dims the others to opacity 0.2.
4. Click and Enter on a dot each call `onSelect` with its key once.
5. Existing OVR-002 tests still pass.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/OVR-003-spawnring-interactions-tooltip-highlight`; commit message and PR title `OVR-003: SpawnRing interactions: tooltip, highlight, select`.
