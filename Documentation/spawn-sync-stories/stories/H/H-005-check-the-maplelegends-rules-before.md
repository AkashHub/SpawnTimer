---
id: H-005
title: Check the MapleLegends rules before publicizing
epic: H
priority: could
verification: human
size: S
status: ready
depends_on: []
branch: none
---

# H-005: Check the MapleLegends rules before publicizing

## Context

The tool is a manual stopwatch; it never reads or changes the game client. It is still worth confirming nothing in the server rules forbids sharing timing data.

## Depends on

None.

## Actions (human)

- Read the server rules / ask staff if unsure.
- Decide whether to announce the tool publicly or keep it to a group.

## Acceptance criteria

1. You have read the rules and decided how to share the tool.
2. If anything is a concern, an issue is opened in the repo describing it.
3. No code change is required.

## How to verify

A human checks each item and then sets `status: done`.

## Definition of done

- [ ] Every item above is complete.
- [ ] Set `status: done` in this file and commit it to `main`.
