---
id: SEC-008
title: Privacy audit and PRIVACY.md
epic: SEC
priority: should
verification: unit
size: S
status: ready
depends_on: [DB-004, SEC-002]
branch: story/SEC-008-privacy-audit-and-privacy-md
---

# SEC-008: Privacy audit and PRIVACY.md

## Context

We promise: no accounts, no personal data, random anonymous `clientId`, IPs never stored.

## Depends on

- `DB-004`: Phase estimates table
- `SEC-002`: Per-client submission rate limit

## Scope

Files to create or modify (touch nothing else):

- `docs/PRIVACY.md`
- `apps/api/test/privacy.test.ts`

## Acceptance criteria

1. A test reads every table schema (`PRAGMA table_info`) and asserts no column name contains `ip`, `email`, `user_agent` or `ua`.
2. A test submits observations with `CF-Connecting-IP` and `User-Agent` headers set and asserts no stored value in any table contains those strings.
3. `docs/PRIVACY.md` lists exactly what is stored (per table) and what is not, in plain language, under 60 lines.
4. `docs/PRIVACY.md` states how long data is kept (state "indefinitely until the epoch is pruned manually").

## How to verify

Run `pnpm --filter @spawn-sync/api test`. Each acceptance criterion should map to an assertion. Re-derive the expected values yourself instead of copying them from the tests.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SEC-008-privacy-audit-and-privacy-md`; commit message and PR title `SEC-008: Privacy audit and PRIVACY.md`.
