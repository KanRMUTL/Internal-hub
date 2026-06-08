---
name: preview-route-builder
description: 'When experimenting with a new design, component, or page, build it as a preview route at /preview/[name] with a nested ThemeProvider and mock data. Do NOT refactor production code to experiment. The preview is screenshot-able, isolated, and can be removed cleanly when the design is approved.'
---

# Preview Route Builder

When you need to show the user a new design, component, or page before integrating it into production — build a preview route. Don't refactor production code. Don't write a Figma. Build a real, screenshot-able, interactive page in the running app.

## Why This Works

- **Real code, not a Figma.** The user can interact with it, click buttons, trigger animations, see real state.
- **Isolated from production.** Production routes are untouched. If the user hates the design, delete the preview folder and nothing is lost.
- **Side-by-side comparison.** The preview can mirror production's data shape exactly, so the user can compare them in the same browser.
- **Removable in one folder delete.** When the design is approved and integrated, delete `src/pages/Preview/` and the routes. No cleanup of scattered experimental code.

## When to Use

- You need to show the user a new design before integrating it
- The user wants to see a component in isolation (without the rest of the app)
- You want to experiment with new design tokens without breaking the production theme
- You need to A/B two design approaches against each other
- The user asks "what would this look like?" for a redesign

## When NOT to Use

- The change is a small visual tweak (just edit production directly)
- The user has already approved the design and just wants you to ship it
- The change is data/behavior, not visual (use Storybook or a unit test instead)

## The Procedure

### 1. Pick a route name

`<feature>-preview` or `<direction>-preview`. Examples:

- `/preview/home` — preview of the new Home page design
- `/preview/room` — preview of the new Room page
- `/preview/wheel` — preview of a new wheel component
- `/preview/member-management` — preview of a new member list

### 2. Create the folder structure

```
src/pages/Preview/
├── ui/
│   ├── ModernHomePreview.tsx
│   ├── ModernHomePreview.styled.ts       (or inline)
│   └── index.ts
├── index.ts                              (barrel: exports the components)
└── components/                           (if a single preview needs many subcomponents)
    ├── ModernRoomCard.tsx
    ├── ModernAddCard.tsx
    └── ...
```

Keep the preview self-contained. It should not import from production components unless it's intentionally mirroring them.

### 3. Build a nested ThemeProvider

This is the key pattern. The preview gets a **fresh theme** that doesn't touch the production app's theme. Use a separate theme object:

```tsx
// src/pages/Preview/ui/components/ModernThemeProvider.tsx
import { ThemeProvider } from 'styled-components'
import { modernLightTheme, modernDarkTheme } from 'shared/styles/config/modern'

const ModernThemeProvider = ({ children, mode = 'light' }) => (
  <ThemeProvider theme={mode === 'dark' ? modernDarkTheme : modernLightTheme}>{children}</ThemeProvider>
)
```

Why a separate theme: the preview's OKLCH palette, type scale, and motion tokens can evolve freely without polluting the production theme until you're ready to ship.

### 4. Wire the route

In `src/app/routes/AppRouter.tsx`:

```tsx
<Route path="/preview/home" element={<ModernHomePreview />} />
<Route path="/preview/room" element={<RoomPageModern />} />
```

**Outside** the production Layout (don't wrap the preview in the production chrome — you want to evaluate the design alone).

### 5. Use mock data

The preview is for visual evaluation. Don't pull from Firestore. Use literal data:

```tsx
const MOCK_ROOMS: Member[] = [
  { id: 'm1', name: 'Ada', hue: 178, active: true },
  { id: 'm2', name: 'Grace', hue: 200, active: true },
  // ...
]
```

Make the mock data **realistic** — enough variety to test the design (3-8 items, mix of active/inactive, one long title to test overflow).

### 6. Include a theme toggle

A light/dark toggle in the preview's top bar. Use the same OKLCH palette for both. Toggle the local `mode` state — the preview has its own theme, no need to touch the production `useTheme` hook.

### 7. Screenshot in both modes

Use a browser tool (Playwright, Chrome DevTools MCP) to:

- Open the preview in light mode, full-page screenshot
- Toggle to dark mode, full-page screenshot
- Test responsive (420px, 1280px)
- Test interactive states (hover, focus, error)

### 8. Document what changed

For each preview, write a one-paragraph note in the `wiki/concepts/` or `wiki/decisions/` explaining:

- What the design direction is
- What it replaces
- Trade-offs / what was given up
- What's left to integrate

### 9. Integrate or delete

After the user approves:

- **Path A: Integrate the design.** Follow `design-integration-strategy` (separate skill). Move the preview components to production. Replace the route in AppRouter.
- **Path B: Reject the design.** Delete `src/pages/Preview/`. Remove the routes. Nothing is lost.

Don't leave previews in the codebase forever — they become dead code.

## Common Pitfalls

- **Don't reuse production hooks.** A preview that calls `useActiveRooms()` will fail without Firebase config or with empty data. Mock everything.
- **Don't reuse production layouts.** The preview's header, sidebar, footer should be its own — you want to evaluate the design in isolation.
- **Don't over-engineer the mock state.** You don't need a full state machine. A `useState` for "spinning" and "lastWinner" is enough.
- **Don't commit preview data to the project.** When the design is approved, the preview is deleted. Don't try to migrate the mock data to real data — that's a separate concern.

## Example: The internal-hub Previews

This conversation produced two preview routes that followed this exact pattern:

- `src/pages/Preview/ui/ModernHomePreview.tsx` — preview of the modern Home page (heading, section header with sort pill, room grid, empty state, keyboard hints). 6 mock rooms. Nested `ModernThemeProvider` with its own OKLCH palette.
- `src/pages/Preview/ui/room/RoomPageModern.tsx` — preview of the modern Room page (wheel hero card, member chips, history list, winner modal, member management modal). 6 mock members. Same nested `ModernThemeProvider`.

Both were integrated into production, then the preview folder was deleted.

## File Locations (FSD-compliant)

The preview folder breaks FSD layering (it's a route component, so it should be in `pages/`, but it imports from feature-shaped components). This is acceptable for a temporary preview. Mark it with a `// PREVIEW — DELETE BEFORE SHIPPING` comment at the top of the file so it doesn't accidentally become production.

Or, more cleanly, put previews in their own top-level folder:

```
src/_preview/
└── home/
    ├── index.tsx
    ├── styled.ts
    └── components/
```

The `_` prefix signals "not part of FSD, internal use only".

## Related Skills

- `design-direction-explorer` — the upstream skill that picks the direction
- `design-integration-strategy` — the downstream skill that ships the design
- `oklch-design-tokens` — what to put in the new theme object
