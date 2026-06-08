---
type: task
status: done
direction: 'Wiki Documentation'
priority: 1
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on: []
blocks: []
files:
  - 'wiki/sources/product-md.md'
  - 'wiki/sources/_index.md'
  - '_templates/source.md'
tags: [task, wiki, sources]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Ingest PRODUCT.md as a wiki source

## Goal

Ingest the existing `PRODUCT.md` file (product context: register, users, brand personality, anti-references, design principles, accessibility) into the wiki as a source summary. This creates a persistent, cross-referenced record of the product strategy.

## Acceptance Criteria

- [ ] `wiki/sources/product-md.md` created with the source summary
- [ ] Summary includes: key principles, brand voice, anti-references, accessibility commitments
- [ ] Cross-references added to [[ADR-001: Direction 7 Design]] and [[Concept: Design System]]
- [ ] `wiki/_index.md` updated to list the new source
- [ ] `wiki/hot.md` updated to reflect the new knowledge

## Files

This task touches only wiki files (no `src/`):

- `wiki/sources/product-md.md` — new file
- `wiki/_index.md` — add to sources list
- `wiki/hot.md` — note the new source

## Dependencies

None.

## Blocked By / Blocks

- **Blocked by**: nothing
- **Blocks**: nothing

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- 2026-06-06: Task created during Wiki Documentation direction scaffold
- 2026-06-06: Done. Created `wiki/sources/product-md.md` with the full product context summary. Cross-referenced from `ADR-001: Direction 7 Design` and the sources index. Also added a reusable `source.md` template at `_templates/source.md`.

## Related

- [[Direction: Wiki Documentation]]
- [[Concept: Design System]]
- [[ADR-001: Direction 7 Design]]
