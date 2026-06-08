---
type: flow
name: 'Theme Toggle'
trigger: 'User clicks the moon/sun icon in the top bar'
outcome: 'Theme switches between LIGHT and DARK, persists to localStorage'
tags: [flow]
created: 2026-06-06
updated: 2026-06-06
---

# Flow: Theme Toggle

## Trigger

User clicks the **theme toggle** button in the top bar (icon switches between moon and sun).

## Mechanism

`src/features/toggle-theme/providers/ThemeContext.tsx`:

1. `useLocalStorage<THEME_MODE_KEYS>('theme', 'LIGHT')` reads/writes localStorage
2. `toggleTheme` calls `switchMode(currentMode)` and `setModeStorage(nextMode)`
3. `ThemeContext.Provider` exposes `mode` and `toggleTheme`
4. `StyledProvider theme={theme}` from styled-components receives the matching `lightTheme` or `darkTheme` object
5. Every styled component re-renders with the new theme tokens

## Outcome

The entire app re-themes in <300ms (the `background-color` transition is 300ms via `globalStyle.ts`).

## Persistence

- `localStorage['theme']` = `'LIGHT'` or `'DARK'`
- Default is `'LIGHT'`
- Survives page reloads, but NOT cross-device sync (no Firestore, no Auth)

## Related

- [[Module: toggle-theme]]
- [[Concept: Design System]] — token swap
