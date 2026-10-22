---
id: SEC-006
title: Request body size limit
epic: SEC
priority: should
verification: api
size: S
status: ready
depends_on: [SEC-002]
branch: story/SEC-006-request-body-size-limit
---

# SEC-006: Request body size limit

## Context

A valid submission is under 1 KB. Reject anything over 4 KB before parsing.

## Depends on

- `SEC-002`: Per-client submission rate limit

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/body-limit.ts`
- `apps/api/src/routes/observations.ts` (apply)
- `apps/api/test/body-limit.test.ts`

## Contract

```
// Check Content-Length header (if present and > 4096) and also the actual text length after reading (> 4096 chars)
// -> ApiError(413, 'PAYLOAD_TOO_LARGE', 'Payload too large')
```

## Acceptance criteria

1. A 5000-byte body returns 413 `PAYLOAD_TOO_LARGE` and stores nothing.
2. A normal 10-tap request still returns 200.
3. A body of exactly 4096 bytes that is otherwise valid JSON is not rejected for size.
4. The check happens before JSON parsing (a 5000-byte invalid-JSON body returns 413, not 400).

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-006-request-body-size-limit`; commit message and PR title `SEC-006: Request body size limit`.
