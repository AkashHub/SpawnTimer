---
id: REC-001
title: Web API client core and time sampler
epic: REC
priority: must
verification: ui
size: M
status: ready
depends_on: [INF-008, LIB-010, LIB-012]
branch: story/REC-001-web-api-client-core-and-time-sampler
---

# REC-001: Web API client core and time sampler

## Context

All network access from the SPA goes through one small typed client. Responses are validated with the shared Zod schemas so contract drift is caught immediately.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-010`: Response schemas (Zod)
- `LIB-012`: Server clock anchor math

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/api/http.ts`
- `apps/web/src/api/time.ts`
- `apps/web/src/api/http.test.ts`, `apps/web/src/api/time.test.ts`

## Contract

```
// http.ts
export class ApiError extends Error { constructor(public status: number, public code: string, message: string, public details?: unknown) }
export async function apiGet<S extends z.ZodTypeAny>(path: string, schema: S, params?: Record<string, string | number | undefined>): Promise<z.infer<S>>;
export async function apiPost<S extends z.ZodTypeAny>(path: string, body: unknown, schema: S, headers?: Record<string, string>): Promise<z.infer<S>>;
// undefined params are omitted. Non-2xx with a valid ErrorResponse -> ApiError(status, error.code, error.message, error.details)
// fetch rejects -> ApiError(0, 'NETWORK', 'Network error'); 2xx body failing the schema -> ApiError(0, 'BAD_RESPONSE', 'Unexpected response')
// Non-2xx without a parsable error body -> ApiError(status, 'UNKNOWN', 'Request failed')

// time.ts
export async function getClockSample(): Promise<ClockSample>;
// t0 = performance.now(); GET /api/time (validated with TimeResponseSchema); t1 = performance.now()
// -> { rttMs: t1 - t0, perfAtReceiveMs: t1, serverNowMs: serverNow }
```

## Acceptance criteria

1. `apiGet("/api/x", schema, { a: 1, b: undefined })` requests `/api/x?a=1` (tests stub `fetch`).
2. A 400 response `{ error: { code: "INVALID_QUERY", message: "m" } }` rejects with `ApiError` having `status 400`, `code "INVALID_QUERY"`, `message "m"`.
3. A rejected fetch gives `code "NETWORK"`, status 0; a 200 body that fails the schema gives `code "BAD_RESPONSE"`.
4. `apiPost` sends `Content-Type: application/json`, the JSON body, and extra headers.
5. `getClockSample` returns `rttMs` equal to the difference of two stubbed `performance.now()` values and `serverNowMs` from the mocked response.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-001-web-api-client-core-and-time-sampler`; commit message and PR title `REC-001: Web API client core and time sampler`.
