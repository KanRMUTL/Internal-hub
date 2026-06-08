---
type: task
status: done
direction: 'Wiki Documentation'
priority: 2
owner: 'task-runner'
started: '2026-06-06'
due: ''
depends_on: []
blocks: []
files:
  - 'wiki/components/{button,card,modal,input,text-area,toggle,table,skeleton}.md'
  - 'wiki/components/_index.md'
tags: [task, wiki, components]
created: 2026-06-06
updated: 2026-06-06
---

# Task: Document shared/ui components (Card, Button, Modal, etc.)

## Goal

Create a wiki page for each significant shared UI component in `src/shared/ui/`. Currently `wiki/components/_index.md` is a stub. Each component page should document the API, visual states, and where it's used.

## Acceptance Criteria

- [ ] One page per significant component. Minimum viable list (8 pages):
  - [[Component: Button]] — variants, sizes, states
  - [[Component: Card]] — the surface primitive
  - [[Component: Modal]] — overlay + dialog + backdrop
  - [[Component: Input]] — text input, focus states
  - [[Component: TextArea]]
  - [[Component: Toggle]] / Switch
  - [[Component: Table]]
  - [[Component: Skeleton]]
- [ ] `wiki/components/_index.md` lists all components
- [ ] Each page uses `_templates/component.md`
- [ ] Pages link to the modules that use them

## Files

Wiki files only (no `src/`):

- `wiki/components/{button,card,modal,input,text-area,toggle,table,skeleton}.md`
- `wiki/components/_index.md` — populate

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
- 2026-06-06: Done. Created 8 component pages (Button, Card, Modal, Input, TextArea, Toggle, Table, Skeleton) with API tables + visual states + Used By sections. Populated `_index.md` with full layout/feedback/motion/a11y primitives list.

## Related

- [[Direction: Wiki Documentation]]
- [[Components Index]]
