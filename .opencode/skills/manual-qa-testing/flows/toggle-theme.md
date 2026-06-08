# toggle-theme QA protocol

**Source spec:** `wiki/modules/toggle-theme.md`

## Prereqs

- Dev server up

## Flows

### 1. Toggle from light to dark

- [ ] Click the theme toggle in the top bar
- [ ] Verify: `<html data-theme="dark">` (or equivalent) is set, colors flip, no flash

### 2. Persist across reload

- [ ] Hard-reload
- [ ] Verify: theme stays dark, no flash of light theme

### 3. Persist across navigation

- [ ] Navigate from Home to a room, then back
- [ ] Verify: theme stays dark

### 4. localStorage check

- [ ] Run `localStorage.getItem('theme')` via `evaluate_script`
- [ ] Verify: the value matches the current theme

### 5. Toggle back

- [ ] Click again
- [ ] Verify: switches to light, persists, no flash

### 6. First-visit default

- [ ] Open a fresh browser context (clear localStorage)
- [ ] Verify: defaults to the project's documented default (light? system? — check `wiki/modules/toggle-theme.md`)

## Common regressions to look for

- Theme flashes on reload (FOUC)
- `prefers-color-scheme: dark` system setting ignored
- localStorage key changed but `useTheme` hook not updated
- Dark-mode contrast failures on Direction 7 surfaces
