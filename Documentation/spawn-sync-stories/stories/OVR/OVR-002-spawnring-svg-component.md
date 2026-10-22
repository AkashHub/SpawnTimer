---
id: OVR-002
title: SpawnRing SVG component
epic: OVR
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-006, LIB-013]
branch: story/OVR-002-spawnring-svg-component
---

# OVR-002: SpawnRing SVG component

## Context

A circular 10-second clock showing where each combination spawns. Top is 0.0 s, going clockwise. Pure presentational SVG, no libraries.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-006`: Confidence classification
- `LIB-013`: Display formatting helpers

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/SpawnRing.tsx`
- `apps/web/src/components/SpawnRing.test.tsx`

## Contract

```
export interface RingPoint { key: string; label: string; phaseMs: number; confidence: Confidence; groupIndex?: number }
// <SpawnRing points={RingPoint[]} size={number = 320} />
// <svg data-testid="spawn-ring" viewBox="0 0 size size" role="img" aria-label="Spawn phases on a 10 second circle">
// center c = size/2, radius R = size/2 - 30. Track circle at R. Ten ticks (data-testid="ring-tick") at 0..9 s with labels "0s".."9s".
// Dot per point: <circle data-testid="ring-dot" data-key={key} data-phase={phaseMs}> with <title>{label}: {formatPhase(phaseMs)}</title>
//   angle = (phaseMs / 10000) * 2π - π/2;  cx = c + R*cos(angle);  cy = c + R*sin(angle)  (rounded to 2 decimals)
//   opacity: high 1, medium 0.7, low 0.4. Dot radius 6.
```

## Acceptance criteria

1. With `size=320` (center 160, R 130): phase 0 -> `cx=160, cy=30`; 2500 -> `cx=290, cy=160`; 5000 -> `cx=160, cy=290`; 7500 -> `cx=30, cy=160`.
2. Ten `ring-tick` elements are rendered with labels `0s`..`9s`.
3. One `ring-dot` per point with matching `data-key` and `data-phase`; zero points render the ring with no dots.
4. Opacity is 1 / 0.7 / 0.4 for high / medium / low.
5. Each dot has a `<title>` such as `Map A ch 3: 2.40 s`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/OVR-002-spawnring-svg-component`; commit message and PR title `OVR-002: SpawnRing SVG component`.
