---
id: SYN-005
title: Sync page assembly
epic: SYN
priority: must
verification: ui
size: M
status: ready
depends_on: [SYN-001, SYN-002, SYN-003, SYN-004, REC-002, REC-004, REC-009, INF-009]
branch: story/SYN-005-sync-page-assembly
---

# SYN-005: Sync page assembly

## Context

Compose the sync finder: choose a reference map/channel, adjust tolerance, optionally show low-confidence results, and see matching combinations.

## Depends on

- `SYN-001`: Sync client and hook
- `SYN-002`: ToleranceControl component
- `SYN-003`: URL-backed sync parameters hook
- `SYN-004`: MatchesTable component
- `REC-002`: Maps client and useMaps hook
- `REC-004`: Map and channel selector with remembered choice
- `REC-009`: EstimateCard component
- `INF-009`: Playwright end-to-end harness

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/pages/SyncPage.tsx`
- `apps/web/src/pages/SyncPage.test.tsx`
- `apps/web/e2e/sync.spec.ts`

## Contract

```
// Uses useSyncParams for state; MapChannelSelect (value from params, onChange -> setter); ToleranceControl; checkbox data-testid="show-low-toggle" (label "Show low-confidence", default off);
// EstimateCard for response.reference; MatchesTable for response.matches.
// States: no map+channel -> data-testid="sync-prompt" "Choose a map and channel";  loading -> "sync-loading";
//   404 NO_ESTIMATE -> "sync-no-data" "No data for this combination yet. Record some taps first." with a link to /record;
//   other error -> "sync-error" with the message.
```

## Acceptance criteria

1. Opening `/sync` shows `sync-prompt` and makes no sync request.
2. Opening `/sync?mapId=1&channel=1&tol=300` with a mocked response renders the reference estimate and the matches table.
3. Changing tolerance to 500 refetches with `tol=500` and updates the URL.
4. A mocked 404 `NO_ESTIMATE` shows `sync-no-data` with a link whose href is `/record`.
5. `show-low-toggle` reveals a low-confidence row that was hidden.
6. Playwright (`sync.spec.ts`, mocked API) covers: open URL with params, see 2 rows, toggle, change tolerance.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SYN-005-sync-page-assembly`; commit message and PR title `SYN-005: Sync page assembly`.
