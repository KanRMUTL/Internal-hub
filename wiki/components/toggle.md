---
type: component
path: 'src/shared/ui/Toggle'
status: active
purpose: 'Switch / on-off toggle. Used by the legacy theme toggle and anywhere a boolean state is exposed to the user.'
props:
  - name: 'isOn'
    type: 'boolean'
    required: true
    description: 'Current state.'
  - name: 'onToggleSwitch'
    type: '(next: boolean) => void'
    required: true
    description: 'Called when the user toggles.'
  - name: 'label'
    type: 'string'
    description: 'Optional visible label.'
  - name: 'size'
    type: "'sm' | 'md' | 'lg'"
    default: 'md'
    description: 'Track + handle dimensions.'
  - name: 'disabled'
    type: 'boolean'
    default: 'false'
    description: 'If true, toggle is non-interactive.'
used_by:
  - '[[Module: toggle-theme]] (ToggleThemeButton wraps Toggle)'
  - '[[Module: room-management]] (active/inactive flags — modern UI uses Eye/EyeOff icons instead)'
tags: [component, toggle, form, a11y]
created: 2026-06-06
updated: 2026-06-06
---

# Component: Toggle

Switch primitive. Animated on/off track with a sliding handle. The track is a brand-color when on, grey when off.

## Location

`src/shared/ui/Toggle/`

## Accessibility

- `role="switch"` + `aria-checked` are wired to `isOn`.
- Keyboard: `Space` toggles, `Enter` toggles, `Tab` moves focus.
- Visible focus ring on `:focus-visible`.

## Notes

- The Direction 7 [[Page: Home]] now uses icon-only sun/moon in the top bar instead of a full Toggle. The Toggle is still used by `ToggleThemeButton` for backward compatibility.
- For per-member active/inactive toggles, the modern UI uses `Eye` / `EyeOff` icon buttons in `MemberManagementModalModern` rather than this Toggle.
