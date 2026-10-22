---
id: SYN-004
title: MatchesTable component
epic: SYN
priority: must
verification: ui
size: S
status: ready
depends_on: [INF-008, LIB-010, LIB-013]
branch: story/SYN-004-matchestable-component
---

# SYN-004: MatchesTable component

## Context

Shows combinations that are in sync with the reference, closest first (the API already sorts them).

## Depends on

- `INF-008`: Web test harness (Vitest + React Testing Library)
- `LIB-010`: Response schemas (Zod)
- `LIB-013`: Display formatting helpers

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/components/MatchesTable.tsx`
- `apps/web/src/components/MatchesTable.test.tsx`

## Contract

```
// <MatchesTable matches={SyncMatch[]} showLow={boolean} />
// Columns: Map, Ch, Phase (formatPhase), Distance (formatSignedMs), Confidence, Samples (n)
// Row: data-testid={`match-row-${mapId}-${channel}`}; keeps the order given.
// showLow=false hides rows with confidence "low"; if any were hidden render data-testid="hidden-low-note" text `${k} low-confidence result(s) hidden`
//   (use "result" for 1 and "results" for others).
// No rows to show -> data-testid="matches-empty" text "No other combinations within tolerance."
```

## Acceptance criteria

1. Three matches render three rows in the given order with the correct formatted values (`2.40 s`, `+100 ms`).
2. `showLow=false` hides a low-confidence row and shows `1 low-confidence result hidden`; two hidden shows `2 low-confidence results hidden`.
3. `showLow=true` shows all rows and no hidden note.
4. An empty array shows `matches-empty`; an array of only low rows with `showLow=false` shows `matches-empty` AND the hidden note.
5. Rows have unique `data-testid` values.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/SYN-004-matchestable-component`; commit message and PR title `SYN-004: MatchesTable component`.
