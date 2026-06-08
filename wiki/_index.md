---
type: meta
title: 'Wiki Index'
updated: 2026-06-06T03:55:00
---

# Wiki Index

Master catalog for the `internal-hub` project wiki. **Multi-agent context hub** — every agent working on this project starts here.

## Start Here

- [[Overview]] — one-paragraph project summary
- [[Hot Cache]] — ~500-word snapshot of most recent context
- [[Architecture Overview]] — how the codebase is organized
- [[Tech Stack]] — versions, why these choices

## Modules (one page per major feature)

- [[Module: fortune]] — wheel of fortune + history
- [[Module: member-management]] — room members CRUD
- [[Module: room-management]] — room CRUD
- [[Module: toggle-theme]] — light/dark mode

## Components (shared/ui)

- [[Components Index]] — full list of shared UI primitives

## Concepts (design + architecture knowledge)

- [[Concept: Design System]] — colors, type, motion, geometry
- [[Concept: Feature-Sliced Design]] — FSD layer rules
- [[Concept: OKLCH Color Space]] — why we use it
- [[Concept: Inter Font Stack]] — typography choices

## Decisions (Architecture Decision Records)

- [[Decisions Index]]
- [[ADR-001: Direction 7 Design]] — the modern design language
- [[ADR-002: FSD Architecture]] — feature-sliced design adoption
- [[ADR-003: App shell unifies the top bar]] — `widgets/Layout` is the single source of nav/brand/theme
- [[ADR-004: Motion Wrapper Consolidation]] — shared `MotionWrapper` for flourishes; `motion` reserved for primary animation

## Dependencies

- [[Dependencies Index]]
- [[Dependency: Firebase]] — Firestore backend
- [[Dependency: Motion]] — Framer Motion successor
- [[Dependency: styled-components]] — CSS-in-JS

## Flows

- [[Flows Index]]
- [[Flow: Spin the Wheel]] — user action to winner reveal
- [[Flow: Member Toggle Active/Inactive]] — upcoming
- [[Flow: Theme Toggle]] — localStorage persistence

## Sources (ingested)

- [[Sources Index]]
- [[Source: PRODUCT.md]] — register, users, brand personality, anti-references, design principles, accessibility commitments
- [[Source: AGENTS.md]] — stack, commands, FSD rules, traps, testing notes, wiki integration

## Open Questions

- [[Questions Index]]

## Meta (sessions, dashboards, conventions)

- [[Meta Index]]
- [[2026-06-06 — Direction 7 + Wiki Documentation Complete]] — the major session that shipped the redesign
- [[2026-06-07 — Fortune Critique + Polish Pass]] — `/impeccable critique` + 5-issue sweep (1 P0, 3 P1, 1 P2) on the wheel + winner modal + history

## Directions & Tasks (multi-agent coordination)

Long-running initiatives with their own owner; tasks are concrete units of work. Multiple agents collaborate by claiming tasks in different files. See [[Tasks Index]] for the full list.

- [[Directions Index]]
  - [[Direction: Direction 7 Integration]] — DONE (10/10 tasks complete)
  - [[Direction: Wiki Documentation]] — populate the wiki with the project's full knowledge (5 task slots)

## Conventions

- All notes use YAML frontmatter (type, status, created, updated, tags)
- Wikilinks use `[[Note Name]]` format
- New log entries go at the TOP of [[Log]]
- `.raw/` is read-only source storage
- See `../AGENTS.md` for agent routing rules

## How Agents Should Use This Wiki

1. Read [[Hot Cache]] first (~500 tokens)
2. If not enough, read [[Overview]] + this index (~1.5k tokens)
3. Drill into specific module/decision/concept pages (~200-400 each)
4. **Do not crawl the wiki for general coding questions** — only for project-specific context
