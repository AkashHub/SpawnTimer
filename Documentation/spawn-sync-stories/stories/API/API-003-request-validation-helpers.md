---
id: API-003
title: Request validation helpers
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [API-002, LIB-009]
branch: story/API-003-request-validation-helpers
---

# API-003: Request validation helpers

## Context

Routes need one consistent way to validate JSON bodies and query strings with Zod.

## Depends on

- `API-002`: Error handling and 404
- `LIB-009`: Request schemas (Zod)

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/validate.ts`
- `apps/api/test/validate.test.ts`

## Contract

```
export async function parseJsonBody<T extends z.ZodTypeAny>(c: Context, schema: T): Promise<z.infer<T>>;
  // invalid JSON or schema failure -> throw ApiError(400, 'INVALID_BODY', 'Invalid request body', zodError.flatten())
export function parseQuery<T extends z.ZodTypeAny>(c: Context, schema: T): z.infer<T>;
  // reads c.req.query(); failure -> throw ApiError(400, 'INVALID_QUERY', 'Invalid query', zodError.flatten())
```

## Acceptance criteria

1. A valid JSON body returns the parsed, typed value.
2. Malformed JSON (`{`) gives 400 `INVALID_BODY`.
3. A body failing the schema gives 400 `INVALID_BODY` and `error.details.fieldErrors` names the offending field.
4. `parseQuery` applies coercion and defaults from the schema (e.g. `SyncQuerySchema` with `?mapId=1&channel=2` yields `tol: 300`).
5. `parseQuery` failure gives 400 `INVALID_QUERY`.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-003-request-validation-helpers`; commit message and PR title `API-003: Request validation helpers`.
