---
id: SEC-001
title: Index for per-client rate limiting
epic: SEC
priority: should
verification: infra
size: S
status: ready
depends_on: [DB-003]
branch: story/SEC-001-index-for-per-client-rate-limiting
---

# SEC-001: Index for per-client rate limiting

## Context

Rate limiting counts a client's recent rows; that query needs an index.

## Depends on

- `DB-003`: Observations table and index

## Scope

Files to create or modify (touch nothing else):

- `apps/api/migrations/0005_obs_client_index.sql`
- `apps/api/test/db-client-index.test.ts`

## Contract

```
CREATE INDEX idx_obs_client ON observations (client_id, created_at);
```

## Acceptance criteria

1. Migration applies cleanly (`pnpm db:reset:local`).
2. Test: `EXPLAIN QUERY PLAN SELECT COUNT(*) FROM observations WHERE client_id='x' AND created_at >= 1` mentions `idx_obs_client`.
3. Existing tests still pass.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm db:reset:local && pnpm --filter @spawn-sync/api test
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-001-index-for-per-client-rate-limiting`; commit message and PR title `SEC-001: Index for per-client rate limiting`.
