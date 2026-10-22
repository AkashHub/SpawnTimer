---
id: REC-008
title: Submit client, hook and error messages
epic: REC
priority: must
verification: ui
size: S
status: ready
depends_on: [REC-001, LIB-009, LIB-010]
branch: story/REC-008-submit-client-hook-and-error-messages
---

# REC-008: Submit client, hook and error messages

## Context

Submitting taps is a mutation. Failure messages must be human-friendly and keyed by API error code.

## Depends on

- `REC-001`: Web API client core and time sampler
- `LIB-009`: Request schemas (Zod)
- `LIB-010`: Response schemas (Zod)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/api/observations.ts`
- `apps/web/src/hooks/useSubmitTaps.ts`
- `apps/web/src/lib/errors.ts`
- `apps/web/src/hooks/useSubmitTaps.test.tsx`, `apps/web/src/lib/errors.test.ts`

## Contract

```
export function submitObservations(req: ObservationRequest): Promise<ObservationResponse>;  // POST /api/observations
export function useSubmitTaps(): UseMutationResult<ObservationResponse, ApiError, ObservationRequest>;
export function describeSubmitError(err: unknown): string;
//   RATE_LIMITED            -> "Too many submissions. Wait a minute and try again."
//   CLOCK_SKEW              -> "Your clock sync looks off. Reload the page and try again."
//   UNKNOWN_MAP             -> "That map no longer exists."
//   INVALID_CHANNEL         -> "That channel does not exist."
//   CAPTCHA_REQUIRED/FAILED -> "Verification failed. Reload and try again."
//   NETWORK                 -> "Cannot reach the server."
//   anything else           -> "Something went wrong. Try again."
```

## Acceptance criteria

1. The mutation POSTs the request body unchanged to `/api/observations` and resolves with a validated `ObservationResponse`.
2. Every code in the table above maps to the exact message; a non-ApiError value maps to the default message.
3. A mocked 429 puts the mutation in error state with `error.code === "RATE_LIMITED"`.
4. The request body is validated with `ObservationRequestSchema` before sending; an invalid request (0 taps) rejects without calling `fetch`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-008-submit-client-hook-and-error-messages`; commit message and PR title `REC-008: Submit client, hook and error messages`.
