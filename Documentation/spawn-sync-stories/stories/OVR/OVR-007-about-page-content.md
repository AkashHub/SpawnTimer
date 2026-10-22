---
id: OVR-007
title: About page content
epic: OVR
priority: should
verification: ui
size: S
status: ready
depends_on: [INF-007, INF-008, LIB-001]
branch: story/OVR-007-about-page-content
---

# OVR-007: About page content

## Context

Explains how to measure well and what the numbers mean. Thresholds are imported from shared constants so the text cannot drift from the code.

## Depends on

- `INF-007`: Web app scaffold with routes and layout
- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/pages/AboutPage.tsx`
- `apps/web/src/pages/AboutPage.test.tsx`

## Contract

```
// Five sections, each <section data-testid="about-section"> with an <h2>: "How it works", "How to record well", "What the numbers mean", "Limitations", "Privacy".
// Text must mention: the 10 second cycle; default tolerance (`${TOLERANCE_DEFAULT_MS} ms`); that high confidence needs `${MIN_N_HIGH} observations`
// and spread under `${MAX_SPREAD_HIGH_MS} ms`; that offsets can change after a server restart; that no accounts or personal data are collected.
// Includes <Link to="/record">Start recording</Link>.
```

## Acceptance criteria

1. Exactly five `about-section` elements with the five headings above.
2. The page text contains `300 ms`, `10 observations`, `120 ms` (derived from the constants).
3. The page states that offsets can change after a server restart.
4. A link with text `Start recording` points to `/record`.
5. Changing a constant in a test via `vi.mock` of the constants module changes the rendered number (proves it is imported, not hard-coded).

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/OVR-007-about-page-content`; commit message and PR title `OVR-007: About page content`.
