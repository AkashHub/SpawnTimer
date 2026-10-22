---
id: H-004
title: Set production secrets
epic: H
priority: should
verification: human
size: S
status: ready
depends_on: [ADM-001, INF-010]
branch: none
---

# H-004: Set production secrets

## Context

The admin endpoint is protected by a bearer token. Turnstile (bot protection) is optional.

## Depends on

- `ADM-001`: Admin token middleware
- `INF-010`: Single-Worker deployment config and deploy workflow

## Actions (human)

- Generate a random token of at least 32 characters and store it in a password manager.
- Run `pnpm --filter @spawn-sync/api exec wrangler secret put ADMIN_TOKEN` and paste it.
- Optional: create a Cloudflare Turnstile widget; set `TURNSTILE_SECRET` with `wrangler secret put` and add the site key as a GitHub Actions variable `VITE_TURNSTILE_SITE_KEY`.

## Acceptance criteria

1. `wrangler secret list` shows `ADMIN_TOKEN`.
2. Calling `POST /api/admin/epoch` on the deployed site without a token returns 401.
3. No secret value appears in the repository or in CI logs.

## How to verify

A human checks each item and then sets `status: done`.

## Definition of done

- [ ] Every item above is complete.
- [ ] Set `status: done` in this file and commit it to `main`.
