---
type: meta
title: 'Components Index'
updated: 2026-06-06T04:05:00
---

# Components Index

Shared UI primitives in `src/shared/ui/`. Each page documents the API, visual states, and where the component is used.

## Primitives

- [[Component: Button]] — primary action trigger with size, variant, loading
- [[Component: Card]] — surface primitive (elevated / outlined / flat)
- [[Component: Modal]] — overlay + dialog + backdrop with focus trap
- [[Component: Input]] — text input with label, helper, error
- [[Component: TextArea]] — multi-line text input
- [[Component: Toggle]] — switch / on-off toggle
- [[Component: Table]] — data table with sticky header + column widths
- [[Component: Skeleton]] — animated loading placeholder

## Layout

- `Box` — polymorphic flex/grid container with theme tokens
- `Container` — `max-width` + `padding` + `centered` shell
- `Section` — vertical rhythm wrapper
- `Grid` / `ResponsiveGrid` — grid layouts
- `ResponsiveSpacing` — vertical rhythm
- `Layout` / `LayoutSection` — page-level layout
- `Typography` — h1–h6 + body + caption

## Feedback

- `Alert` — inline alert banner
- `EmptyState` — empty-list illustration + CTA
- `FlashAlert` / `useFlashAlert` — toast-style flash messages
- `Spinner` — inline loading spinner
- `DataBoundary` — loading + error + skeleton wrapper
- `SuccessFeedback` — success animation

## Motion wrappers

- `MotionWrapper` (exports `MotionDiv`, `MotionButton`, `MotionSpan`) — `motion` components with shared config
- `withMotion` HOC — wraps any component with motion + reduced-motion fallback

## Accessibility primitives

- `LiveRegion` — announces state changes to screen readers
- `ScreenReaderOnly` — visually hidden but accessible text
- `FocusTrap` — traps focus inside a region
- `SkipLinks` — keyboard skip-to-section links

## See Also

- [[Concept: Design System]] — the tokens these components consume
- [[Concept: Feature-Sliced Design]] — where these components live (in `shared/`)
- [[Module: fortune]] / [[Module: member-management]] / [[Module: room-management]] — primary consumers
