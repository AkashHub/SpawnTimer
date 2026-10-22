---
id: SEC-004
title: Optional Turnstile verification
epic: SEC
priority: could
verification: api
size: S
status: ready
depends_on: [SEC-003]
branch: story/SEC-004-optional-turnstile-verification
---

# SEC-004: Optional Turnstile verification

## Context

If the site attracts bots, Cloudflare Turnstile can gate submissions. It is enabled only when `TURNSTILE_SECRET` is set; otherwise nothing changes.

## Depends on

- `SEC-003`: Per-IP rate limit (best effort)

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/lib/turnstile.ts`
- `apps/api/src/routes/observations.ts` (call after body validation)
- `apps/api/test/turnstile.test.ts`

## Contract

```
export async function verifyTurnstile(env: Env, token: string | undefined, fetcher?: typeof fetch): Promise<void>;
// env.TURNSTILE_SECRET unset -> return (no-op)
// token missing -> ApiError(400, 'CAPTCHA_REQUIRED', 'Verification required')
// POST https://challenges.cloudflare.com/turnstile/v0/siteverify with secret + response (form body); success !== true -> ApiError(400, 'CAPTCHA_FAILED', 'Verification failed')
// network error -> ApiError(503, 'CAPTCHA_UNAVAILABLE', ...)
```

## Acceptance criteria

1. Without `TURNSTILE_SECRET`, submissions behave exactly as before.
2. With the secret set and no token: 400 `CAPTCHA_REQUIRED`.
3. With a mocked fetcher returning `{ success: false }`: 400 `CAPTCHA_FAILED`; returning `{ success: true }`: submission proceeds.
4. Fetcher throwing: 503 `CAPTCHA_UNAVAILABLE`.
5. Tests never call the real network.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-004-optional-turnstile-verification`; commit message and PR title `SEC-004: Optional Turnstile verification`.
