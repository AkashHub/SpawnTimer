---
id: H-002
title: Configure GitHub repository, branch protection and secrets
epic: H
priority: must
verification: human
size: S
status: ready
depends_on: [INF-004]
branch: none
---

# H-002: Configure GitHub repository, branch protection and secrets

## Context

CI (INF-004) provides a job named `ci`. Merging should require it. Deploys (INF-010) need Cloudflare credentials as GitHub secrets.

## Depends on

- `INF-004`: GitHub Actions CI workflow

## Actions (human)

- Push this repository to GitHub (private or public).
- Settings > Branches: protect `main`; require a pull request, require status check `ci`, disallow force pushes.
- Settings > Secrets and variables > Actions: add secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (values from H-001; do this after H-001).
- Make sure agents can open PRs (a fine-grained token or the `gh` CLI logged in on the machine running agents).

## Acceptance criteria

1. Branch protection on `main` requires the `ci` check and a PR.
2. The two Cloudflare secrets exist under Actions secrets.
3. A test PR from a throwaway branch shows the `ci` check running.

## How to verify

A human checks each item and then sets `status: done`.

## Definition of done

- [ ] Every item above is complete.
- [ ] Set `status: done` in this file and commit it to `main`.
