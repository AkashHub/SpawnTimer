---
id: REC-005
title: Anonymous client id utility
epic: REC
priority: must
verification: unit
size: S
status: ready
depends_on: [INF-008]
branch: story/REC-005-anonymous-client-id-utility
---

# REC-005: Anonymous client id utility

## Context

Each browser gets a random anonymous id sent with submissions (used only for rate limiting and recent-reset detection). No accounts.

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/lib/clientId.ts`
- `apps/web/src/lib/clientId.test.ts`

## Contract

```
export function getClientId(): string;   // matches /^[A-Za-z0-9-]{8,64}$/
// localStorage key 'ss_client_id'. Missing -> crypto.randomUUID() stored and returned. Storage throws -> a module-level in-memory id (stable for the page's lifetime).
```

## Acceptance criteria

1. First call generates an id matching the pattern and stores it under `ss_client_id`.
2. Second call returns the same id.
3. A pre-existing valid stored id is returned unchanged; a stored invalid value (e.g. `"x"`) is replaced.
4. With `localStorage` throwing on every access, two calls return the same non-empty id and nothing throws.

## How to verify

Run `pnpm --filter @spawn-sync/web test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-005-anonymous-client-id-utility`; commit message and PR title `REC-005: Anonymous client id utility`.
