---
id: LIB-015
title: Reset suspicion detector
epic: LIB
priority: could
verification: unit
size: S
status: ready
depends_on: [LIB-005]
branch: story/LIB-015-reset-suspicion-detector
---

# LIB-015: Reset suspicion detector

## Context

A server restart may change a combination's phase. If recent taps from several different players all disagree with the long-run estimate, an admin should be told. This is only the pure decision function.

## Depends on

- `LIB-005`: Phase estimate from observations

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/reset.ts`
- `packages/shared/src/reset.test.ts`

## Contract

```
export const RESET_DEVIATION_MS = 1000;
export function detectResetSuspicion(input: {
  baseline: number[];                                   // older phases
  recent: { phaseMs: number; clientId: string }[];      // newest observations
}): { suspected: boolean; deviating: number; distinctClients: number };
// suspected = baseline.length >= 10 && recent.length >= 5
//   && deviating / recent.length >= 0.8 && distinctClients (among deviating) >= 3
// deviating = recent whose |diff(phase, estimatePhase(baseline).meanPhaseMs)| > RESET_DEVIATION_MS
```

## Acceptance criteria

1. Baseline of 12 phases near 2000 and 5 recent phases near 6000 from 3 distinct clients: `suspected === true`.
2. Same recent phases from only 2 distinct clients: `suspected === false`.
3. Baseline of 9 phases: `suspected === false` regardless of recent.
4. Recent phases near 2000 (agreeing with baseline): `deviating === 0`, `suspected === false`.
5. Wrap-around: baseline near 9900/100 and recent near 100: not deviating.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-015-reset-suspicion-detector`; commit message and PR title `LIB-015: Reset suspicion detector`.
