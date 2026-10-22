---
id: REC-010
title: Record page assembly
epic: REC
priority: must
verification: ui
size: M
status: ready
depends_on: [REC-002, REC-003, REC-004, REC-005, REC-006, REC-007, REC-008, REC-009, INF-009]
branch: story/REC-010-record-page-assembly
---

# REC-010: Record page assembly

## Context

Compose the earlier pieces into the page where players record spawns. Flow: choose map and channel, wait for the clock to sync, tap at each spawn (up to 10), submit, see the updated estimate.

## Depends on

- `REC-002`: Maps client and useMaps hook
- `REC-003`: useServerClock hook
- `REC-004`: Map and channel selector with remembered choice
- `REC-005`: Anonymous client id utility
- `REC-006`: useTapSession hook
- `REC-007`: TapButton component with Space hotkey
- `REC-008`: Submit client, hook and error messages
- `REC-009`: EstimateCard component
- `INF-009`: Playwright end-to-end harness

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/pages/RecordPage.tsx`
- `apps/web/src/pages/RecordPage.test.tsx`
- `apps/web/e2e/record.spec.ts`

## Contract

```
// data-testid: clock-status  -> "Syncing clock..." | "Clock synced (±{round(rttMs/2)} ms)" | "Clock sync failed"
//   map-select, channel-select (from MapChannelSelect), tap-button, tap-count, last-tap (TapButton),
//   undo-button ("Undo"), clear-button ("Clear"), submit-button ("Submit N taps"; disabled when 0 taps, no selection, or submitting),
//   estimate-* and confidence-badge (EstimateCard, shown after a successful submit), submit-error (role="alert", describeSubmitError text)
// Rules: tapping is disabled until the clock is ready AND a map and channel are chosen.
//   Changing map or channel clears the current taps. Successful submit clears taps and shows the returned estimate.
//   Request body: { mapId, channel, clientId: getClientId(), taps }.
```

## Acceptance criteria

1. Tap button is disabled until the clock is `ready` and both selects have a value.
2. Three taps then Submit sends one POST with 3 integer timestamps, the selected ids, and the client id; the page then shows `estimate-n` and clears `tap-count` to `0/10`.
3. Undo removes the last tap; Clear removes all; the submit button label reflects the count (`Submit 2 taps`).
4. Changing the channel after tapping resets the taps to zero.
5. A mocked 429 shows `submit-error` with the rate-limit message and keeps the taps.
6. Playwright (`record.spec.ts`, `/api/*` mocked with `page.route`, `/api/time` returns `Date.now()`): pressing Space 3 times then clicking Submit shows `estimate-n` = `3`.

## How to verify

Run `pnpm --filter @spawn-sync/web test` (component and hook tests). If a criterion mentions Playwright also run `pnpm e2e`. For a visual check run `pnpm dev:web` (start `pnpm dev:api` too if live data is needed).

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-010-record-page-assembly`; commit message and PR title `REC-010: Record page assembly`.
