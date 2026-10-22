---
id: DB-001
title: Migration tooling and maps table
epic: DB
priority: must
verification: infra
size: S
status: ready
depends_on: [INF-006]
branch: story/DB-001-migration-tooling-and-maps-table
---

# DB-001: Migration tooling and maps table

## Context

Schema changes are plain SQL files in `apps/api/migrations/`, applied with Wrangler's D1 migrations (local for dev and tests, remote for deploys).

## Depends on

- `INF-006`: API test harness with local D1

## Scope

Files to create or modify (touch nothing else):

- `apps/api/migrations/0001_maps.sql`
- `apps/api/test/db-maps-schema.test.ts`
- Root `package.json`: scripts `db:migrate:local`, `db:reset:local`
- `apps/api/package.json`: scripts `db:migrate:local`, `db:reset:local`

## Contract

```
-- 0001_maps.sql
CREATE TABLE maps (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL UNIQUE,
  region TEXT
);

# scripts (api)
"db:migrate:local": "wrangler d1 migrations apply spawn-sync-db --local"
"db:reset:local":   "rm -rf .wrangler/state && pnpm db:migrate:local"   # cross-platform alternative acceptable
```

## Acceptance criteria

1. `pnpm db:reset:local` exits 0 and creates the `maps` table (check with `wrangler d1 execute spawn-sync-db --local --command "SELECT name FROM sqlite_master WHERE name='maps'"`).
2. Running `pnpm db:migrate:local` twice is harmless (second run applies nothing).
3. Test: after `resetDb()`, inserting `(1, "A", NULL)` succeeds and a second insert with the same name fails (UNIQUE).
4. Test: inserting a row without `name` fails (NOT NULL).

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
- [ ] Branch `story/DB-001-migration-tooling-and-maps-table`; commit message and PR title `DB-001: Migration tooling and maps table`.
