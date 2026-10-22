---
id: DB-008
title: Repository: observations
epic: DB
priority: must
verification: unit
size: S
status: ready
depends_on: [DB-003, DB-006, DB-007]
branch: story/DB-008-repository-observations
---

# DB-008: Repository: observations

## Context

Taps are inserted in one atomic batch. The estimate reads only the newest `limit` phases of one combination.

## Depends on

- `DB-003`: Observations table and index
- `DB-006`: Repository: maps
- `DB-007`: Repository: epochs

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/db/observations.ts`
- `apps/api/test/db-observations.test.ts`

## Contract

```
export interface NewObservation {
  mapId: number; channel: number; serverTsMs: number; phaseMs: number;
  clientId: string; epochId: number; createdAt: number;
}
export function insertObservations(db: D1Database, rows: NewObservation[]): Promise<void>;   // single db.batch; no-op for []
export function getRecentPhases(db: D1Database, q: { mapId: number; channel: number; epochId: number; limit: number }): Promise<number[]>;
  // newest first: ORDER BY created_at DESC, id DESC LIMIT ?
```

## Acceptance criteria

1. Inserting 3 rows then `getRecentPhases` with `limit 50` returns 3 phases.
2. Newest-first ordering: rows created at 100, 300, 200 with phases 1, 3, 2 return `[3, 2, 1]`.
3. `limit` is honored: 5 rows, `limit 2` returns 2.
4. Filtering: rows for another channel, map or epoch are not returned.
5. `insertObservations(db, [])` resolves without error; if one row violates a constraint (phase 10000) NO rows of the batch are stored.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-008-repository-observations`; commit message and PR title `DB-008: Repository: observations`.
