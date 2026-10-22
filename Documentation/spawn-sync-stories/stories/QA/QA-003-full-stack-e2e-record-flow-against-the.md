---
id: QA-003
title: Full-stack e2e: record flow against the real API
epic: QA
priority: should
verification: e2e
size: M
status: ready
depends_on: [REC-010, API-008, DB-005, INF-009]
branch: story/QA-003-full-stack-e2e-record-flow-against-the
---

# QA-003: Full-stack e2e: record flow against the real API

## Context

Everything so far is tested with mocks or in isolation. This test runs the real Worker (local D1) and the SPA together once.

## Depends on

- `REC-010`: Record page assembly
- `API-008`: Return the estimate from POST /api/observations
- `DB-005`: Map seed data and idempotent seed script
- `INF-009`: Playwright end-to-end harness

## Scope

Files to create or modify (touch nothing else):

- `apps/web/e2e/fullstack.spec.ts`
- `apps/web/playwright.fullstack.config.ts` (starts `pnpm dev:api` after reset+seed, and `pnpm dev:web`)
- Root `package.json`: script `e2e:full`

## Acceptance criteria

1. `pnpm e2e:full` resets and seeds the local DB, starts both servers, and passes.
2. The test selects the first map and channel 1, taps `tap-button` 5 times, clicks `submit-button`, and `estimate-n` shows `5`.
3. Reloading the page and submitting 5 more taps changes `estimate-n` to `10`.
4. No console errors are emitted during the test (the test fails on `console.error`).
5. `confidence-badge` is visible with one of `low`, `medium`, `high`.

## How to verify

Run `pnpm e2e` (or the script named in the criteria) and inspect the Playwright report for failures. Also run `pnpm --filter @spawn-sync/api test` if component tests exist.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/QA-003-full-stack-e2e-record-flow-against-the`; commit message and PR title `QA-003: Full-stack e2e: record flow against the real API`.
