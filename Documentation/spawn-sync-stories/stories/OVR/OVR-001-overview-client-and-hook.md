---
id: OVR-001
title: Overview client and hook
epic: OVR
priority: must
verification: ui
size: S
status: ready
depends_on: [REC-001, LIB-010]
branch: story/OVR-001-overview-client-and-hook
---

# OVR-001: Overview client and hook

## Context

Fetches all estimates and computed sync groups.

## Depends on

- `REC-001`: Web API client core and time sampler
- `LIB-010`: Response schemas (Zod)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/api/overview.ts`
- `apps/web/src/hooks/useOverview.ts`
- `apps/web/src/hooks/useOverview.test.tsx`

## Contract

```
export function fetchOverview(tol: number): Promise<OverviewResponse>;   // GET /api/overview?tol=<n>
export function useOverview(tol: number): UseQueryResult<OverviewResponse, ApiError>;   // key ['overview', tol], staleTime 30 s
```

## Acceptance criteria

1. `useOverview(300)` requests `/api/overview?tol=300`.
2. Changing `tol` to 500 triggers a new request with `tol=500` (separate cache entry).
3. A valid response resolves and validates against `OverviewResponseSchema`.
4. A mocked 500 produces an error state with an `ApiError`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/OVR-001-overview-client-and-hook`; commit message and PR title `OVR-001: Overview client and hook`.
