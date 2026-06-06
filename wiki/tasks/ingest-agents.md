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
  - 'wiki/sources/agents-md.md'
  - 'wiki/sources/_index.md'
  - 'wiki/_index.md'
tags: [task, wiki, sources]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Ingest AGENTS.md as a wiki source

## Goal

Ingest the existing `AGENTS.md` file (the OpenCode agent rules: stack, commands, FSD rules, traps, wiki integration) into the wiki as a source summary. This makes the agent conventions findable from the wiki without re-reading the file every time.

## Acceptance Criteria

- [ ] `wiki/sources/agents-md.md` created with the source summary
- [ ] Summary includes: stack quick-reference, commands, FSD rules, traps, wiki integration
- [ ] Cross-references added to [[Concept: Feature-Sliced Design]], [[Hot Cache]] reading order
- [ ] `wiki/_index.md` updated to list the new source
- [ ] `wiki/hot.md` updated

## Files

This task touches only wiki files:

- `wiki/sources/agents-md.md` — new file
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
- 2026-06-06: Done. Created `wiki/sources/agents-md.md` with the full agent conventions summary (stack, commands, FSD rules, traps, testing notes, wiki integration). Both P1 ingestion tasks complete.

## Related

- [[Direction: Wiki Documentation]]
- [[Concept: Feature-Sliced Design]]
