---
id: INF-007
title: Web app scaffold with routes and layout
epic: INF
priority: must
verification: ui
size: M
status: ready
depends_on: [INF-001]
branch: story/INF-007-web-app-scaffold-with-routes-and-layout
---

# INF-007: Web app scaffold with routes and layout

## Context

The SPA has these pages: Record, Sync Finder, Overview, About, Period Lab, Admin. Page content comes from later stories; this story only builds the shell. `App` must NOT create its own router (so tests can wrap it in `MemoryRouter`); `main.tsx` provides `BrowserRouter`.

## Depends on

- `INF-001`: Monorepo scaffold with pnpm workspaces

## Scope

Files to create or modify (touch nothing else):

- `apps/web/package.json`: react, react-dom, react-router-dom, @tanstack/react-query, tailwindcss (+ its Vite plugin or PostCSS setup), vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom; scripts `dev` (port 5173), `build`, `typecheck`
- `apps/web/index.html`, `apps/web/vite.config.ts` (proxy `/api` -> `http://localhost:8787`)
- `apps/web/src/main.tsx` (QueryClientProvider + BrowserRouter)
- `apps/web/src/App.tsx` (layout + Routes)
- `apps/web/src/index.css` (Tailwind)
- `apps/web/src/pages/RecordPage.tsx`, `SyncPage.tsx`, `OverviewPage.tsx`, `AboutPage.tsx`, `LabPage.tsx`, `AdminPage.tsx`
- Root `package.json`: script `dev:web`

## Contract

```
// Routes
/            -> redirect to /record
/record      -> RecordPage    <h1 data-testid="page-title">Record</h1>
/sync        -> SyncPage      <h1 data-testid="page-title">Sync Finder</h1>
/overview    -> OverviewPage  <h1 data-testid="page-title">Overview</h1>
/about       -> AboutPage     <h1 data-testid="page-title">About</h1>
/lab         -> LabPage       <h1 data-testid="page-title">Period Lab</h1>
/admin       -> AdminPage     <h1 data-testid="page-title">Admin</h1>

// Header nav (data-testid="nav"): links with text Record, Sync Finder, Overview, About
// (Lab and Admin are reachable by URL only). Layout is responsive (usable at 360px width).
// Pages are named exports: export function RecordPage() { ... }
// App.tsx: export function App() -> layout with <Routes>; no Router inside.
```

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` pass.
2. `pnpm dev:web` serves http://localhost:5173 and `/` redirects to `/record`.
3. Each route renders its `page-title` heading with the exact text in the contract.
4. The nav contains exactly the four links listed and highlights the active one (e.g. `aria-current="page"`).
5. Unknown routes render a simple "Page not found" message with a link to `/record`.

## How to verify

Run `pnpm --filter (see criteria) test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

Useful commands:

```
pnpm build
pnpm dev:web and open each route
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-007-web-app-scaffold-with-routes-and-layout`; commit message and PR title `INF-007: Web app scaffold with routes and layout`.
