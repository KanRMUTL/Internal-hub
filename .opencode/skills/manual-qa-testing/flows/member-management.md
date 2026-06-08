# member-management QA protocol

**Source spec:** `wiki/modules/member-management.md`

## Prereqs

- Dev server up
- On a room page with ≥ 1 member

## Flows

### 1. Open the member modal

- [ ] Click the "Manage members" button
- [ ] Verify: modal opens, focus moves to the first input, `aria-modal="true"`, FocusTrap active

### 2. Add a member

- [ ] Type a name, click "Add"
- [ ] Verify: chip appears in the room page, input clears, focus stays in the modal

### 3. Add a duplicate name

- [ ] Type a name that already exists, click "Add"
- [ ] Verify: form rejects (toast or inline error), no duplicate chip is created

### 4. Edit a member

- [ ] Click the edit affordance on a chip, change the name, save
- [ ] Verify: chip updates across the room page and history rows

### 5. Remove a member

- [ ] Click the remove affordance, confirm the dialog
- [ ] Verify: chip disappears, history rows that referenced the member show the deleted name (or the configured fallback)

### 6. Cancel mid-add

- [ ] Open modal, type a name, click "Cancel"
- [ ] Verify: modal closes, the typed name is NOT added

### 7. Empty member list

- [ ] In a fresh room, open the member modal
- [ ] Verify: empty state copy and primary "Add member" CTA are visible

## Common regressions to look for

- Focus not returning to the trigger button on close
- `aria-modal` missing
- `Escape` doesn't close the modal
- Duplicate-name check missing (silent accept)
