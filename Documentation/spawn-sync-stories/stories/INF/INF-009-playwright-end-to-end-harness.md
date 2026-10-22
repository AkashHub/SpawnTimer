---
id: INF-009
title: Playwright end-to-end harness
epic: INF
priority: should
verification: e2e
size: S
status: ready
depends_on: [INF-007, INF-004]
branch: story/INF-009-playwright-end-to-end-harness
---

# INF-009: Playwright end-to-end harness

## Context

E2E tests drive a real browser against the Vite dev server. UI stories mock `/api/*` with `page.route`; the full-stack e2e (QA-001) is separate.

## Depends on

- `INF-007`: Web app scaffold with routes and layout
- `INF-004`: GitHub Actions CI workflow

## Scope

Files to create or modify (touch nothing else):

- `apps/web/package.json`: devDependency `@playwright/test`; script `"e2e": "playwright test"`
- `apps/web/playwright.config.ts` (chromium only; `webServer` runs `pnpm dev` on port 5173; baseURL http://localhost:5173)
- `apps/web/e2e/smoke.spec.ts`
- Root `package.json`: script `e2e` -> `pnpm --filter @spawn-sync/web e2e`
- `.github/workflows/ci.yml`: add steps after `pnpm test`: `pnpm --filter @spawn-sync/web exec playwright install --with-deps chromium` and `pnpm e2e`

## Acceptance criteria

1. `pnpm e2e` passes locally (after `pnpm --filter @spawn-sync/web exec playwright install chromium`).
2. `smoke.spec.ts` visits `/` and expects the URL to end with `/record` and `page-title` to read `Record`.
3. A second test visits `/sync` and expects `page-title` `Sync Finder`.
4. `ci.yml` still parses as YAML and the new steps run after the unit tests.

## How to verify

Run `pnpm e2e` (or the script named in the criteria) and inspect the Playwright report for failures. Also run `pnpm --filter (see criteria) test` if component tests exist.

Useful commands:

```
pnpm e2e
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-009-playwright-end-to-end-harness`; commit message and PR title `INF-009: Playwright end-to-end harness`.
