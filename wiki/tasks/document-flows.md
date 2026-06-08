---
type: task
status: done
direction: 'Wiki Documentation'
priority: 3
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on: []
blocks: []
files:
  - 'wiki/flows/{create-room,add-member,remove-room,member-toggle}.md'
  - 'wiki/flows/_index.md'
tags: [task, wiki, flows]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Document remaining flows (member CRUD, room CRUD)

## Goal

Create flow pages for the main user journeys not yet documented. Currently only Spin the Wheel and Theme Toggle have flow pages.

## Acceptance Criteria

- [ ] One page per meaningful flow. Minimum viable list (4 pages):
  - [[Flow: Create Room]] — user opens modal, fills name + description, submits
  - [[Flow: Add Member]] — user opens Members modal, types name, submits
  - [[Flow: Remove Room]] — user clicks "..." menu on card, confirms
  - [[Flow: Member Toggle Active/Inactive]] — user toggles eye/eye-off on a member row
- [ ] `wiki/flows/_index.md` updated
- [ ] Each page uses `_templates/flow.md`

## Files

Wiki files only:

- `wiki/flows/{create-room,add-member,remove-room,member-toggle}.md`
- `wiki/flows/_index.md` — populate

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
- 2026-06-06: Done. Created 4 flow pages (Create Room, Add Member, Remove Room, Member Toggle) with triggers, steps, outcomes, error paths, and Known Limitations. Populated `_index.md` organized by category. All 5 Wiki Documentation tasks now done.

## Related

- [[Direction: Wiki Documentation]]
- [[Flows Index]]
- [[Flow: Spin the Wheel]] (existing)
- [[Flow: Theme Toggle]] (existing)
