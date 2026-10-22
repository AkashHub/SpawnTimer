---
id: LIB-009
title: Request schemas (Zod)
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-001, INF-003]
branch: story/LIB-009-request-schemas-zod
---

# LIB-009: Request schemas (Zod)

## Context

Request validation is shared by the web client and the Worker, so both reject the same bad inputs. Add `zod` as a dependency of `packages/shared`.

## Depends on

- `LIB-001`: Constants and phaseOf
- `INF-003`: Vitest setup for the shared package

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/package.json` (dependency `zod`)
- `packages/shared/src/schemas/request.ts`
- `packages/shared/src/schemas/request.test.ts`

## Contract

```
import { z } from 'zod';
export const ObservationRequestSchema = z.object({
  mapId: z.number().int().positive(),
  channel: z.number().int().min(1).max(100),
  clientId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
  taps: z.array(z.number().int().positive()).min(1).max(MAX_TAPS_PER_REQUEST),
  turnstileToken: z.string().min(1).max(2048).optional(),
});
export type ObservationRequest = z.infer<typeof ObservationRequestSchema>;

// Query schemas use coercion (query strings are text)
export const PhasesQuerySchema   = z.object({ mapId: z.coerce.number().int().positive() });
export const SyncQuerySchema     = z.object({
  mapId: z.coerce.number().int().positive(),
  channel: z.coerce.number().int().min(1).max(100),
  tol: z.coerce.number().int().min(TOLERANCE_MIN_MS).max(TOLERANCE_MAX_MS).default(TOLERANCE_DEFAULT_MS),
});
export const OverviewQuerySchema = z.object({
  tol: z.coerce.number().int().min(TOLERANCE_MIN_MS).max(TOLERANCE_MAX_MS).default(TOLERANCE_DEFAULT_MS),
});
```

## Acceptance criteria

1. A valid observation (`mapId 1, channel 3, clientId "abcdefgh-1234", taps [1700000000000]`) parses.
2. Rejected: `taps: []`, 11 taps, `channel: 0`, `channel: 101`, `mapId: 1.5`, `clientId: "short"`, `clientId: "has space 123"`, negative or non-integer tap.
3. `SyncQuerySchema.parse({ mapId: "2", channel: "5" })` returns `{ mapId: 2, channel: 5, tol: 300 }`.
4. `SyncQuerySchema` rejects `tol: "10"` (below 50) and `tol: "2000"` (above 1000).
5. `OverviewQuerySchema.parse({})` returns `{ tol: 300 }`.
6. `PhasesQuerySchema` rejects a missing `mapId`.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-009-request-schemas-zod`; commit message and PR title `LIB-009: Request schemas (Zod)`.
