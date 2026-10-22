---
id: ADM-001
title: Admin token middleware
epic: ADM
priority: must
verification: api
size: S
status: ready
depends_on: [API-002]
branch: story/ADM-001-admin-token-middleware
---

# ADM-001: Admin token middleware

## Context

Admin endpoints are protected by a shared secret sent as `Authorization: Bearer <token>`. If no token is configured, admin endpoints are disabled.

## Depends on

- `API-002`: Error handling and 404

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/admin-auth.ts`
- `apps/api/test/admin-auth.test.ts`

## Contract

```
export const requireAdmin: MiddlewareHandler<{ Bindings: Env }>;
// env.ADMIN_TOKEN unset or empty -> ApiError(503, 'ADMIN_DISABLED', 'Admin is not configured')
// missing / malformed / wrong header -> ApiError(401, 'UNAUTHORIZED', 'Unauthorized')
// comparison must be constant-time (compare equal-length digests or loop over bytes without early exit)
```

## Acceptance criteria

1. Correct bearer token passes through to the handler.
2. Missing header, `Basic xxx`, and a wrong token all return 401 `UNAUTHORIZED` with identical bodies.
3. With `ADMIN_TOKEN` unset the response is 503 `ADMIN_DISABLED`.
4. A token that is a prefix of the real token (or longer) is rejected.
5. The token never appears in any response body or log line.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/ADM-001-admin-token-middleware`; commit message and PR title `ADM-001: Admin token middleware`.
