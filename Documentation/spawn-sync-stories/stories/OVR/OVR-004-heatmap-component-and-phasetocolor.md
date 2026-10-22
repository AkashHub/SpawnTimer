---
id: OVR-004
title: Heatmap component and phaseToColor
epic: OVR
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-006, LIB-013]
branch: story/OVR-004-heatmap-component-and-phasetocolor
---

# OVR-004: Heatmap component and phaseToColor

## Context

A grid of maps (rows) by channels (columns), each cell coloured by phase, so rows of similar colours reveal sync at a glance.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-006`: Confidence classification
- `LIB-013`: Display formatting helpers

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/lib/phaseColor.ts`
- `apps/web/src/components/Heatmap.tsx`
- `apps/web/src/lib/phaseColor.test.ts`, `apps/web/src/components/Heatmap.test.tsx`

## Contract

```
// phaseColor.ts
export function phaseToColor(phaseMs: number): string;   // `hsl(${Math.round(phaseMs / 10000 * 360)}, 70%, 50%)`
// Heatmap.tsx
// <Heatmap maps={{ id: number; name: string }[]} channelCount={number} estimates={{ mapId; channel; meanPhaseMs; confidence }[]} />
// <table data-testid="heatmap">; header cells "Ch 1".."Ch N"; row header = map name.
// Cell: data-testid={`heat-${mapId}-${channel}`}; with an estimate: style background = phaseToColor, text = formatPhase(meanPhaseMs), data-confidence;
//   without: data-empty="true", text "-", no background colour.
// Wrapper has overflow-x-auto so wide tables scroll inside it.
```

## Acceptance criteria

1. `phaseToColor(0) === "hsl(0, 70%, 50%)"`, `phaseToColor(2500) === "hsl(90, 70%, 50%)"`, `phaseToColor(5000) === "hsl(180, 70%, 50%)"`.
2. A 2-map by 3-channel grid renders 6 cells plus correct headers.
3. A cell with phase 2400 shows `2.40 s` and the matching background colour.
4. Combos without estimates render `data-empty="true"` and `-`.
5. Two cells with phases 3000 and 3100 have colours whose hues differ by 4 degrees or less.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/OVR-004-heatmap-component-and-phasetocolor`; commit message and PR title `OVR-004: Heatmap component and phaseToColor`.
