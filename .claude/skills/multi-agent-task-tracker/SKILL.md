---
name: multi-agent-task-tracker
description: 'When multiple agents (or humans) work on the same project, set up a task-tracking system with: directions (long-running initiatives) → tasks (concrete work) → file-locks (conflict avoidance). The file-locks in frontmatter are the source of truth for who owns which files. Works in any wiki, kanban, or markdown-based system.'
---

# Multi-Agent Task Tracker

When multiple agents (or humans) work on the same project simultaneously, they need a coordination layer that prevents:

- Two agents editing the same file at the same time
- One agent starting a task that depends on another agent's in-progress work
- Context loss when switching between agents

This skill describes a **task-tracking system** that solves these problems with simple markdown frontmatter, no special tooling required.

## Core Idea: File-Locks in Frontmatter

The key insight is that **the `files` field in a task's frontmatter is the conflict-avoidance contract**. When you claim a task, you also claim the files it touches. Other agents see your claim and stay out of those files.

```yaml
---
type: task
status: in-progress
direction: 'Direction 7 Integration'
owner: 'agent-a'
files:
  - 'src/features/fortune/ui/WheelOfFortune.tsx'
  - 'src/features/fortune/config/wheelConstant.ts'
---
```

Other agents reading the wiki can see: "agent-a is editing WheelOfFortune.tsx. I should not touch it."

## When to Use

- Multiple agents (Claude, GPT, OpenCode, etc.) are working on the same project
- A single project has long-running work that spans many sessions
- The project has a wiki, kanban board, or any markdown-based context hub
- Work is parallelizable but conflict-prone (e.g. design system work + feature work)

## When NOT to Use

- A single agent working alone (use a TODO list)
- Throwaway work that won't be revisited
- The coordination overhead exceeds the work (a 10-minute task doesn't need a tracker)

## The Two-Level Hierarchy

**Directions** = long-running initiatives. One per owner. They span weeks.

**Tasks** = concrete units of work. One per file-locked scope. They fit in a session.

```
directions/                           tasks/
├── _index.md                         ├── _index.md
├── direction-7-integration.md        ├── replace-wheel-modern.md
│   (Direction 7 Integration)         │   (1 task under that direction)
└── wiki-documentation.md             └── ingest-product.md
    (Wiki Documentation)                  (1 task under that direction)
```

A direction has many tasks. A task belongs to one direction.

## The Task Schema

```yaml
---
type: task
status: todo | in-progress | blocked | review | done
direction: ""             # which direction this task belongs to
priority: 1-5             # 1 = highest, 5 = lowest
owner: ""                 # which agent/human is working on this
started: ""               # YYYY-MM-DD when status moved to in-progress
due: ""                   # YYYY-MM-DD target completion
depends_on: []            # list of [[Task: name]]s
blocks: []                # list of [[Task: name]]s that this prevents
files: []                 # the file-locks — the conflict-avoidance contract
tags: []
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
- `src/path/to/file.ts` — what changes

## Dependencies
- [[Task: prerequisite-task-name]]

## Blocked By / Blocks
- **Blocked by**: [what's blocking?]
- **Blocks**: [what does this prevent?]

## Status
- `status`: current value
- `owner`: current value
- `started`: current value
- `due`: current value

## Progress Log
- YYYY-MM-DD: [event]
- YYYY-MM-DD: [event]

## Related
- [[Direction: parent-direction]]
- [[Module: relevant-module]]
- [[ADR-XXX: related-decision]]
```

The `files` field is the most important. It's the only thing that prevents file-level conflicts.

## The Direction Schema

```yaml
---
type: direction
status: active | paused | completed | abandoned
owner: ""
start_date: YYYY-MM-DD
target_date: YYYY-MM-DD
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Direction: [Name]

## Summary
[One paragraph. What is this initiative about? Why does it matter?]

## Goal
[What does "done" look like?]

## Status
- `status`: current value
- `owner`: who's leading the direction

## Tasks
- [[Task: name-1]] — todo · unassigned
- [[Task: name-2]] — in-progress · agent-a
- [[Task: name-3]] — done · agent-b

## Files
Files the direction touches (read-only for agents not on the direction):
- `src/path/to/area/`

## Related
- [[ADR-XXX: related-decision]]

## Progress Log
- YYYY-MM-DD: [event]
```

## The Workflow

### Claiming a Task

1. **Check the hot cache** (`hot.md`) for the active task roster. Confirm no one is working on the same files.
2. **Read the task page.** Understand the goal, acceptance criteria, and `files` list.
3. **Verify no conflicts.** Search the wiki for other in-progress tasks that list the same `files`.
4. **Update the task frontmatter**:
   - `status: todo` → `in-progress`
   - `owner: unassigned` → `your-agent-name`
   - `started: YYYY-MM-DD` (today)
5. **Add a Progress Log entry**: "Claimed by [your-agent-name]"
6. **Update the hot cache** to reflect the new in-progress task.
7. **Begin work.** Respect the file-locks.

### Completing a Task

1. **Update the frontmatter**:
   - `status: in-progress` → `done`
2. **Add a Progress Log entry**: "Done — [one-line summary]"
3. **Update the parent direction page** (move the task from "todo" to "done" in its Tasks list).
4. **Update the hot cache** with the new fact.
5. **If the work changed code**, note in the log: "Verified: `yarn lint && yarn build && yarn test:run`"

### Releasing a Task (without completing)

If you claim a task and can't finish it:

1. **Update the frontmatter**:
   - `status: in-progress` → `todo` (or `blocked` if there's a real blocker)
   - `owner: your-agent-name` → `unassigned`
2. **Add a Progress Log entry**: "Released by [your-agent-name] — [reason]"
3. **Update the hot cache** to reflect the release.

Don't abandon tasks silently. Other agents need to know the file-locks are free.

## Conflict Resolution

The `files` field is the source of truth. If you need to edit a file listed in another agent's in-progress task:

1. **Ask in their Progress Log** (e.g. "I'm starting work on X that touches this file — can you release it?")
2. **Wait for an explicit OK** in the log
3. **Or pick a different task** — don't fight for the same file

If two agents need to edit the same file for genuinely independent reasons:

- **Break the file apart**: one agent works on part A, the other on part B
- **Sequence the work**: agent A finishes, then agent B starts
- **Use git branches** to avoid merge conflicts: each agent on their own branch, merge one at a time

## Hot Cache Integration

The `hot.md` page in your wiki should always show:

```markdown
## Currently In-Progress (live)

- [[Task: name-1]] — agent-a · started 2026-06-05
- [[Task: name-2]] — agent-b · started 2026-06-05
- [[Task: name-3]] — blocked (waiting on [[Task: name-1]])
```

This is what every agent reads FIRST when they pick up the project. They see who's doing what, what's blocked, and what they can claim.

## The Hot Cache Update

After every task state change (claim, complete, release, block), update the hot cache:

```markdown
## Recently Completed

- [[Task: name]] — done by [agent] at [time]
```

This is the audit trail. It's how agents understand what happened recently without reading the log.

## When to Create a New Direction

A new direction is needed when:

- The work is long-running (multiple sessions, weeks)
- It has its own owner (one person/agent is responsible)
- It contains multiple tasks (more than 3-5)
- It's coherent (all tasks serve the same goal)

If the work is a one-off (a single session, a single task), skip the direction — just create the task.

## When to Create a New Task

A new task is needed when:

- The work is concrete (acceptance criteria are checkable)
- The files it touches are identifiable
- It fits in a single session
- It has a clear owner (current or future)

If the work is "investigate X" or "research Y", it's not a task — it's a question. File it in `wiki/questions/`.

## Example: The internal-hub Setup

The `internal-hub` project has 2 active directions and 15 tasks:

**Direction 1**: Direction 7 Integration (10 tasks)

- Wheel, winner modal, member management modal, history list, top bar, home page section header, home page empty state, home page keyboard hints, remove room menu, home page composition

**Direction 2**: Wiki Documentation (5 tasks)

- Ingest PRODUCT.md, ingest AGENTS.md, document components, document deps, document flows

All 15 tasks are `todo` / `unassigned`. The first agent to claim one moves the project forward.

## The Self-Test: Is This Coordination Working?

- [ ] Hot cache shows the active roster within 30 seconds of any task state change
- [ ] Every in-progress task has an `owner` (never `unassigned`)
- [ ] Every in-progress task has a `started` date
- [ ] The `files` field is populated for every task (no "TBD" or empty)
- [ ] Two agents don't share a `files` entry
- [ ] Completed tasks have a `done` Progress Log entry
- [ ] Released tasks have a "released by" Progress Log entry
- [ ] The direction pages are kept in sync (tasks moved between sections as they progress)

If all 8 pass, coordination is working.

## Related Skills

- `wiki-scaffold-mode-b` — where to put the task tracker (in a wiki)
- `design-integration-strategy` — a typical direction's phased tasks
- `design-direction-explorer` — the source of the tasks (the chosen direction)
