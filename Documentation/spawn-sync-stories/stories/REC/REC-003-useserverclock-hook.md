---
id: REC-003
title: useServerClock hook
epic: REC
priority: must
verification: ui
size: M
status: ready
depends_on: [REC-001, LIB-012]
branch: story/REC-003-useserverclock-hook
---

# REC-003: useServerClock hook

## Context

Taps must be expressed in server time. The hook takes 5 samples on mount, picks the best anchor (LIB-012), exposes `serverNow()`, and re-syncs every 5 minutes.

## Depends on

- `REC-001`: Web API client core and time sampler
- `LIB-012`: Server clock anchor math

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/hooks/useServerClock.ts`
- `apps/web/src/hooks/useServerClock.test.tsx`

## Contract

```
export interface ServerClock {
  status: 'syncing' | 'ready' | 'error';
  rttMs: number | null;                  // rtt of the chosen anchor sample
  serverNow: () => number | null;        // serverTimeAt(anchor, performance.now()); null until ready
  resync: () => Promise<void>;
}
export function useServerClock(opts?: {
  samples?: number;                      // default 5
  resyncMs?: number;                     // default 300_000
  sampler?: () => Promise<ClockSample>;  // default getClockSample (injectable for tests)
}): ServerClock;
// Samples are taken sequentially. If every sample fails -> status 'error' (keep an existing anchor if one exists and stay 'ready').
// The interval is cleared on unmount.
```

## Acceptance criteria

1. Initially `status === "syncing"` and `serverNow()` is `null`; after samples resolve `status === "ready"`.
2. With samples rtt 120/40/80 the chosen `rttMs` is 40.
3. `serverNow()` advances with `performance.now()` (stub it): anchor at perf 2000/server 6020, perf now 2500 gives 6520.
4. When all samples reject, `status === "error"`.
5. After 5 minutes of fake time a second round of samples is taken; unmounting stops the timer (no further sampler calls).
6. `sampler` is called exactly `samples` times per sync.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-003-useserverclock-hook`; commit message and PR title `REC-003: useServerClock hook`.
