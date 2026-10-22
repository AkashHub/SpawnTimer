---
id: SEC-003
title: Per-IP rate limit (best effort)
epic: SEC
priority: could
verification: api
size: S
status: ready
depends_on: [SEC-006, INF-010]
branch: story/SEC-003-per-ip-rate-limit-best-effort
---

# SEC-003: Per-IP rate limit (best effort)

## Context

A single abuser can rotate `clientId` values. Add a coarse per-IP limit using the `CF-Connecting-IP` header. Check the current Cloudflare docs: use the Workers Rate Limiting binding if available on the free plan; otherwise use a best-effort in-memory limiter per isolate. Record which approach you chose in the PR. IP addresses must never be stored in D1.

## Depends on

- `SEC-006`: Request body size limit
- `INF-010`: Single-Worker deployment config and deploy workflow

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/ip-limit.ts`
- `apps/api/src/routes/observations.ts` (call it first)
- `apps/api/wrangler.toml` (only if a binding is used)
- `apps/api/test/ip-limit.test.ts`

## Contract

```
// Limit: 30 submissions (requests, not taps) per IP per 60 s. Exceeding -> 429 RATE_LIMITED with Retry-After.
// Missing CF-Connecting-IP header (local dev / tests) -> no IP limiting.
```

## Acceptance criteria

1. 31 requests within 60 s from the same `CF-Connecting-IP` get a 429 on the 31st (30 succeed).
2. Requests without the header are never limited by this check.
3. Different IPs are tracked independently.
4. No IP value is written to D1 or logged (test greps the DB row dump).

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-003-per-ip-rate-limit-best-effort`; commit message and PR title `SEC-003: Per-IP rate limit (best effort)`.
