---
type: meta
title: 'Overview'
updated: 2026-06-06T02:15:00
---

# Project Overview

`internal-hub` is a lightweight, internal-only web app for teams that gives every meeting a shared "fortune wheel" for picking members at random. Each room has its own wheel drawing from a member list; the active room is highlighted; every spin is preserved in history.

## Tech Stack

- **Frontend**: React 19, TypeScript 5.7 (strict), Vite 6
- **Styling**: styled-components 6, Motion 12, lucide-react
- **Routing**: React Router DOM 6.30 (pinned)
- **State**: React Hook Form, dayjs, lodash, react-use
- **Backend**: Firebase 11 (Firestore only — no Auth, no Storage wiring in app code)
- **Testing**: Vitest 3 + jsdom + @testing-library/react
- **Deploy**: Firebase Hosting (`internal-hub-1b94e`)

## Architecture

Strict unidirectional layers in `src/`:

- `app/` — providers, routing
- `pages/` — route components (Home, Room, formerly Quiz/Lobby/HostScreen)
- `widgets/` — composite UI blocks (Layout)
- `features/` — business features (fortune, member-management, room-management, toggle-theme)
- `entities/` — business entities (room)
- `shared/` — UI kit, hooks, config (firebase), styles, assets

Lower layers must never import from upper layers.

## Current Focus

**Direction 7 integration** — the modern × minimal × playful design system is the chosen language. ~35% shipped to production (theme, Home cards, wheel colors). Next: Room page composition, modals, top bar.

See [[Hot Cache]] for the live state.

## Conventions

- Default branch: `master` (not `main`)
- YARN only (not npm) — `package-lock.json` exists but is not the source of truth
- Lint-staged husky pre-commit is partially broken (TSLint is deprecated); rely on `yarn lint` + `yarn build` + `yarn test:run`
- See `AGENTS.md` for full agent rules

## Reference Docs

- `PRODUCT.md` — strategic product context
- `AGENTS.md` — agent rules and commands
- `.doc/project_documentation.md` — older full architecture doc
- `.kiro/steering/{product,structure,tech}.md` — steering docs
