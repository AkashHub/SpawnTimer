---
id: ADM-004
title: Web: epoch banner component
epic: ADM
priority: should
verification: ui
size: S
status: ready
depends_on: [ADM-003, SYN-006, SYN-005, OVR-006, INF-008]
branch: story/ADM-004-web-epoch-banner-component
---

# ADM-004: Web: epoch banner component

## Context

Players should know that data is only valid since the last server restart. A small banner on the Record, Sync and Overview pages says "Data since <date>".

## Depends on

- `ADM-003`: GET /api/epoch
- `SYN-006`: Record page: "Find matches" link
- `SYN-005`: Sync page assembly
- `OVR-006`: Overview page assembly
- `INF-008`: Web test harness (Vitest + React Testing Library)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/api/epoch.ts`
- `apps/web/src/hooks/useEpoch.ts`
- `apps/web/src/components/EpochBanner.tsx`
- `apps/web/src/components/EpochBanner.test.tsx`
- `apps/web/src/pages/RecordPage.tsx`, `SyncPage.tsx`, `OverviewPage.tsx` (render `<EpochBanner />` under the title)

## Contract

```
// <EpochBanner /> renders data-testid="epoch-banner" with text "Data since 2023-11-14 22:13 UTC" (UTC, minutes precision)
// and, if note is non-null, " - <note>". While loading render nothing; on error render nothing.
```

## Acceptance criteria

1. With mocked `/api/epoch` returning `{ id: 2, startedAt: 1700000000000, note: "restart" }` the banner text is `Data since 2023-11-14 22:13 UTC - restart`.
2. With `note: null` there is no trailing dash.
3. Loading and error states render nothing (no crash, no empty box).
4. The banner appears on `/record`, `/sync` and `/overview` (one assertion per page).

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/ADM-004-web-epoch-banner-component`; commit message and PR title `ADM-004: Web: epoch banner component`.
