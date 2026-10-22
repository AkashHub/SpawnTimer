---
id: DB-005
title: Map seed data and idempotent seed script
epic: DB
priority: must
verification: infra
size: M
status: ready
depends_on: [DB-001]
branch: story/DB-005-map-seed-data-and-idempotent-seed-script
---

# DB-005: Map seed data and idempotent seed script

## Context

Maps come from a JSON file so humans can edit them (H-003). A script converts the JSON to SQL (`INSERT OR REPLACE`) so seeding is repeatable locally and in deploys. Real map names are unknown, so ship clearly marked placeholders.

## Depends on

- `DB-001`: Migration tooling and maps table

## Scope

Files to create or modify (touch nothing else):

- `data/maps.json`
- `scripts/seed-maps.mjs`
- Root `package.json`: script `db:seed:local`
- `apps/api/package.json`: script `db:seed:local`
- `.gitignore` already ignores `apps/api/seeds`

## Contract

```
// data/maps.json
[ { "id": 1, "name": "Example Map A", "region": null },
  { "id": 2, "name": "Example Map B", "region": "Example Region" },
  { "id": 3, "name": "Example Map C", "region": null },
  { "id": 4, "name": "Example Map D", "region": null },
  { "id": 5, "name": "Example Map E", "region": null } ]

// scripts/seed-maps.mjs  (plain Node ESM, no dependencies)
// Validates: array, unique integer ids > 0, unique non-empty names (trimmed), region string or null.
// On invalid input prints the problem and exits 1.
// Writes apps/api/seeds/maps.sql with one statement per map:
//   INSERT OR REPLACE INTO maps (id, name, region) VALUES (1, 'Example Map A', NULL);
// Single quotes in names are escaped by doubling them.

// db:seed:local = node ../../scripts/seed-maps.mjs && wrangler d1 execute spawn-sync-db --local --file=seeds/maps.sql
```

## Acceptance criteria

1. `node scripts/seed-maps.mjs` creates `apps/api/seeds/maps.sql` with 5 `INSERT OR REPLACE` statements.
2. A map named `O'Brien Hall` produces `'O''Brien Hall'` in the SQL (tester temporarily edits the JSON, then reverts).
3. Duplicate ids, duplicate names, an empty name or a non-integer id each make the script exit 1 with a message naming the problem.
4. `pnpm db:reset:local && pnpm db:seed:local` loads 5 rows; running `pnpm db:seed:local` again keeps the count at 5.
5. `data/maps.json` contains no map names other than the `Example Map` placeholders.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm db:reset:local && pnpm db:seed:local
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-005-map-seed-data-and-idempotent-seed-script`; commit message and PR title `DB-005: Map seed data and idempotent seed script`.
