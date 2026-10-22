---
id: LIB-010
title: Response schemas (Zod)
epic: LIB
priority: must
verification: unit
size: S
status: ready
depends_on: [LIB-009, LIB-006]
branch: story/LIB-010-response-schemas-zod
---

# LIB-010: Response schemas (Zod)

## Context

Every API response has a schema so the web client can validate what it receives and the API tests can assert shape. These are the canonical contracts.

## Depends on

- `LIB-009`: Request schemas (Zod)
- `LIB-006`: Confidence classification

## Scope

Files to create or modify (touch nothing else):

- `packages/shared/src/schemas/response.ts`
- `packages/shared/src/schemas/response.test.ts`

## Contract

```
export const ConfidenceSchema = z.enum(['low', 'medium', 'high']);
export const MapDtoSchema = z.object({ id: z.number().int(), name: z.string(), region: z.string().nullable() });
export const MapsResponseSchema = z.object({ maps: z.array(MapDtoSchema), channelCount: z.number().int().positive() });
export const TimeResponseSchema = z.object({ serverNow: z.number().int().positive() });
export const EstimateDtoSchema = z.object({
  mapId: z.number().int(), channel: z.number().int(), epochId: z.number().int(),
  meanPhaseMs: z.number().int().min(0).max(9999), r: z.number().min(0).max(1),
  spreadMs: z.number().int().min(0), n: z.number().int().min(0),
  confidence: ConfidenceSchema, updatedAt: z.number().int(),
});
export const ObservationResponseSchema = z.object({ accepted: z.number().int().min(1), estimate: EstimateDtoSchema });
export const PhasesResponseSchema = z.object({ epochId: z.number().int(), mapId: z.number().int(), estimates: z.array(EstimateDtoSchema) });
export const NamedEstimateSchema = EstimateDtoSchema.extend({ mapName: z.string() });
export const SyncMatchSchema = z.object({
  mapId: z.number().int(), mapName: z.string(), channel: z.number().int(),
  meanPhaseMs: z.number().int(), distanceMs: z.number().int(),
  confidence: ConfidenceSchema, n: z.number().int(), spreadMs: z.number().int(),
});
export const SyncResponseSchema = z.object({
  epochId: z.number().int(), tolMs: z.number().int(),
  reference: NamedEstimateSchema, matches: z.array(SyncMatchSchema),
});
export const SyncGroupSchema = z.object({
  members: z.array(z.object({ mapId: z.number().int(), channel: z.number().int(), meanPhaseMs: z.number().int() })),
  centerPhaseMs: z.number().int(), spanMs: z.number().int(),
});
export const OverviewResponseSchema = z.object({
  epochId: z.number().int(), tolMs: z.number().int(),
  estimates: z.array(NamedEstimateSchema), groups: z.array(SyncGroupSchema),
});
export const EpochDtoSchema = z.object({ id: z.number().int(), startedAt: z.number().int(), note: z.string().nullable() });
export const ErrorResponseSchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() }),
});
// plus `export type X = z.infer<typeof XSchema>` for every schema
```

## Acceptance criteria

1. Every schema above is exported with the exact name, plus an inferred type of the same base name (e.g. `EstimateDto`).
2. A fully valid fixture for each schema parses (fixtures live in the test file).
3. `EstimateDtoSchema` rejects `meanPhaseMs: 10000`, `r: 1.2`, `confidence: "great"`.
4. `ObservationResponseSchema` rejects `accepted: 0`.
5. `ErrorResponseSchema` accepts `{ error: { code: "X", message: "y" } }` and rejects a body without `error.code`.
6. `SyncResponseSchema` accepts `matches: []`.

## How to verify

Run `pnpm --filter @spawn-sync/shared test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/LIB-010-response-schemas-zod`; commit message and PR title `LIB-010: Response schemas (Zod)`.
