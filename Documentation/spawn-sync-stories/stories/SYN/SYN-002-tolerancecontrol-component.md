---
id: SYN-002
title: ToleranceControl component
epic: SYN
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-001]
branch: story/SYN-002-tolerancecontrol-component
---

# SYN-002: ToleranceControl component

## Context

Tolerance (how many ms apart still counts as "in sync") is user adjustable between 50 and 1000 ms and is reused on the Overview page.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/ToleranceControl.tsx`
- `apps/web/src/components/ToleranceControl.test.tsx`

## Contract

```
// <ToleranceControl value={number} onChange={(n: number) => void} />   uses TOLERANCE_MIN_MS / TOLERANCE_MAX_MS
// data-testid="tol-slider" (input range, step 10) and "tol-input" (input number); both show `value`.
// Typing a number updates only on valid integers; on blur an out-of-range or empty input is clamped to [50, 1000] and reported via onChange.
// Label: "Tolerance (ms)".
```

## Acceptance criteria

1. Both controls display the `value` prop (e.g. 300).
2. Changing the slider to 450 calls `onChange(450)`.
3. Typing `120` in the number input calls `onChange(120)`.
4. Blurring with `5` reports `50`; blurring with `5000` reports `1000`; blurring empty reports `300` (default).
5. `NaN` or non-numeric text never calls `onChange` with `NaN`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SYN-002-tolerancecontrol-component`; commit message and PR title `SYN-002: ToleranceControl component`.
