---
id: INF-001
title: Monorepo scaffold with pnpm workspaces
epic: INF
priority: must
verification: infra
size: M
status: testing
depends_on: []
branch: story/INF-001-monorepo-scaffold-with-pnpm-workspaces
---

# INF-001: Monorepo scaffold with pnpm workspaces

## Context

Greenfield repository. We use a pnpm monorepo with three packages. The shared package is consumed by path (`@spawn-sync/shared/<file>`) so there is no barrel file and parallel stories do not collide.

## Depends on

None.

## Scope

Files to create or modify (touch nothing else):

- `package.json` (root, private, `engines.node >= 20`, `packageManager` set to the installed pnpm version)
- `pnpm-workspace.yaml` (`apps/*`, `packages/*`)
- `tsconfig.base.json`
- `.gitignore`, `.nvmrc`
- `apps/api/package.json` + `tsconfig.json` (name `@spawn-sync/api`)
- `apps/web/package.json` + `tsconfig.json` (name `@spawn-sync/web`)
- `packages/shared/package.json` + `tsconfig.json` (name `@spawn-sync/shared`) and `packages/shared/src/version.ts`

### Out of scope

- No frameworks, linting, or test runners yet (later INF stories).
- Do not add `scripts/stories.mjs` (already in the repo).

## Contract

```
// packages/shared/src/version.ts
export const SHARED_PACKAGE = '@spawn-sync/shared';

// packages/shared/package.json (relevant part)
{ "name": "@spawn-sync/shared", "private": true, "type": "module",
  "exports": { "./*": "./src/*.ts" } }

// root package.json scripts
"typecheck": "pnpm -r --if-present typecheck",
"build": "pnpm -r --if-present build",
"test": "pnpm -r --if-present test",
"lint": "echo 'lint not configured yet'",
"stories:list": "node scripts/stories.mjs list",
"stories:next": "node scripts/stories.mjs next",
"stories:validate": "node scripts/stories.mjs validate"
```

## Acceptance criteria

1. `pnpm install` succeeds from a clean checkout and creates `pnpm-lock.yaml`.
2. `pnpm -r list --depth -1` shows `@spawn-sync/api`, `@spawn-sync/web` and `@spawn-sync/shared`.
3. Each package has a `typecheck` script (`tsc --noEmit`) and `pnpm typecheck` exits 0.
4. A scratch file `apps/web/src/scratch.ts` containing `import { SHARED_PACKAGE } from "@spawn-sync/shared/version";` passes `pnpm typecheck` (delete the scratch file before committing).
5. `tsconfig.base.json` has `"strict": true`, `"noUncheckedIndexedAccess": true`, `"moduleResolution": "Bundler"`, `"target": "ES2022"`.
6. `pnpm stories:validate` prints `OK: <n> stories valid`.
7. `.gitignore` covers `node_modules`, `dist`, `.wrangler`, `.dev.vars`, `apps/api/seeds`, `*.log`, `playwright-report`, `test-results`.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm install && pnpm typecheck && pnpm stories:validate
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-001-monorepo-scaffold-with-pnpm-workspaces`; commit message and PR title `INF-001: Monorepo scaffold with pnpm workspaces`.
