---
id: QA-001
title: Request logging middleware
epic: QA
priority: should
verification: api
size: S
status: ready
depends_on: [API-002]
branch: story/QA-001-request-logging-middleware
---

# QA-001: Request logging middleware

## Context

A single JSON log line per request helps debugging on Cloudflare without recording personal data.

## Depends on

- `API-002`: Error handling and 404

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/middleware/logging.ts` (replace the stub)
- `apps/api/test/logging.test.ts`

## Contract

```
// console.log(JSON.stringify({ t: <ms>, method, path, status, ms: <duration> }))   one line per request, after the response
// path excludes the query string. Never log headers, bodies, IP addresses or clientId.
```

## Acceptance criteria

1. One log line per request, parseable as JSON, with exactly the keys `t, method, path, status, ms`.
2. `GET /api/maps?x=secret` logs path `/api/maps` (no query).
3. A request with `CF-Connecting-IP` and a body containing `clientId` produces a log line containing neither.
4. Error responses (404, 400) are logged with their status.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/QA-001-request-logging-middleware`; commit message and PR title `QA-001: Request logging middleware`.
