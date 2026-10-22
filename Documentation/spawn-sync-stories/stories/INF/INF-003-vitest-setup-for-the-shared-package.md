---
id: INF-003
title: Vitest setup for the shared package
epic: INF
priority: must
verification: infra
size: S
status: ready
depends_on: [INF-001]
branch: story/INF-003-vitest-setup-for-the-shared-package
---

# INF-003: Vitest setup for the shared package

## Context

Pure logic in `packages/shared` is tested with Vitest. Root `pnpm test` already forwards to each package's `test` script.

## Depends on

- `INF-001`: Monorepo scaffold with pnpm workspaces

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/package.json`: add devDependency `vitest`, script `"test": "vitest run"`
- `packages/shared/vitest.config.ts` (environment `node`, include `src/**/*.test.ts`)
- `packages/shared/src/version.test.ts`

## Acceptance criteria

1. `pnpm --filter @spawn-sync/shared test` runs and passes at least 1 test.
2. `version.test.ts` asserts `SHARED_PACKAGE === "@spawn-sync/shared"`.
3. `pnpm test` from the root exits 0.
4. Changing the assertion to a wrong value makes `pnpm test` exit non-zero (tester checks, then reverts).

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm test
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-003-vitest-setup-for-the-shared-package`; commit message and PR title `INF-003: Vitest setup for the shared package`.
