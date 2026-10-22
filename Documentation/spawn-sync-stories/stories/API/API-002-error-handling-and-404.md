---
id: API-002
title: Error handling and 404
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [API-001]
branch: story/API-002-error-handling-and-404
---

# API-002: Error handling and 404

## Context

All errors must use the standard JSON error shape from AGENTS.md section 6.

## Depends on

- `API-001`: Config parsing and route skeleton

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/errors.ts`
- `apps/api/src/middleware/errors.ts` (replace the stub: register `onError` and `notFound`)
- `apps/api/test/errors.test.ts`

## Contract

```
export class ApiError extends Error {
  constructor(public status: 400|401|404|413|429|500|501|503, public code: string, message: string, public details?: unknown)
}
export function errorBody(code: string, message: string, details?: unknown): ErrorResponse;
// app.onError: ApiError -> its status + errorBody; anything else -> 500 INTERNAL "Internal error" (log the original with console.error)
// app.notFound: 404 NOT_FOUND "Not found"
```

## Acceptance criteria

1. Throwing `new ApiError(400, "INVALID_BODY", "bad")` inside a route yields status 400 and body `{ error: { code: "INVALID_BODY", message: "bad" } }` (test uses a temporary Hono sub-app).
2. Throwing a plain `Error("secret detail")` yields 500 and body code `INTERNAL`, message `Internal error`; the message "secret detail" does not appear in the response.
3. `GET /api/does-not-exist` yields 404 with code `NOT_FOUND`.
4. Every error body validates against `ErrorResponseSchema` from `@spawn-sync/shared/schemas/response`.
5. `details` is included only when provided.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-002-error-handling-and-404`; commit message and PR title `API-002: Error handling and 404`.
