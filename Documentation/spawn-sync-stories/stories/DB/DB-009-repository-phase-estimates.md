---
id: DB-009
title: Repository: phase estimates
epic: DB
priority: must
verification: unit
size: S
status: ready
depends_on: [DB-004, DB-006]
branch: story/DB-009-repository-phase-estimates
---

# DB-009: Repository: phase estimates

## Context

Estimates are upserted after each submission and read by the phases, sync and overview endpoints.

## Depends on

- `DB-004`: Phase estimates table
- `DB-006`: Repository: maps

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/db/estimates.ts`
- `apps/api/test/db-estimates.test.ts`

## Contract

```
export interface EstimateRow {
  mapId: number; channel: number; epochId: number; meanPhaseMs: number;
  r: number; spreadMs: number; n: number; updatedAt: number;
}
export interface NamedEstimateRow extends EstimateRow { mapName: string }
export function upsertEstimate(db: D1Database, row: EstimateRow): Promise<void>;
export function getEstimate(db: D1Database, mapId: number, channel: number, epochId: number): Promise<NamedEstimateRow | null>;
export function getEstimatesForMap(db: D1Database, mapId: number, epochId: number): Promise<NamedEstimateRow[]>;   // channel ASC
export function getAllEstimates(db: D1Database, epochId: number): Promise<NamedEstimateRow[]>;   // JOIN maps; mapId ASC, channel ASC
```

## Acceptance criteria

1. `upsertEstimate` twice for the same key leaves one row with the second values.
2. `getEstimate` returns `null` for a missing key and includes `mapName` for an existing one.
3. `getEstimatesForMap` returns only that map and epoch, ordered by channel ascending.
4. `getAllEstimates` filters by epoch and orders by mapId then channel.
5. Values round-trip exactly (`r` 0.9987, `spreadMs` 41, `n` 12).

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/DB-009-repository-phase-estimates`; commit message and PR title `DB-009: Repository: phase estimates`.
