---
id: DB-003
title: Observations table and index
epic: DB
priority: must
verification: infra
size: S
status: ready
depends_on: [DB-002]
branch: story/DB-003-observations-table-and-index
---

# DB-003: Observations table and index

## Context

Each tap becomes one row. Phase is stored (computed by the server) next to the raw timestamp so estimates can be recomputed later.

## Depends on

- `DB-002`: Epochs table with initial epoch

## Scope

Files to create or modify (touch nothing else):

- `apps/api/migrations/0003_observations.sql`
- `apps/api/test/db-observations-schema.test.ts`

## Contract

```
CREATE TABLE observations (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  map_id       INTEGER NOT NULL REFERENCES maps(id),
  channel      INTEGER NOT NULL CHECK (channel >= 1),
  server_ts_ms INTEGER NOT NULL,
  phase_ms     INTEGER NOT NULL CHECK (phase_ms BETWEEN 0 AND 9999),
  client_id    TEXT NOT NULL,
  epoch_id     INTEGER NOT NULL REFERENCES epochs(id),
  created_at   INTEGER NOT NULL
);
CREATE INDEX idx_obs_combo ON observations (map_id, channel, epoch_id, created_at DESC);
```

## Acceptance criteria

1. Migration applies cleanly after DB-002 (`pnpm db:reset:local`).
2. Test: inserting `phase_ms = 10000` fails the CHECK; `phase_ms = 9999` succeeds.
3. Test: inserting `channel = 0` fails the CHECK.
4. Test: `EXPLAIN QUERY PLAN SELECT phase_ms FROM observations WHERE map_id=1 AND channel=2 AND epoch_id=1 ORDER BY created_at DESC LIMIT 50` mentions `idx_obs_combo`.
5. The table has no column that could hold an IP address (privacy requirement).

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
- [ ] Branch `story/DB-003-observations-table-and-index`; commit message and PR title `DB-003: Observations table and index`.
