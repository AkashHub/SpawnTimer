---
id: ADM-005
title: Web: admin page to start a new epoch
epic: ADM
priority: should
verification: ui
size: S
status: ready
depends_on: [ADM-002, INF-008]
branch: story/ADM-005-web-admin-page-to-start-a-new-epoch
---

# ADM-005: Web: admin page to start a new epoch

## Context

A simple page at `/admin` where the admin pastes the token and starts a new epoch. The token is kept only in component state (not stored).

## Depends on

- `ADM-002`: POST /api/admin/epoch
- `INF-008`: Web test harness (Vitest + React Testing Library)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/api/admin.ts`
- `apps/web/src/pages/AdminPage.tsx`
- `apps/web/src/pages/AdminPage.test.tsx`

## Contract

```
// data-testid: admin-token (password input), admin-note (text input), admin-submit (button "Start new epoch"),
//              admin-confirm (button "Yes, start new epoch" shown after the first click), admin-result, admin-error
// Flow: click admin-submit -> show admin-confirm -> click it -> POST /api/admin/epoch with Authorization: Bearer <token>
//   success -> admin-result "Started epoch <id>"; failure -> admin-error with the API message (401 -> "Wrong token")
```

## Acceptance criteria

1. Submitting requires a second confirming click; the request is not sent on the first click.
2. The request carries `Authorization: Bearer <typed token>` and body `{ note }`.
3. Success shows `Started epoch 3` for a mocked `{ id: 3, ... }` response.
4. A mocked 401 shows `Wrong token`; the token field is not cleared.
5. The token is never written to localStorage/sessionStorage (test spies on Storage).

## How to verify

Run `pnpm --filter @spawn-sync/api test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/ADM-005-web-admin-page-to-start-a-new-epoch`; commit message and PR title `ADM-005: Web: admin page to start a new epoch`.
