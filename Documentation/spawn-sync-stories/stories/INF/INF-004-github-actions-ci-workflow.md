---
id: INF-004
title: GitHub Actions CI workflow
epic: INF
priority: must
verification: infra
size: S
status: ready
depends_on: [INF-002, INF-003]
branch: story/INF-004-github-actions-ci-workflow
---

# INF-004: GitHub Actions CI workflow

## Context

Every PR must be verified automatically. The job id and name must be exactly `ci` so branch protection (H-002) can require it.

## Depends on

- `INF-002`: Add ESLint and Prettier
- `INF-003`: Vitest setup for the shared package

## Scope

Files to create or modify (touch nothing else):

- `.github/workflows/ci.yml`

## Acceptance criteria

1. Triggers: `pull_request` and `push` to `main`.
2. A single job with id and name `ci` on `ubuntu-latest`, Node 20, pnpm set up with caching.
3. Steps in order: checkout, setup, `pnpm install --frozen-lockfile`, `pnpm stories:validate`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
4. The file parses as valid YAML (`python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml'))"`).
5. No secrets or tokens appear in the file.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
Static review of the YAML (workflows cannot run locally); run each listed command locally to confirm they pass.
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-004-github-actions-ci-workflow`; commit message and PR title `INF-004: GitHub Actions CI workflow`.
