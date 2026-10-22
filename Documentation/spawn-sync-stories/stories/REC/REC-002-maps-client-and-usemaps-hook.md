---
id: REC-002
title: Maps client and useMaps hook
epic: REC
priority: must
verification: ui
size: S
status: ready
depends_on: [REC-001]
branch: story/REC-002-maps-client-and-usemaps-hook
---

# REC-002: Maps client and useMaps hook

## Context

The record and sync pages need the map list and channel count.

## Depends on

- `REC-001`: Web API client core and time sampler

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/api/maps.ts`
- `apps/web/src/hooks/useMaps.ts`
- `apps/web/src/hooks/useMaps.test.tsx`

## Contract

```
export function fetchMaps(): Promise<MapsResponse>;      // GET /api/maps via apiGet + MapsResponseSchema
export function useMaps(): UseQueryResult<MapsResponse>; // key ['maps'], staleTime 1 hour
```

## Acceptance criteria

1. With a mocked response the hook resolves to `{ maps: [...], channelCount: 20 }`.
2. A mocked 500 error puts the query in error state with an `ApiError` (no retries in tests).
3. Two components using `useMaps` in one provider cause a single fetch.
4. The request path is exactly `/api/maps`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-002-maps-client-and-usemaps-hook`; commit message and PR title `REC-002: Maps client and useMaps hook`.
