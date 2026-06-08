---
type: task
status: todo
direction: ''
priority: 3
owner: 'unassigned'
started: ''
due: ''
depends_on: []
blocks: []
files: []
tags: [task]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Task: [Title]

## Goal

[One sentence. What does this task achieve?]

## Acceptance Criteria

- [ ] criterion 1
- [ ] criterion 2
- [ ] criterion 3

## Files

List the files this task touches so other agents know not to overlap:

- `src/path/to/file.ts` — what changes
- `src/path/to/another.ts` — what changes

## Dependencies

- [[Task: prerequisite-task-name]]

## Blocked By / Blocks

- **Blocked by**: [what's blocking?]
- **Blocks**: [what does this prevent from starting?]

## Status

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `owner`: which agent is working on this (e.g. `agent-a`, `agent-b`, `human`)
- `started`: YYYY-MM-DD when status moved to in-progress
- `due`: YYYY-MM-DD target completion

## Progress Log

- YYYY-MM-DD: [event]
- YYYY-MM-DD: [event]

## Related

- [[Direction: parent-direction]]
- [[Module: relevant-module]]
- [[ADR-XXX: related-decision]]
