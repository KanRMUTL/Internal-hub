---
type: meta
title: 'Tech Stack'
updated: 2026-06-06T02:15:00
---

# Tech Stack

The complete tech stack for `internal-hub`. Versions are current as of 2026-06-06.

## Core

| Package          | Version         | Role                    |
| ---------------- | --------------- | ----------------------- |
| React            | ^19.0.0         | UI framework            |
| TypeScript       | ~5.7.2          | Type system             |
| Vite             | ^6.3.1          | Build tool / dev server |
| React Router DOM | 6.30.0 (pinned) | Routing                 |

## Styling

| Package           | Version  | Role                                 |
| ----------------- | -------- | ------------------------------------ |
| styled-components | ^6.1.17  | CSS-in-JS, theming                   |
| motion            | ^12.9.2  | Animations (Framer Motion successor) |
| lucide-react      | ^0.507.0 | Icon set                             |

## State + Utilities

| Package         | Version  | Role              |
| --------------- | -------- | ----------------- |
| React Hook Form | ^7.56.1  | Form state        |
| dayjs           | ^1.11.13 | Date formatting   |
| lodash          | ^4.17.21 | General utilities |
| react-use       | ^17.6.0  | Hook collection   |

## Backend

| Package  | Version | Role                                                |
| -------- | ------- | --------------------------------------------------- |
| firebase | ^11.6.1 | Firestore only (no Auth/Storage wiring in app code) |

## Testing

| Package                   | Version | Role              |
| ------------------------- | ------- | ----------------- |
| Vitest                    | ^3.2.4  | Test runner       |
| jsdom                     | ^27.0.0 | Browser env       |
| @testing-library/react    | ^16.3.0 | Component testing |
| @testing-library/jest-dom | ^6.9.1  | Matchers          |

## Lint + Format

| Package           | Version | Role                                               |
| ----------------- | ------- | -------------------------------------------------- |
| ESLint            | ^9.22.0 | Linter                                             |
| typescript-eslint | ^8.26.1 | TS rules                                           |
| Prettier          | 3.5.3   | Formatter                                          |
| Husky             | ^9.1.7  | Git hooks (partially broken)                       |
| lint-staged       | 13      | Pre-commit (TSLint rule is broken; Prettier works) |

## Lockfile

**Yarn** is the source of truth. `yarn.lock` is committed. `package-lock.json` is also committed but is not the source of truth — do NOT run `npm install`.

## Related

- [[Overview]] — full project summary
- [[Concept: Design System]] — token structure
- [[Dependencies Index]] — focused writeups
