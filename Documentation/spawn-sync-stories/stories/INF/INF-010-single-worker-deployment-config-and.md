---
id: INF-010
title: Single-Worker deployment config and deploy workflow
epic: INF
priority: must
verification: infra
size: M
status: ready
depends_on: [INF-005, INF-007, H-001, H-002, DB-005]
branch: story/INF-010-single-worker-deployment-config-and
---

# INF-010: Single-Worker deployment config and deploy workflow

## Context

Production is ONE Cloudflare Worker that serves the API under `/api/*` and the built SPA as static assets (with single-page-app fallback). Verify the exact config keys against current Cloudflare "Workers static assets" docs; do not guess them.

## Depends on

- `INF-005`: Cloudflare Worker scaffold with health endpoint
- `INF-007`: Web app scaffold with routes and layout
- `H-001`: Create Cloudflare account, D1 database and API token
- `H-002`: Configure GitHub repository, branch protection and secrets
- `DB-005`: Map seed data and idempotent seed script

## Scope

Files to create or modify (touch nothing else):

- `apps/api/wrangler.toml`: add an assets section pointing at `../web/dist`, SPA fallback enabled, Worker runs first for `/api/*`
- `.github/workflows/deploy.yml`
- Root `package.json`: script `build:web` -> `pnpm --filter @spawn-sync/web build`
- `docs/DEPLOYMENT.md` (how deploys work, required secrets, rollback)

### Out of scope

- Do not run a real deploy. Do not commit credentials.

## Acceptance criteria

1. `pnpm build:web && pnpm --filter @spawn-sync/api exec wrangler deploy --dry-run` succeeds and reports the assets directory.
2. Requests to `/api/*` reach the Worker; other paths fall back to `index.html` (documented in the config comments).
3. `deploy.yml` runs only on push to `main`, after the same checks as CI, then: build web, `wrangler d1 migrations apply spawn-sync-db --remote`, generate seeds and apply them remotely (idempotent), `wrangler deploy`.
4. `deploy.yml` reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from GitHub secrets only.
5. `docs/DEPLOYMENT.md` exists and lists the manual steps (H-001, H-002, H-004).

## How to verify

Run the commands listed in the criteria and below. Workflow files cannot run locally: review the YAML statically and run each command it contains.

Useful commands:

```
pnpm build:web && pnpm --filter @spawn-sync/api exec wrangler deploy --dry-run
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/INF-010-single-worker-deployment-config-and`; commit message and PR title `INF-010: Single-Worker deployment config and deploy workflow`.
