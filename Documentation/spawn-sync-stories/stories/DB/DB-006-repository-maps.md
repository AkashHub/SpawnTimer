---
id: DB-006
title: Repository: maps
epic: DB
priority: must
verification: unit
size: S
status: ready
depends_on: [DB-001]
branch: story/DB-006-repository-maps
---

# DB-006: Repository: maps

## Context

All SQL lives in `apps/api/src/db/*.ts`, one file per table. Functions take the D1 database as first argument. Always bind parameters.

## Depends on

- `DB-001`: Migration tooling and maps table

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/db/maps.ts`
- `apps/api/test/db-maps.test.ts`

## Contract

```
export interface MapRow { id: number; name: string; region: string | null }
export function listMaps(db: D1Database): Promise<MapRow[]>;            // ordered by name ASC (case-insensitive)
export function getMapById(db: D1Database, id: number): Promise<MapRow | null>;
```

## Acceptance criteria

1. `listMaps` on an empty table returns `[]`.
2. With rows named `"b"`, `"A"`, `"c"` the result order is A, b, c.
3. `getMapById` returns the row for an existing id and `null` for a missing id.
4. Rows come back as plain objects with exactly the keys `id`, `name`, `region` (a test uses `toEqual`).

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-006-repository-maps`; commit message and PR title `DB-006: Repository: maps`.
