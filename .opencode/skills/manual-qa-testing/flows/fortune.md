# fortune QA protocol

**Source spec:** `wiki/modules/fortune.md`

## Prereqs

- Dev server on `http://localhost:5173/`
- A `qa-2026-06-07-XXXX-1` room with 3 members (one inactive) is pre-created and you are on its `/room/<id>` page

## Flows

### 1. Open the room

- [ ] Click into the room from Home
- [ ] Verify: URL is `/room/<id>`, members render as chips, wheel renders, history is visible (or empty state)

### 2. Spin the wheel via button

- [ ] Click the spin button
- [ ] Verify: wheel rotates, lands on a member, winner modal opens, `aria-live` announces the winner

### 3. Spin the wheel via keyboard

- [ ] Press `S` (with focus outside any input/textarea)
- [ ] Verify: same as flow 2

### 4. Save the result

- [ ] Click "Save" in the winner modal
- [ ] Verify: modal closes, history list shows the new entry at the top, `aria-live` announces

### 5. Spin again from the modal

- [ ] Open a new spin, click the icon button "Spin again" in the modal
- [ ] Verify: modal closes, wheel re-spins

### 6. Toggle member mid-spin

- [ ] Open the member chip menu, toggle a member inactive
- [ ] Verify: chip is visually struck through, wheel slices update, list updates

### 7. Empty state

- [ ] In a fresh `qa-...-2` room, verify the empty state copy is "Spin the wheel to record your first result" and the action button is visible

### 8. History persistence

- [ ] Hard-reload the page
- [ ] Verify: history list is identical to before reload, no flash of empty state

## Common regressions to look for

- Wheel SVG render glitches at 1440×900 and 375×812
- Animation stutter on slow CPU (use `emulate` with `cpuThrottlingRate: 4`)
- Focus not returning to the spin button when the winner modal closes
- History row missing the `aria-live` announcement
- `prefers-reduced-motion` — cannot toggle via MCP; observe animation timing only
