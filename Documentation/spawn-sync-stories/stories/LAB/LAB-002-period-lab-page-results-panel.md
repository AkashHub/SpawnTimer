---
id: LAB-002
title: Period Lab page: results panel
epic: LAB
priority: must
verification: ui
size: S
status: ready
depends_on: [LAB-001, LIB-014]
branch: story/LAB-002-period-lab-page-results-panel
---

# LAB-002: Period Lab page: results panel

## Context

Turns the captured taps into the numbers that validate or break the design assumptions.

## Depends on

- `LAB-001`: Period Lab page: tap capture
- `LIB-014`: Period and drift fit

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/pages/LabPage.tsx`
- `apps/web/src/pages/LabPage.test.tsx`

## Contract

```
// Uses fitPeriod(taps). Fewer than 3 distinct cycles -> data-testid="lab-need-more" "Need taps across at least 3 cycles".
// Otherwise show: lab-period `${periodMs.toFixed(1)} ms`, lab-drift `${driftMsPerHour.toFixed(0)} ms/hour`, lab-rms `${residualRmsMs.toFixed(0)} ms`, lab-cycles `${cycles}`.
// lab-verdict: |periodMs - 10000| <= 5 -> "Consistent with a 10.000 s period"; otherwise "Period differs from 10 s: see docs/FINDINGS.md".
// lab-residuals: SVG with one <circle> per tap (y = residual, clamped to +/-500 ms), x = tap index.
```

## Acceptance criteria

1. With taps at exactly 10 000 ms spacing (mock the clock): `lab-period` shows `10000.0 ms`, `lab-drift` `0 ms/hour`, `lab-verdict` says consistent.
2. With spacing 10 020 ms: `lab-period` shows `10020.0 ms` and the verdict says `Period differs from 10 s`.
3. Fewer than 3 cycles shows `lab-need-more` and none of the result ids.
4. `lab-residuals` contains one circle per tap.
5. Results update live after each tap.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LAB-002-period-lab-page-results-panel`; commit message and PR title `LAB-002: Period Lab page: results panel`.
