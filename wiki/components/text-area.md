---
type: component
path: 'src/shared/ui/TextArea'
status: active
purpose: 'Multi-line text input with the same label + error + focus treatment as Input.'
props:
  - name: 'label'
    type: 'string'
    description: 'Visible label.'
  - name: 'rows'
    type: 'number'
    default: '3'
    description: 'Initial visible row count.'
  - name: 'error'
    type: 'string'
    description: 'Error message; switches styling to danger.'
  - name: 'helperText'
    type: 'string'
    description: 'Helper text below the textarea.'
  - name: 'value / onChange'
    type: 'string / (e) => void'
    description: 'Standard controlled-input API.'
used_by:
  - '[[Module: room-management]] (RoomModal description field)'
tags: [component, input, form, a11y]
created: 2026-06-06
updated: 2026-06-06
---

# Component: TextArea

Multi-line text input. Same visual + a11y treatment as [[Component: Input]].

## Location

`src/shared/ui/TextArea/`

## Notes

- Auto-grows to fit content; respects `rows` as a minimum.
- Resize handle is the OS default; consider disabling for Direction 7 forms if vertical-only.
