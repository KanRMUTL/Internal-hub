# room-management QA protocol

**Source spec:** `wiki/modules/room-management.md`

## Prereqs

- Dev server up
- On `http://localhost:5173/`

## Flows

### 1. Create a room

- [ ] Click "New room", type a name (≤ 20 chars), click "Create"
- [ ] Verify: modal closes, new card appears in the Home grid

### 2. Empty name

- [ ] Open the modal, leave name blank
- [ ] Verify: submit stays enabled per spec (scripted test) but form does not submit on click

### 3. 60+ char name

- [ ] Type > 20 chars
- [ ] Verify: input caps at 20 (or submit stays disabled per the existing E2E test)

### 4. Edit a room

- [ ] Click into a room, use the header "..." menu (if present) or the room settings affordance, rename
- [ ] Verify: new name persists in the card on Home and in the room header

### 5. Remove a room (accept confirm)

- [ ] From Home, click the remove affordance on a `qa-...` room, accept the `confirm` dialog
- [ ] Verify: card disappears, no console errors, network request succeeds

### 6. Remove a room (dismiss confirm)

- [ ] Click remove, dismiss the dialog
- [ ] Verify: card remains

### 7. Empty Home state

- [ ] In a fresh browser profile (or after deleting all `qa-` rooms), verify the empty state copy and CTA

## Common regressions to look for

- Remove room not actually deleting from Firestore (network request fails silently)
- "..." menu missing (tracked by [[Task: Add "..." menu for remove room]])
- Empty state copy regresses
