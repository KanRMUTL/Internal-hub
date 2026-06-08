---
type: dependency
name: 'styled-components'
version: '^6.1.17'
status: active
risk: low
alternatives: ['vanilla-extract', 'Emotion', 'Tailwind', 'CSS Modules']
tags: [dependency, styling]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: styled-components

## What It Is

CSS-in-JS. The project uses `styled` + `css` helper + the `ThemeProvider` to inject design tokens into every styled component.

## Why We Use It

- Theme tokens flow through `props.theme` automatically — no prop drilling
- The `css` helper is the cleanest way to handle conditional styling
- `$`-prefixed transient props don't leak to the DOM
- Co-locates styles with components (no separate `.css` files to maintain)

## Why Not Tailwind

The product is a small SPA, not a marketing site. Design tokens are global (one theme, light/dark), not per-component. Tailwind's utility-class approach would create more indirection than it saves.

## Risk

**Low**. The runtime cost is acceptable for our component count. SSR isn't a concern (this is a pure SPA).

## Convention

- All styled components use `$`-prefixed transient props (e.g. `$variant`, `$featured`, `$inactive`)
- These do NOT pass through to the underlying DOM element
- Standard styled props (`color`, `size`, etc.) ARE passed through (we override with `forwardedAs` if needed)

## `DefaultTheme` Augmentation

`src/shared/styles/styled.d.ts`:

```ts
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

This gives every styled component typed access to `theme.colors.primary`, etc.

## Related

- [[Concept: Design System]] — the token system
- [[Module: toggle-theme]] — uses `ThemeProvider` from styled-components
