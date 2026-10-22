---
id: REC-009
title: EstimateCard component
epic: REC
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-010, LIB-013]
branch: story/REC-009-estimatecard-component
---

# REC-009: EstimateCard component

## Context

Shows the current estimate for the selected combination and how much to trust it.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-010`: Response schemas (Zod)
- `LIB-013`: Display formatting helpers

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/EstimateCard.tsx`
- `apps/web/src/components/EstimateCard.test.tsx`

## Contract

```
// <EstimateCard estimate={EstimateDto | null} />
// estimate === null: <p data-testid="estimate-empty">No estimate yet. Record some taps.</p>
// otherwise:
//   data-testid="estimate-phase"   formatPhase(meanPhaseMs)      e.g. "2.40 s"
//   data-testid="estimate-n"       String(n)                      e.g. "12"
//   data-testid="estimate-spread"  `±${spreadMs} ms`
//   data-testid="confidence-badge" text exactly the confidence ("low" | "medium" | "high"), attribute data-confidence, distinct colours
```

## Acceptance criteria

1. `null` renders `estimate-empty` and none of the other test ids.
2. For `{ meanPhaseMs: 2400, n: 12, spreadMs: 41, confidence: "high", ... }` the four fields show `2.40 s`, `12`, `±41 ms`, `high`.
3. `data-confidence` equals the confidence for each of the three values.
4. The component has no internal state or fetching (pure props).

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-009-estimatecard-component`; commit message and PR title `REC-009: EstimateCard component`.
