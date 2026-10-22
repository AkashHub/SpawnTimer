---
id: DB-007
title: Repository: epochs
epic: DB
priority: must
verification: unit
size: S
status: ready
depends_on: [DB-002]
branch: story/DB-007-repository-epochs
---

# DB-007: Repository: epochs

## Context

The current epoch is the row with the highest id.

## Depends on

- `DB-002`: Epochs table with initial epoch

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/db/epochs.ts`
- `apps/api/test/db-epochs.test.ts`

## Contract

```
export interface EpochRow { id: number; startedAt: number; note: string | null }
export function getCurrentEpoch(db: D1Database): Promise<EpochRow>;      // throws Error('NO_EPOCH') if none
export function createEpoch(db: D1Database, note: string | null, nowMs: number): Promise<EpochRow>;
```

## Acceptance criteria

1. After `resetDb()`, `getCurrentEpoch` returns `{ id: 1, startedAt: 0, note: "test baseline" }`.
2. `createEpoch(db, "restart", 1_700_000_000_000)` returns `{ id: 2, startedAt: 1_700_000_000_000, note: "restart" }` and `getCurrentEpoch` then returns id 2.
3. `createEpoch(db, null, 5)` stores `note` as `null`.
4. With an empty `epochs` table `getCurrentEpoch` rejects with an error whose message is `NO_EPOCH`.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-007-repository-epochs`; commit message and PR title `DB-007: Repository: epochs`.
