---
id: SYN-006
title: Record page: "Find matches" link
epic: SYN
priority: should
verification: ui
size: S
status: ready
depends_on: [REC-011, SYN-003]
branch: story/SYN-006-record-page-find-matches-link
---

# SYN-006: Record page: "Find matches" link

## Context

After submitting, the player usually wants to see matches for the combination they just measured.

## Depends on

- `REC-011`: Mobile layout and accessibility for the record page
- `SYN-003`: URL-backed sync parameters hook

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/pages/RecordPage.tsx`
- `apps/web/src/pages/RecordPage.test.tsx`

## Contract

```
// After a successful submit (estimate visible) render <Link data-testid="find-matches-link" to="/sync?mapId=<id>&channel=<ch>">Find matches</Link>
// (tol omitted because it defaults to 300). Hidden before the first successful submit.
```

## Acceptance criteria

1. The link is absent before any submit.
2. After a mocked successful submit for map 2, channel 4 the link `href` is `/sync?mapId=2&channel=4`.
3. Clicking it navigates to the sync page route.
4. Existing RecordPage tests still pass.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SYN-006-record-page-find-matches-link`; commit message and PR title `SYN-006: Record page: "Find matches" link`.
