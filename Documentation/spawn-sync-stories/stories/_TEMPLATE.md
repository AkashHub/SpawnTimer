---
id: XXX-000
title: Short imperative title
epic: XXX
priority: must            # must | should | could
verification: unit        # unit | api | ui | e2e | infra | human
size: S                   # S (<150 changed lines) | M (<300)
status: ready             # ready | in-progress | testing | done | blocked
depends_on: []
branch: story/XXX-000-short-slug
---

# XXX-000: Short imperative title

## Context
Two to five sentences: why this exists and any domain facts the agent needs. Do not assume the agent has read other documents.

## Depends on
- `YYY-001`: title (why it is needed)

## Scope
Files to create or modify (touch nothing else):
- `path/to/file.ts`: what goes in it

### Out of scope
- Things an agent might be tempted to do but must not.

## Contract
```ts
// exact signatures, request/response shapes, test ids
```

## Acceptance criteria
1. Observable, checkable statement with concrete values.
2. ...

## How to verify
Commands or steps a tester can run without reading the code.

## Definition of done
- [ ] Every acceptance criterion passes, with automated tests where possible.
- [ ] Only files listed in Scope were changed.
- [ ] Repo checks in AGENTS.md (section 4) that exist pass.
- [ ] Final commit sets `status: testing`; commit/PR title `XXX-000: Short imperative title`.
