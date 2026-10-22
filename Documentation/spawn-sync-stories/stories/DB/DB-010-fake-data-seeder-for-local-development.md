---
id: DB-010
title: Fake-data seeder for local development
epic: DB
priority: should
verification: infra
size: M
status: ready
depends_on: [LIB-005, LIB-011, DB-005, DB-004, DB-007]
branch: story/DB-010-fake-data-seeder-for-local-development
---

# DB-010: Fake-data seeder for local development

## Context

UI work needs data. This script generates deterministic fake observations and the matching estimates, writes SQL, and loads it into the local D1. It must never run against the remote database.

## Depends on

- `LIB-005`: Phase estimate from observations
- `LIB-011`: Deterministic test-data generator
- `DB-005`: Map seed data and idempotent seed script
- `DB-004`: Phase estimates table
- `DB-007`: Repository: epochs

## Scope

Files to create or modify (touch nothing else):

- `scripts/seed-fake.ts` (run with `tsx`; add `tsx` as a root devDependency)
- Root `package.json`: script `db:seed:fake:local`
- `apps/api/package.json`: script `db:seed:fake:local`

## Contract

```
// Combos: maps 1..3, channels 1..6. Phase for (map m, channel c) = (m * 1300 + c * 1700) % 10000, except make
// map 2 channel 3 and map 3 channel 1 share exactly the same phase as map 1 channel 1 (so a sync group exists).
// For each combo: 30 phases from generatePhases({ centerMs, noiseMs: 80, n: 30, seed: m * 100 + c }).
// Observations: epoch = current (1), clientId = "fake-client-" + (i % 5), created_at = 1_700_000_000_000 + i.
// Estimates: estimatePhase of the 30 phases; updated_at = 1_700_000_000_000.
// Output: apps/api/seeds/fake.sql (DELETE FROM observations; DELETE FROM phase_estimates; then INSERTs)
// Refuses to run with any argument containing '--remote'.
```

## Acceptance criteria

1. After `pnpm db:reset:local && pnpm db:seed:local && pnpm db:seed:fake:local`, `observations` has 540 rows and `phase_estimates` has 18 rows.
2. Running the fake seeder twice leaves the same counts (idempotent).
3. The three combinations meant to be in sync have `mean_phase_ms` values within 40 ms of each other.
4. The script exits non-zero with a clear message if invoked with `--remote`.
5. Output is deterministic: two runs produce byte-identical `apps/api/seeds/fake.sql`.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm db:reset:local && pnpm db:seed:local && pnpm db:seed:fake:local
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-010-fake-data-seeder-for-local-development`; commit message and PR title `DB-010: Fake-data seeder for local development`.
