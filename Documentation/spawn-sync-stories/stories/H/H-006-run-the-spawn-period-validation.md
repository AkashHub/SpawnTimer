---
id: H-006
title: Run the spawn-period validation experiment
epic: H
priority: must
verification: human
size: S
status: ready
depends_on: [LAB-002]
branch: none
---

# H-006: Run the spawn-period validation experiment

## Context

The whole design assumes (1) the spawn period is exactly 10 000 ms, (2) a combination's phase stays stable, and (3) phases change after a server restart. This experiment checks (1) and (2) before more is built on them.

## Depends on

- `LAB-002`: Period Lab page: results panel

## Actions (human)

- Start the web app (`pnpm dev:web`; the `/lab` page needs no backend) or use a deployed build.
- Stand in one map/channel for at least 10 minutes. On `/lab`, tap at every spawn (aim for 60+ taps).
- Write `docs/FINDINGS.md` with: measured period (ms), drift per hour, residual spread (ms), and notes about the conditions.
- If a server restart happens later, repeat on the same channel and note whether the phase changed.

## Acceptance criteria

1. `docs/FINDINGS.md` exists with the measured period, drift and spread.
2. If the measured period differs from 10 000 ms by more than 5 ms, an issue is opened to revisit the design (phase math assumes a fixed period).
3. The note states whether phase stayed stable during the session.

## How to verify

A human checks each item and then sets `status: done`.

## Definition of done

- [ ] Every item above is complete.
- [ ] Set `status: done` in this file and commit it to `main`.
