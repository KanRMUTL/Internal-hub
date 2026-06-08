---
type: component
path: 'src/shared/ui/Modal'
status: active
purpose: 'Overlay + dialog + backdrop with focus trap and Esc-to-close. Used by every modal in the app.'
props:
  - name: 'isOpen'
    type: 'boolean'
    required: true
    description: 'Whether the modal is visible.'
  - name: 'onClose'
    type: '() => void'
    required: true
    description: 'Called on Esc, backdrop click, or close button.'
  - name: 'title'
    type: 'string'
    default: "''"
    description: 'Optional header title.'
  - name: 'size'
    type: "'sm' | 'md' | 'lg' | 'xl'"
    default: 'md'
    description: 'Max-width token.'
  - name: 'closeOnBackdrop'
    type: 'boolean'
    default: 'true'
    description: 'If false, backdrop click does not close.'
  - name: 'children'
    type: 'ReactNode'
    description: 'Modal body content.'
  - name: 'footer'
    type: 'ReactNode'
    description: 'Optional footer slot (usually action buttons).'
used_by:
  - '[[Module: room-management]] (RoomModal, ModalConfirmRemoveRoom)'
  - '[[Module: member-management]] (legacy MembersModal — replaced by inline modern modal)'
  - '[[Module: fortune]] (legacy LuckyModal — replaced by WinnerModalModern inline)'
tags: [component, modal, dialog, a11y]
created: 2026-06-06
updated: 2026-06-06
---

# Component: Modal

Generic overlay + dialog + backdrop primitive. Wraps content in a backdrop with blur, traps focus while open, and dismisses on Escape (and on backdrop click by default).

## Location

`src/shared/ui/Modal/`

## Accessibility

- `role="dialog"` + `aria-modal="true"` on the dialog.
- `aria-labelledby` is wired to the title when present.
- Focus is trapped inside the dialog while open (uses `FocusTrap` from shared/ui).
- Tab cycles within; Shift+Tab cycles back to the last focusable.
- Escape closes (unless `closeOnBackdrop` is false and a custom handler is provided).

## Notes

- The modern Direction 7 modals (`WinnerModalModern`, `MemberManagementModalModern`) are **not** built on top of this `Modal` — they're inline in the page with their own backdrop blur and focus trap. This is a deliberate choice to control the entire visual treatment.
- For new modals, **prefer** the inline pattern unless you need a generic, reusable shell.
