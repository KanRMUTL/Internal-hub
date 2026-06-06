---
type: dependency
name: 'React Router DOM'
version: '6.30.0'
status: active
risk: medium
alternatives: ['TanStack Router', 'Wouter', 'Next.js App Router']
tags: [dependency, routing, react]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: React Router DOM

## What It Is

Client-side routing for React. Declarative route components, nested layouts, URL params, navigation hooks. 6.30 is the last 6.x release; 7.x is in development.

## Why We Use It

- Standard React router.
- Hooks API (`useNavigate`, `useParams`, `useLocation`) is well-known.
- Nested routes + `<Outlet />` power our `Layout` widget.

## Version

`6.30.0` (**pinned, no caret**). This is a deliberate choice — see Risk.

## Risk

**Medium** — React 19 + React Router 7 compatibility is still being verified. The pin to 6.30 is the safe path: confirmed working with React 19. Do not upgrade to 7.x without testing.

## Configuration

- Routes are declared in `src/app/routes/AppRouter.tsx` (the only router file).
- The Layout widget uses `<Outlet />` for nested routes.
- `BrowserRouter` is the top-level wrapper (no SSR).

## Alternatives Considered

- **TanStack Router** — type-safe routing, more modern. Would require migration of the AppRouter file and hooks usage.
- **Wouter** — minimal, 1kb. Rejected for ecosystem familiarity.
- **Next.js App Router** — full framework, not a library. Wrong fit for a Vite SPA.

## Upgrades

- [ ] Watch React Router 7.x for React 19 stable support
- [ ] Plan migration to 7.x in a separate branch; do not combine with other refactors

## Related

- [[Source: AGENTS.md]] — pinned, do not upgrade without checking React 19 compat
- [[App: AppRouter]] — only file that uses this
- [[Tech Stack]]
