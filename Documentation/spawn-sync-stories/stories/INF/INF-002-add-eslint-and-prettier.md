---
id: INF-002
title: Add ESLint and Prettier
epic: INF
priority: must
verification: infra
size: S
status: ready
depends_on: [INF-001]
branch: story/INF-002-add-eslint-and-prettier
---

# INF-002: Add ESLint and Prettier

## Context

We want one lint command (`pnpm lint`) that checks code style and common bugs for every package.

## Depends on

- `INF-001`: Monorepo scaffold with pnpm workspaces

## Scope

Files to create or modify (touch nothing else):

- `eslint.config.js` (flat config, typescript-eslint recommended, ignore `dist`, `.wrangler`, `node_modules`)
- `.prettierrc` (single quotes, semicolons, trailing commas `all`, print width 100)
- `.prettierignore` (`stories`, `docs`, `prompts`, `AGENTS.md`, `pnpm-lock.yaml`, `.wrangler`, `dist`, `*.md`)
- Root `package.json`: replace the placeholder `lint` script; add `format` script (`prettier --write .`); add devDependencies `eslint`, `typescript-eslint`, `prettier`, `eslint-config-prettier`

## Acceptance criteria

1. `pnpm lint` runs `eslint .` then `prettier --check .` and exits 0 on the repository.
2. Adding a scratch file with `const x: any = 1; export { x };` makes `pnpm lint` exit non-zero (rule `@typescript-eslint/no-explicit-any` is an error). Delete the scratch file afterwards.
3. A badly formatted scratch `.ts` file makes `pnpm lint` exit non-zero; `pnpm format` fixes it.
4. Markdown under `stories/`, `docs/`, `prompts/` is not checked by Prettier.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm lint
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-002-add-eslint-and-prettier`; commit message and PR title `INF-002: Add ESLint and Prettier`.
