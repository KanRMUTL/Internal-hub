---
type: concept
status: mature
tags: [concept, architecture, fsd]
created: 2026-06-06
updated: 2026-06-06
---

# Concept: Feature-Sliced Design (FSD)

The project follows [Feature-Sliced Design](https://feature-sliced.design/) — strict unidirectional layers in `src/`. Lower layers must never import from upper layers.

## The Layers

```
src/
├── app/         # Providers, global routing (App.tsx, AppRouter.tsx, main.tsx)
├── pages/       # Route components (Home, Room)
├── widgets/     # Composite UI blocks (Layout)
├── features/    # Business features (fortune, member-management, room-management, toggle-theme)
├── entities/    # Business entities (room)
├── shared/      # UI kit, hooks, config (firebase), styles, assets
```

## Import Rules

- `app/` → can import from any layer
- `pages/` → can import from `widgets/`, `features/`, `entities/`, `shared/`
- `widgets/` → can import from `features/`, `entities/`, `shared/`
- `features/` → can import from `entities/`, `shared/`
- `entities/` → can import from `shared/`
- `shared/` → no internal imports

**The rule is unidirectional.** A `shared/` component must NEVER import from `features/`. If you need a feature-specific piece in a shared component, the layering is wrong.

## Per-slice Structure

Every `feature/` or `entity/` typically has:

- `ui/` — React components
- `hooks/` — data hooks
- `services/` — Firebase / API calls
- `model/` (or `models/`) — types and business logic
- `config/` — constants
- `index.ts` — public barrel (only export through this)

Don't import internals across slices — always go through the barrel.

## Path Aliases

`tsconfig.json` and `vite.config.ts` both define:

- `src`, `app`, `widgets`, `pages`, `features`, `entities`, `shared`

Use these, not relative paths.

## Related

- [[ADR-002: FSD Architecture]]
- `.kiro/steering/structure.md` — original steering doc
