---
id: LIB-011
title: Deterministic test-data generator
epic: LIB
priority: should
verification: unit
size: S
status: ready
depends_on: [LIB-001]
branch: story/LIB-011-deterministic-test-data-generator
---

# LIB-011: Deterministic test-data generator

## Context

Tests and the dev seeder need realistic noisy taps that are identical on every run. Implement a seeded PRNG and generators.

## Depends on

- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/testdata.ts`
- `packages/shared/src/testdata.test.ts`

## Contract

```
export function mulberry32(seed: number): () => number;   // returns floats in [0,1)
export function generatePhases(opts: { centerMs: number; noiseMs: number; n: number; seed: number }): number[];
  // Gaussian noise (Box-Muller from the PRNG), std dev = noiseMs; integers wrapped into 0..9999
export function generateTaps(opts: {
  centerPhaseMs: number; noiseMs: number; n: number; seed: number; startTsMs: number;
}): number[];
  // tap i = floor(startTsMs / 10000) * 10000 + i * 10000 + centerPhaseMs + noise; integers, ascending order not guaranteed
```

## Acceptance criteria

1. Same seed gives identical output across two calls; different seeds differ.
2. `mulberry32(42)` first three values are produced twice identically and all lie in `[0,1)`.
3. `generatePhases({ centerMs: 2000, noiseMs: 0, n: 5, seed: 1 })` equals `[2000, 2000, 2000, 2000, 2000]`.
4. `generatePhases({ centerMs: 9950, noiseMs: 100, n: 200, seed: 7 })`: all values are integers in 0..9999 and `circMean(...).mean` is within 60 of 9950 (circular).
5. `generateTaps` with `noiseMs: 0, centerPhaseMs: 2000, startTsMs: 1_700_000_001_234, n: 3` has `phaseOf` equal to 2000 for every tap and consecutive taps exactly 10 000 apart.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-011-deterministic-test-data-generator`; commit message and PR title `LIB-011: Deterministic test-data generator`.
