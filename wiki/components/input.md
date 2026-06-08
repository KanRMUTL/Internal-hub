---
type: component
path: 'src/shared/ui/Input'
status: active
purpose: 'Text input with label, helper text, error state, and focus ring.'
props:
  - name: 'label'
    type: 'string'
    description: 'Visible label; also becomes the aria-label if no `id` is set.'
  - name: 'id'
    type: 'string'
    description: 'Used to link label + input for a11y.'
  - name: 'error'
    type: 'string'
    description: 'If set, switches to danger styling and renders a helper message.'
  - name: 'helperText'
    type: 'string'
    description: 'Helper text shown below the input.'
  - name: '$size'
    type: "'sm' | 'md' | 'lg'"
    default: 'md'
    description: 'Height + font size.'
  - name: 'value / onChange'
    type: 'string / (e) => void'
    description: 'Standard controlled-input API. Wraps native input.'
used_by:
  - '[[Module: room-management]] (RoomModal name field)'
  - '[[Module: member-management]] (MemberManagementModalModern add form)'
tags: [component, input, form, a11y]
created: 2026-06-06
updated: 2026-06-06
---

# Component: Input

Text input primitive. Wraps the native `<input>` with a label, helper text, error state, and brand-color focus ring.

## Location

`src/shared/ui/Input/`

## Visual States

- **Default** — surface background, grey border, grey label.
- **Hover** — border darkens one step.
- **Focus** — border + focus ring in primary color.
- **Error** — border + focus ring in danger color; helper text switches to danger.
- **Disabled** — grey background, no cursor.

## Notes

- For modern Direction 7 forms, the `MemberManagementModalModern` inlines its own input rather than using this component, to get the "submit-on-Enter" UX with the right visual.
