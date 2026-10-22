# AGENTS.md: rules for every agent working on this repository

You are working on **Spawn Sync Tracker**, a small web app where MapleLegends players record monster spawn timings per map and channel, so the community can find map/channel combinations that spawn in sync. Read `docs/ARCHITECTURE.md` once for background. Your actual task is always **one story file** in `stories/`.

## 1. Golden rules

1. **Do exactly one story per session.** The story file is your whole assignment. Do not start other stories or "improve" unrelated code.
2. **Touch only the files listed in the story's Scope.** Exceptions: `package.json` and `pnpm-lock.yaml` when the story allows a dependency, and the `status:` line of your own story file.
3. **Do not guess.** If the story is ambiguous, contradicts the code, or a dependency is missing, stop and report `BLOCKED: <specific question>`. A wrong guess costs more than a question.
4. **No new dependencies** unless the story names them. Prefer the platform and existing packages.
5. **Never commit secrets.** Local secrets go in `apps/api/.dev.vars` (gitignored). Use `.dev.vars.example` for documentation.
6. **Never merge your own PR, force-push, or rewrite history.**
7. **Do not edit other story files**, `stories/INDEX.md`, or this file, unless your story says so.

## 2. Stack (fixed)

| Area | Choice |
|---|---|
| Language | TypeScript (strict), Node >= 20, pnpm workspaces |
| Frontend | React + Vite + Tailwind CSS + React Router + TanStack Query |
| API | Hono on Cloudflare Workers |
| Database | Cloudflare D1 (SQLite), plain SQL migrations, no ORM |
| Validation | Zod (schemas shared between web and api) |
| Tests | Vitest (shared, api via `@cloudflare/vitest-pool-workers`, web via jsdom + React Testing Library), Playwright for e2e |
| Hosting | One Cloudflare Worker serving the API and the built SPA (static assets) |

Exact tool versions are recorded in section 9 once INF-012 is done. Until then, use the latest stable releases and keep them pinned in `package.json` / the lockfile.

## 3. Repository layout

```
apps/api/            Worker: src/index.ts, src/routes/*.ts, src/db/*.ts, src/lib/*.ts, migrations/, test/
apps/web/            SPA: src/pages, src/components, src/hooks, src/api, src/lib, e2e/
packages/shared/     Pure TS: src/*.ts and src/schemas/*.ts (no barrel file)
data/maps.json       Map list used for seeding
scripts/             Node scripts (stories.mjs, seed scripts)
stories/             User stories (one file each) + INDEX.md
docs/                ARCHITECTURE.md, WORKFLOW.md, FINDINGS.md (human-written)
prompts/             Builder and tester prompt templates
```

Package names: `@spawn-sync/shared`, `@spawn-sync/api`, `@spawn-sync/web`.

## 4. Commands

Run from the repo root. Commands appear as the INF stories land; use the ones that exist.

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm lint` | ESLint + Prettier check |
| `pnpm typecheck` | `tsc --noEmit` in every package |
| `pnpm test` | All unit/API/component tests (Vitest) |
| `pnpm build` | Build every package |
| `pnpm dev:api` | Local Worker on http://localhost:8787 (local D1, cache disabled) |
| `pnpm dev:web` | Vite on http://localhost:5173, proxies `/api` to 8787 |
| `pnpm db:migrate:local` | Apply migrations to the local D1 |
| `pnpm db:reset:local` | Wipe local D1 state, then migrate |
| `pnpm db:seed:local` | Seed maps into local D1 (idempotent) |
| `pnpm db:seed:fake:local` | Seed fake observations and estimates (dev only) |
| `pnpm e2e` | Playwright tests |
| `pnpm stories:next` / `stories:list` / `stories:validate` | Story tooling (`scripts/stories.mjs`) |

## 5. Code conventions

- TypeScript `strict`; no `any` (use `unknown` + narrowing); no non-null `!` assertions without a comment explaining why.
- Named exports only (default export only where a framework requires it, e.g. the Worker entry).
- **No barrel files.** Import by path: `@spawn-sync/shared/circular`, `../db/maps`. This keeps parallel stories from colliding.
- **One route per file** in `apps/api/src/routes/`. Route files are pre-created by API-001; each story edits only its own route file.
- **Time:** all timestamps are integer **milliseconds since the Unix epoch (UTC)**. Phase is an integer `0..9999`. Never use floats for stored times.
- **Names:** `mapId`, `channel`, `epochId`, `meanPhaseMs`, `spreadMs`, `tolMs`, `clientId` (camelCase in JSON/TS, snake_case in SQL).
- **SQL:** parameterized statements only (`.bind(...)`); never string-concatenate values into SQL.
- Keep functions small and pure where possible; put all SQL in `apps/api/src/db/*.ts`.
- Comments explain why, not what. No commented-out code.

## 6. API conventions

- Base path `/api`. JSON in and out. Success bodies match the Zod schemas in `@spawn-sync/shared/schemas/response`.
- Errors always use this shape, with an HTTP status that matches:

```json
{ "error": { "code": "INVALID_BODY", "message": "Human readable", "details": {} } }
```

| Code | Status | Meaning |
|---|---|---|
| `INVALID_BODY` / `INVALID_QUERY` | 400 | Zod validation failed |
| `INVALID_CHANNEL` | 400 | Channel outside `1..MAX_CHANNEL` |
| `CLOCK_SKEW` | 400 | A tap timestamp is more than 30 s from server time |
| `UNAUTHORIZED` | 401 | Missing/wrong admin token |
| `UNKNOWN_MAP` / `NO_ESTIMATE` / `NOT_FOUND` | 404 | Resource not found |
| `PAYLOAD_TOO_LARGE` | 413 | Body too big |
| `RATE_LIMITED` | 429 | Too many submissions |
| `NOT_IMPLEMENTED` | 501 | Stub route (replaced by its own story) |
| `INTERNAL` | 500 | Unexpected error |

## 7. Testing rules

- Every acceptance criterion that can be automated **must** have an automated test in the same story.
- Tests are deterministic: no real network, no real clock dependence (use fake timers), seeded randomness (`LIB-011`).
- API tests run against a real local D1 via the Workers Vitest pool; call the app through the helpers in `apps/api/test/helpers.ts`.
- Web component tests use React Testing Library. Use the `data-testid` values given in the story, exactly.
- A test that only restates the implementation is not a test. Prefer concrete input/output values from the story.

## 8. Git conventions

- Start from an up-to-date `main`. Branch name is in the story front matter (`story/<ID>-<slug>`).
- One story = one branch = one PR. Commit message and PR title: `<ID>: <title>`.
- Your final commit sets `status: testing` in your story's front matter. The tester sets `status: done`.
- If you must deviate from the story, say so in the PR description under "Deviations".

## 9. Verified environment

_Filled in by story INF-012. Until then this section is empty._
