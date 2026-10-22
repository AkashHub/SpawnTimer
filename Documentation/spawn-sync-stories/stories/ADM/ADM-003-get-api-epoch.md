---
id: ADM-003
title: GET /api/epoch
epic: ADM
priority: must
verification: api
size: S
status: ready
depends_on: [API-002, DB-007]
branch: story/ADM-003-get-api-epoch
---

# ADM-003: GET /api/epoch

## Context

The UI shows when the current data set started.

## Depends on

- `API-002`: Error handling and 404
- `DB-007`: Repository: epochs

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/epoch.ts` (replace the stub)
- `apps/api/test/epoch.test.ts`

## Contract

```
// GET /api/epoch -> 200 EpochDto of the current epoch
```

## Acceptance criteria

1. Validates against `EpochDtoSchema`.
2. Fresh test DB returns `{ id: 1, startedAt: 0, note: "test baseline" }`.
3. After `createEpoch` the new epoch is returned.
4. Response has no `X-Cache` header and is not cached.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/ADM-003-get-api-epoch`; commit message and PR title `ADM-003: GET /api/epoch`.
