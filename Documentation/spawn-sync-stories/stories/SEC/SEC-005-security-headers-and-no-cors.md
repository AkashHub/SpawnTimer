---
id: SEC-005
title: Security headers and no CORS
epic: SEC
priority: should
verification: api
size: S
status: ready
depends_on: [API-002]
branch: story/SEC-005-security-headers-and-no-cors
---

# SEC-005: Security headers and no CORS

## Context

The SPA and API share one origin, so cross-origin access is unnecessary. Add basic hardening headers to every response.

## Depends on

- `API-002`: Error handling and 404

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/middleware/security-headers.ts` (replace the stub)
- `apps/api/test/security-headers.test.ts`

## Contract

```
// Headers on every /api/* response: X-Content-Type-Options: nosniff, Referrer-Policy: no-referrer,
// X-Frame-Options: DENY, Cross-Origin-Resource-Policy: same-origin
// Do NOT add any Access-Control-Allow-* headers. OPTIONS /api/* returns 404 NOT_FOUND.
```

## Acceptance criteria

1. A normal 200, a 404 and a 400 response all carry the four headers.
2. No `Access-Control-Allow-Origin` header is present on any response.
3. `OPTIONS /api/maps` returns 404 with the standard error body.
4. Existing tests still pass.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-005-security-headers-and-no-cors`; commit message and PR title `SEC-005: Security headers and no CORS`.
