---
id: LIB-013
title: Display formatting helpers
epic: LIB
priority: should
verification: unit
size: S
status: ready
depends_on: [LIB-001]
branch: story/LIB-013-display-formatting-helpers
---

# LIB-013: Display formatting helpers

## Context

Players compare our numbers with what they see in game, so formatting must be predictable.

## Depends on

- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/format.ts`
- `packages/shared/src/format.test.ts`

## Contract

```
export function formatPhase(phaseMs: number): string;
  // seconds into the 10 s cycle, floored to centiseconds: 2400 -> "2.40 s", 0 -> "0.00 s", 9999 -> "9.99 s"
export function formatSecondOfMinute(tsMs: number): string;
  // second within the UTC minute with one decimal (floor), zero padded: 72_400 -> ":12.4", 65_300 -> ":05.3", 0 -> ":00.0"
export function formatSignedMs(ms: number): string;
  // "+200 ms", "-200 ms", "0 ms"
```

## Acceptance criteria

1. `formatPhase(2400) === "2.40 s"`, `formatPhase(0) === "0.00 s"`, `formatPhase(9999) === "9.99 s"`.
2. `formatSecondOfMinute(72_400) === ":12.4"`, `formatSecondOfMinute(65_300) === ":05.3"`, `formatSecondOfMinute(0) === ":00.0"`.
3. `formatSecondOfMinute(59_999) === ":59.9"` (floor, never rounds up to 60).
4. `formatSignedMs(200) === "+200 ms"`, `formatSignedMs(-200) === "-200 ms"`, `formatSignedMs(0) === "0 ms"`.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-013-display-formatting-helpers`; commit message and PR title `LIB-013: Display formatting helpers`.
