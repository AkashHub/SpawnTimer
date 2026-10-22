---
id: REC-011
title: Mobile layout and accessibility for the record page
epic: REC
priority: should
verification: e2e
size: S
status: ready
depends_on: [REC-010]
branch: story/REC-011-mobile-layout-and-accessibility-for-the
---

# REC-011: Mobile layout and accessibility for the record page

## Context

Many players will use a phone next to the game. The tap target must be large and the page must work with a screen reader.

## Depends on

- `REC-010`: Record page assembly

## Scope

Files to create or modify (touch nothing else):

- `apps/web/src/pages/RecordPage.tsx`
- `apps/web/src/components/TapButton.tsx`
- `apps/web/e2e/record-mobile.spec.ts`

## Acceptance criteria

1. At viewport 360x640 the `tap-button` is at least 96 px tall and at least 200 px wide (measured in Playwright).
2. At 360 px width the document has no horizontal scroll (`scrollWidth <= clientWidth`).
3. Both selects are reachable by label (`getByLabelText("Map")`, `getByLabelText("Channel")`).
4. `tap-count` has `aria-live="polite"`; `submit-error` has `role="alert"`.
5. All interactive elements show a visible focus ring (class or outline) when focused via keyboard (assert computed outline is not `none`).

## How to verify

Run `pnpm e2e` (or the script named in the criteria) and inspect the Playwright report for failures. Also run `pnpm --filter @spawn-sync/web test` if component tests exist.

## Definition of done

- [ ] Every acceptance criterion passes, with automated tests wherever the criterion can be automated.
- [ ] Only files listed in Scope were changed (plus `package.json` / `pnpm-lock.yaml` for dependencies this story names).
- [ ] The repo checks in AGENTS.md section 4 that exist at this point pass.
- [ ] The final commit sets `status: testing` in this file's front matter.
- [ ] Branch `story/REC-011-mobile-layout-and-accessibility-for-the`; commit message and PR title `REC-011: Mobile layout and accessibility for the record page`.
