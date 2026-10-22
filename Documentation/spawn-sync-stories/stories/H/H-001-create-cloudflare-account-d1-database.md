---
id: H-001
title: Create Cloudflare account, D1 database and API token
epic: H
priority: must
verification: human
size: S
status: ready
depends_on: [INF-005]
branch: none
---

# H-001: Create Cloudflare account, D1 database and API token

## Context

Agents cannot create accounts or credentials. The app deploys to Cloudflare Workers with one D1 database named `spawn-sync-db`.

## Depends on

- `INF-005`: Cloudflare Worker scaffold with health endpoint

## Actions (human)

- Create or sign in to a Cloudflare account (free plan is enough).
- From the repo root run `pnpm --filter @spawn-sync/api exec wrangler login`, then `pnpm --filter @spawn-sync/api exec wrangler d1 create spawn-sync-db`.
- Copy the printed `database_id` into `apps/api/wrangler.toml`, replacing the all-zero placeholder. Commit on a branch `human/H-001` and open a PR.
- Create an API token (template "Edit Cloudflare Workers", plus D1 Edit permission). Note your Cloudflare Account ID. Store both in a password manager; never commit them.

## Acceptance criteria

1. `wrangler d1 list` shows a database named `spawn-sync-db`.
2. `apps/api/wrangler.toml` contains the real `database_id` (not all zeros) and keeps `database_name = "spawn-sync-db"`.
3. API token and Account ID are saved somewhere safe and are not in the repository.

## How to verify

A human checks each item and then sets `status: done`.

## Definition of done

- [ ] Every item above is complete.
- [ ] Set `status: done` in this file and commit it to `main`.
