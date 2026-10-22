---
id: SYN-003
title: URL-backed sync parameters hook
epic: SYN
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-001]
branch: story/SYN-003-url-backed-sync-parameters-hook
---

# SYN-003: URL-backed sync parameters hook

## Context

The sync finder state lives in the URL (`/sync?mapId=1&channel=3&tol=300`) so results can be shared and bookmarked.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-001`: Constants and phaseOf

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/hooks/useSyncParams.ts`
- `apps/web/src/hooks/useSyncParams.test.tsx`

## Contract

```
export interface SyncParams { mapId: number | null; channel: number | null; tol: number }
export function useSyncParams(): [SyncParams, (patch: Partial<SyncParams>) => void];
// reads react-router search params; invalid or missing values -> null (ids) or 300 (tol); tol clamped to 50..1000
// setter merges the patch, writes with `replace: true`, omits null values, always writes tol only if != 300
```

## Acceptance criteria

1. `/sync?mapId=2&channel=5&tol=450` gives `{ mapId: 2, channel: 5, tol: 450 }`.
2. `/sync` gives `{ mapId: null, channel: null, tol: 300 }`; `?mapId=abc&channel=-1` gives nulls.
3. `tol=5000` is clamped to 1000; `tol=10` to 50.
4. Calling the setter with `{ mapId: 3 }` keeps the other values and updates the URL via replace (history length unchanged).
5. Setting `{ tol: 300 }` removes `tol` from the URL.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SYN-003-url-backed-sync-parameters-hook`; commit message and PR title `SYN-003: URL-backed sync parameters hook`.
