---
id: H-003
title: Provide the real map list and channel count
epic: H
priority: must
verification: human
size: S
status: ready
depends_on: [DB-005, API-001]
branch: none
---

# H-003: Provide the real map list and channel count

## Context

Seed data ships with placeholder maps. Only a human who plays MapleLegends knows which maps matter and how many channels exist.

## Depends on

- `DB-005`: Map seed data and idempotent seed script
- `API-001`: Config parsing and route skeleton

## Actions (human)

- Edit `data/maps.json`: replace the placeholders with the real maps (unique integer `id`, `name`, optional `region`). Start with the maps you care about; more can be added later.
- Edit `apps/api/wrangler.toml` `[vars]`: set `MAX_CHANNEL` to the real number of channels (string value).
- Run `pnpm db:reset:local && pnpm db:seed:local` to confirm the data loads.

## Acceptance criteria

1. `data/maps.json` has no placeholder names (nothing starting with "Example Map") and unique ids.
2. `MAX_CHANNEL` matches the real channel count.
3. `pnpm db:reset:local && pnpm db:seed:local` completes without error.

## How to verify

A human checks each item and then sets `status: done`.

## Definition of done

- [ ] Every item above is complete.
- [ ] Set `status: done` in this file and commit it to `main`.
