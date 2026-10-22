---
id: INF-012
title: Record verified commands and versions in AGENTS.md
epic: INF
priority: should
verification: infra
size: S
status: ready
depends_on: [INF-009, INF-010]
branch: story/INF-012-record-verified-commands-and-versions-in
---

# INF-012: Record verified commands and versions in AGENTS.md

## Context

AGENTS.md section 9 is intentionally empty until the toolchain exists. Fill it with facts verified by actually running the commands.

## Depends on

- `INF-009`: Playwright end-to-end harness
- `INF-010`: Single-Worker deployment config and deploy workflow

## Scope

Files to create or modify (touch nothing else):

- `AGENTS.md`: section 9 only

## Acceptance criteria

1. Section 9 lists the actual versions of node, pnpm, typescript, vite, react, hono, wrangler, vitest, playwright, zod (read from `package.json`/lockfile).
2. Section 9 includes a table of every command in section 4 with a "verified on <date>" cell, each verified by running it (commands that cannot run in the environment are marked "not verified").
3. Section 9 records any deviation from section 2 (e.g. a different test setup) with a one-line reason.
4. No other section of AGENTS.md changes.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
Run each listed command.
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-012-record-verified-commands-and-versions-in`; commit message and PR title `INF-012: Record verified commands and versions in AGENTS.md`.
