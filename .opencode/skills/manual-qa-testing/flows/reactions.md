# reactions QA protocol

**Source spec:** `wiki/modules/reactions.md`

## Prereqs

- Dev server up
- Two Chrome tabs both on the same room page (use `mcp__chrome-devtools__new_page` for the second, `background: true`)

## Flows

### 1. Send a reaction from tab A

- [ ] In tab A, click a reaction button
- [ ] Verify: count increments in tab A immediately

### 2. Reaction propagates to tab B

- [ ] Wait up to 3s
- [ ] Verify: tab B shows the same reaction and count

### 3. Send a different reaction

- [ ] In tab A, click a different reaction button
- [ ] Verify: tab B shows the second reaction within 3s

### 4. Reaction persists across reload

- [ ] In tab A, hard-reload
- [ ] Verify: reaction count survives the reload

## Common regressions to look for

- Real-time listener not attached (tab B never updates)
- Reaction count off-by-one
- Optimistic update reverts unexpectedly
- Network failures silently swallowed
