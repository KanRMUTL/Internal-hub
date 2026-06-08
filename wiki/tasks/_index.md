---
type: meta
title: 'Tasks Index'
updated: 2026-06-06T02:15:00
---

# Tasks Index

Concrete units of work. Multiple agents can collaborate by claiming tasks in different files. See [[Hot Cache]] for the live active roster.

## Active Tasks (by direction)

### [[Direction: Direction 7 Integration]]

- [[Task: Replace production WheelOfFortune with WheelOfFortuneModern]] — todo · unassigned
- [[Task: Replace FortuneHistoryTable with HistoryListModern]] — todo · unassigned
- [[Task: Wire WinnerModalModern over LuckyModal]] — todo · unassigned
- [[Task: Wire MemberManagementModalModern over MembersModal]] — todo · unassigned
- [[Task: Replace production Layout widget (top bar)]] — todo · unassigned
- [[Task: Add Home page section header]] — todo · unassigned
- [[Task: Add Home page empty state with wheel illustration]] — todo · unassigned
- [[Task: Add Home page keyboard hints]] — todo · unassigned
- [[Task: Add "..." menu for remove room]] — todo · unassigned
- [[Task: Update Home page composition to ModernHomePreview]] — todo · unassigned

### [[Direction: Wiki Documentation]]

- [[Task: Ingest PRODUCT.md as a wiki source]] — todo · unassigned
- [[Task: Ingest AGENTS.md as a wiki source]] — todo · unassigned
- [[Task: Document shared/ui components (Card, Button, Modal, etc.)]] — todo · unassigned
- [[Task: Document remaining dependencies (React, Vite, etc.)]] — todo · unassigned
- [[Task: Document remaining flows (member CRUD, room CRUD)]] — todo · unassigned

## How to Claim a Task

1. Read the task page. Confirm you understand the acceptance criteria and the files it touches.
2. Check [[Hot Cache]] and the task's `status` — make sure no other agent is currently working on it.
3. Update the task frontmatter:
   - `status: todo` → `status: in-progress`
   - `owner: unassigned` → `owner: your-agent-name`
   - `started: YYYY-MM-DD` (today)
4. Add a Progress Log entry: "Claimed by [your-agent-name]"
5. Begin work. The task's `files` field tells other agents which files to avoid.

## How to Complete a Task

1. Update the task frontmatter:
   - `status: in-progress` → `status: done`
   - Add a Progress Log entry: "Done — [one-line summary]"
2. Update the parent [[Directions Index]] (or the direction's own page) to mark the task done
3. Update [[Hot Cache]] with the new fact
4. If you changed code, run `yarn lint && yarn build && yarn test:run` and note the result in the log

## Conflict Avoidance

The task's `files` field is the source of truth. If you need to edit a file that's listed in another agent's in-progress task, ask first (in the other task's Progress Log) or pick a different task.
