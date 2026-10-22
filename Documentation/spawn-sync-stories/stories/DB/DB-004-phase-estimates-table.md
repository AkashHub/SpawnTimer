---
id: DB-004
title: Phase estimates table
epic: DB
priority: must
verification: infra
size: S
status: ready
depends_on: [DB-003]
branch: story/DB-004-phase-estimates-table
---

# DB-004: Phase estimates table

## Context

Estimates are a cache of the aggregated result per combination and epoch, so read endpoints do not scan observations.

## Depends on

- `DB-003`: Observations table and index

## Scope

Files to create or modify (touch nothing else):

- `apps/api/migrations/0004_phase_estimates.sql`
- `apps/api/test/db-estimates-schema.test.ts`

## Contract

```
CREATE TABLE phase_estimates (
  map_id        INTEGER NOT NULL,
  channel       INTEGER NOT NULL,
  epoch_id      INTEGER NOT NULL,
  mean_phase_ms INTEGER NOT NULL CHECK (mean_phase_ms BETWEEN 0 AND 9999),
  r             REAL    NOT NULL,
  spread_ms     INTEGER NOT NULL,
  n             INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL,
  PRIMARY KEY (map_id, channel, epoch_id)
);
```

## Acceptance criteria

1. Migration applies cleanly (`pnpm db:reset:local`).
2. Test: inserting two rows with the same `(map_id, channel, epoch_id)` fails; a different `channel` succeeds.
3. Test: `mean_phase_ms = 10000` fails the CHECK.
4. Test: `INSERT OR REPLACE` with the same key replaces the row (count stays 1).

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm db:reset:local
pnpm --filter @spawn-sync/api test
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-004-phase-estimates-table`; commit message and PR title `DB-004: Phase estimates table`.
