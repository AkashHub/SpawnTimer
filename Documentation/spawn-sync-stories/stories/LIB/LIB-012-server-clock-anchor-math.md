---
id: LIB-012
title: Server clock anchor math
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-001]
branch: story/LIB-012-server-clock-anchor-math
---

# LIB-012: Server clock anchor math

## Context

The browser must express taps in server time. It pings `/api/time` several times; the sample with the lowest round trip is the most trustworthy. These pure functions hold the maths so it is testable without a network.

## Depends on

- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/clock.ts`
- `packages/shared/src/clock.test.ts`

## Contract

```
export interface ClockSample { rttMs: number; perfAtReceiveMs: number; serverNowMs: number }
export interface ClockAnchor { perfMs: number; serverMs: number }
export function pickAnchor(samples: ClockSample[]): ClockAnchor | null;
  // null if empty. Choose min rttMs (ties: the later sample, i.e. higher perfAtReceiveMs).
  // anchor = { perfMs: sample.perfAtReceiveMs, serverMs: sample.serverNowMs + sample.rttMs / 2 }
export function serverTimeAt(anchor: ClockAnchor, perfNowMs: number): number;
  // anchor.serverMs + (perfNowMs - anchor.perfMs), rounded to an integer
```

## Acceptance criteria

1. `pickAnchor([])` is `null`.
2. With samples rtt 120 (perf 1000, server 5000), rtt 40 (perf 2000, server 6000), rtt 80 (perf 3000, server 7000), the anchor is `{ perfMs: 2000, serverMs: 6020 }`.
3. Tie on rtt: the sample with the larger `perfAtReceiveMs` wins.
4. `serverTimeAt({ perfMs: 2000, serverMs: 6020 }, 2500) === 6520`.
5. `serverTimeAt` returns an integer even when the anchor has a fractional `serverMs` (e.g. 6020.5 + 500 -> 6521).

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-012-server-clock-anchor-math`; commit message and PR title `LIB-012: Server clock anchor math`.
