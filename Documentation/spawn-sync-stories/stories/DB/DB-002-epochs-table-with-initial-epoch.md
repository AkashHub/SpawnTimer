---
id: DB-002
title: Epochs table with initial epoch
epic: DB
priority: must
verification: infra
size: S
status: ready
depends_on: [DB-001]
branch: story/DB-002-epochs-table-with-initial-epoch
---

# DB-002: Epochs table with initial epoch

## Context

An epoch groups observations that share stable phases (e.g. between restarts). The newest epoch (highest id) is "current", so at least one must exist from the start.

## Depends on

- `DB-001`: Migration tooling and maps table

## Scope

Files to create or modify (touch nothing else):

- `apps/api/migrations/0002_epochs.sql`

## Contract

```
CREATE TABLE epochs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at INTEGER NOT NULL,      -- unix ms
  note       TEXT
);
INSERT INTO epochs (started_at, note)
VALUES (CAST(strftime('%s','now') AS INTEGER) * 1000, 'initial');
```

## Acceptance criteria

1. After `pnpm db:reset:local`, `SELECT id, note FROM epochs` (via `wrangler d1 execute --local`) returns exactly one row: id 1, note `initial`.
2. `started_at` of that row is within 1 minute of now (milliseconds, not seconds).
3. `pnpm --filter @spawn-sync/api test` still passes (the harness `resetDb()` re-creates the baseline epoch with id 1).

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm db:reset:local && pnpm --filter @spawn-sync/api exec wrangler d1 execute spawn-sync-db --local --command "SELECT * FROM epochs"
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-002-epochs-table-with-initial-epoch`; commit message and PR title `DB-002: Epochs table with initial epoch`.
