---
id: INF-011
title: Weekly D1 backup workflow
epic: INF
priority: could
verification: infra
size: S
status: ready
depends_on: [H-001, H-002, DB-004]
branch: story/INF-011-weekly-d1-backup-workflow
---

# INF-011: Weekly D1 backup workflow

## Context

D1 data is the only state. A weekly export gives a restore point independent of Cloudflare retention.

## Depends on

- `H-001`: Create Cloudflare account, D1 database and API token
- `H-002`: Configure GitHub repository, branch protection and secrets
- `DB-004`: Phase estimates table

## Scope

Files to create or modify (touch nothing else):

- `.github/workflows/backup.yml`

## Acceptance criteria

1. Triggers: `schedule` (weekly) and `workflow_dispatch`.
2. Runs `wrangler d1 export spawn-sync-db --remote --output backup.sql` using the Cloudflare secrets.
3. Uploads `backup.sql` as an artifact with 30-day retention.
4. The file parses as valid YAML and contains no hard-coded credentials.

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
Static review of the YAML.
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-011-weekly-d1-backup-workflow`; commit message and PR title `INF-011: Weekly D1 backup workflow`.
