---
id: API-005
title: GET /api/maps
epic: API
priority: must
verification: api
size: S
status: ready
depends_on: [API-002, DB-006, API-001]
branch: story/API-005-get-api-maps
---

# API-005: GET /api/maps

## Context

The frontend needs the list of maps and how many channels exist (from config).

## Depends on

- `API-002`: Error handling and 404
- `DB-006`: Repository: maps
- `API-001`: Config parsing and route skeleton

## Scope

Files to create or modify (touch nothing else):

- `apps/api/src/routes/maps.ts` (replace the stub)
- `apps/api/test/maps.test.ts`

## Contract

```
// 200  { "maps": [{ "id": 1, "name": "A", "region": null }], "channelCount": 20 }
// maps ordered by name (listMaps); channelCount from getConfig(env).channelCount
```

## Acceptance criteria

1. The body validates against `MapsResponseSchema`.
2. With no maps the response is `{ maps: [], channelCount: 20 }` (test env `MAX_CHANNEL` is 20).
3. With maps inserted as `b`, `A` the response lists A before b.
4. Changing the env `MAX_CHANNEL` to `"12"` for one request yields `channelCount: 12`.

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Then exercise the behavior for real: `pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api` and call the endpoint with `curl` against http://localhost:8787 (use `pnpm db:seed:fake:local` for richer data once it exists).

Useful commands:

```
pnpm db:reset:local && pnpm db:seed:local && pnpm dev:api then curl http://localhost:8787/api/maps
```

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/API-005-get-api-maps`; commit message and PR title `API-005: GET /api/maps`.
