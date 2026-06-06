---
type: module
path: 'src/features/toggle-theme/'
status: active
language: typescript
purpose: "Light/dark mode toggle. Persisted in localStorage as 'theme'."
maintainer: ''
last_updated: 2026-06-06
linked_issues: []
depends_on: []
used_by:
  - '[[Widget: Layout]]'
  - '[[Module: toggle-theme]]'
tags: [module]
created: 2026-06-06
updated: 2026-06-06
---

# Module: toggle-theme

Light/dark mode toggle. The theme choice is persisted in `localStorage` under the key `theme`.

## Location

`src/features/toggle-theme/`

## Structure

```
src/features/toggle-theme/
├── config/                      # DEFAULT_MODE
├── lib/                         # switchMode utility
├── providers/
│   ├── ThemeContext.tsx         # React Context + StyledProvider
│   ├── context.ts
│   └── useTheme.ts
├── ui/                          # ToggleThemeButton
└── index.ts
```

## Public API

`ThemeProvider`, `ToggleThemeButton`, `useTheme`

## Mechanism

1. `ThemeProvider` reads `localStorage.getItem('theme')` on mount (via `useLocalStorage` from `react-use`)
2. `'LIGHT' | 'DARK'` → selects `lightTheme` or `darkTheme` from `src/shared/styles/config/`
3. `ThemeContext` exposes `toggleTheme` and `mode`
4. `ToggleThemeButton` reads `useTheme()` and toggles

## Modern Tokens (current)

`src/shared/styles/config/light.ts` and `dark.ts` use OKLCH for all colors, backgrounds, and shadows. See [[Concept: Design System]].

## Related

- [[Concept: Design System]]
- [[Flow: Theme Toggle]]
- [[Concept: OKLCH Color Space]]
