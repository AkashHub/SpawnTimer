---
id: SEC-007
title: SQL injection and hostile input tests
epic: SEC
priority: should
verification: api
size: S
status: ready
depends_on: [API-008, API-010, API-009]
branch: story/SEC-007-sql-injection-and-hostile-input-tests
---

# SEC-007: SQL injection and hostile input tests

## Context

All SQL is parameterized, but we prove it with tests so a regression cannot slip in later.

## Depends on

- `API-008`: Return the estimate from POST /api/observations
- `API-010`: GET /api/sync
- `API-009`: GET /api/phases

## Scope

Files to create or modify (touch nothing else):

- `apps/api/test/hostile-input.test.ts` (tests only; fix bugs in the files they reveal and list them in the PR)

## Acceptance criteria

1. `GET /api/sync?mapId=1;DROP TABLE maps;--&channel=1` returns 400 `INVALID_QUERY` and the `maps` table still exists.
2. `POST /api/observations` with `clientId` `"x'); DROP TABLE observations;--"` returns 400 (fails the regex) and the table still exists.
3. A map named `Robert'); DROP TABLE maps;--` inserted by test can be listed and used as a reference without error or side effects.
4. Unicode, very long strings (10 000 chars) and null bytes in string fields never produce a 500.
5. Every response in these tests validates against either a success schema or `ErrorResponseSchema`.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-007-sql-injection-and-hostile-input-tests`; commit message and PR title `SEC-007: SQL injection and hostile input tests`.
