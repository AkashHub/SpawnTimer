---
id: INF-008
title: Web test harness (Vitest + React Testing Library)
epic: INF
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-007, INF-003]
branch: story/INF-008-web-test-harness-vitest-react-testing
---

# INF-008: Web test harness (Vitest + React Testing Library)

## Context

Component and hook tests for the SPA run in Vitest with jsdom and React Testing Library.

## Depends on

- `INF-007`: Web app scaffold with routes and layout
- `INF-003`: Vitest setup for the shared package

## Scope

Files to create or modify (touch nothing else):

- `apps/web/package.json`: devDependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`; script `"test": "vitest run"`
- `apps/web/vitest.config.ts` (jsdom, setup file, globals off)
- `apps/web/src/test/setup.ts` (jest-dom matchers, cleanup)
- `apps/web/src/test/utils.tsx`
- `apps/web/src/App.test.tsx`

## Contract

```
// apps/web/src/test/utils.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  opts?: { route?: string }          // default '/'
): ReturnType<typeof render> & { queryClient: QueryClient };
// wraps ui in QueryClientProvider (retry: false, gcTime: 0) and MemoryRouter initialEntries=[route]
```

## Acceptance criteria

1. `pnpm --filter @spawn-sync/web test` passes.
2. `App.test.tsx` renders `<App />` via `renderWithProviders` at route `/record` and asserts `page-title` has text `Record`.
3. A second test renders at `/nope` and asserts the text `Page not found`.
4. `renderWithProviders` creates a fresh QueryClient per call.
5. Root `pnpm test` includes the web tests and exits 0.

## How to verify

Run `pnpm --filter (see criteria) test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

Useful commands:

```
pnpm test
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-008-web-test-harness-vitest-react-testing`; commit message and PR title `INF-008: Web test harness (Vitest + React Testing Library)`.
