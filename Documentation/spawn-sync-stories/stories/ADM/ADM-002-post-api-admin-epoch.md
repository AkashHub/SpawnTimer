---
id: ADM-002
title: POST /api/admin/epoch
epic: ADM
priority: must
verification: api
size: S
status: ready
depends_on: [ADM-001, DB-007]
branch: story/ADM-002-post-api-admin-epoch
---

# ADM-002: POST /api/admin/epoch

## Context

An admin starts a new epoch when the game server restarts and phases are expected to change. Old estimates stay in the database but are no longer queried.

## Depends on

- `ADM-001`: Admin token middleware
- `DB-007`: Repository: epochs

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/admin.ts` (replace the stub)
- `apps/api/test/admin-epoch.test.ts`

## Contract

```
// POST /api/admin/epoch   Authorization: Bearer <ADMIN_TOKEN>
// Body: { "note": string | null }  (optional; note max 200 chars; invalid -> 400 INVALID_BODY)
// 200 EpochDto { id, startedAt: Date.now(), note }
```

## Acceptance criteria

1. Without a valid token: 401 and no epoch is created.
2. With the token and `{ "note": "restart" }`: 200, body validates against `EpochDtoSchema`, `id` is previous max + 1, `startedAt` equals the current time.
3. Empty body or `{}` creates an epoch with `note: null`.
4. A 201-character note returns 400 `INVALID_BODY`.
5. After creation, `GET /api/overview` returns the new `epochId` and no estimates.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/ADM-002-post-api-admin-epoch`; commit message and PR title `ADM-002: POST /api/admin/epoch`.
