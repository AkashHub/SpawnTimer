---
id: SYN-001
title: Sync client and hook
epic: SYN
priority: must
verification: ui
size: S
status: ready
depends_on: [REC-001, LIB-010]
branch: story/SYN-001-sync-client-and-hook
---

# SYN-001: Sync client and hook

## Context

Fetches matches for a reference combination.

## Depends on

- `REC-001`: Web API client core and time sampler
- `LIB-010`: Response schemas (Zod)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/api/sync.ts`
- `apps/web/src/hooks/useSyncMatches.ts`
- `apps/web/src/hooks/useSyncMatches.test.tsx`

## Contract

```
export function fetchSync(q: { mapId: number; channel: number; tol: number }): Promise<SyncResponse>;   // GET /api/sync
export function useSyncMatches(q: { mapId: number | null; channel: number | null; tol: number }): UseQueryResult<SyncResponse, ApiError>;
//   enabled only when mapId and channel are non-null; key ['sync', mapId, channel, tol]; retry false for 404
```

## Acceptance criteria

1. With null `mapId` no request is made.
2. With `{ mapId: 2, channel: 5, tol: 300 }` the request path is `/api/sync?mapId=2&channel=5&tol=300`.
3. A mocked 404 `NO_ESTIMATE` yields an error state whose `error.code === "NO_ESTIMATE"`, with no retry.
4. A valid mocked response resolves and validates against `SyncResponseSchema`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SYN-001-sync-client-and-hook`; commit message and PR title `SYN-001: Sync client and hook`.
