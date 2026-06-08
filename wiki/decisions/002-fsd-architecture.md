---
type: decision
status: accepted
priority: 2
date: 2026-06-06
owner: ''
context: 'Code organization convention for the React SPA.'
tags: [decision, architecture, adr]
created: 2026-06-06
updated: 2026-06-06
---

# ADR-002: FSD Architecture

## Status

Accepted. Project structure follows [Feature-Sliced Design](https://feature-sliced.design/).

## Context

The codebase is a React 19 + TypeScript SPA with multiple business features (fortune wheel, member management, room management) and shared UI primitives. The team needed:

- A clear convention for where to put new code
- Strong guardrails against cross-layer coupling
- Easy navigation (predictable folder shape per feature)

## Decision

Adopt Feature-Sliced Design. Six layers, unidirectional imports:

```
src/
├── app/         # Providers, global routing
├── pages/       # Route components
├── widgets/     # Composite UI blocks
├── features/    # Business features
├── entities/    # Business entities
└── shared/      # UI kit, hooks, config
```

Lower layers must never import from upper layers. Per-slice structure: `ui/`, `hooks/`, `services/`, `model/`, `config/`, `index.ts` (barrel).

## Consequences

### Positive

- New features have a clear "where to put things" answer
- The barrel pattern prevents accidental cross-slice internal imports
- Path aliases (`features/fortune`, `entities/room`) make imports readable
- Easy to extract a feature into its own package later

### Negative

- Some features span 3+ slices (fortune has ui/hooks/services/model/config); not all projects need this much ceremony
- The "widgets" layer is currently thin (just Layout); the boundary between "widget" and "feature" is fuzzy

### Neutral

- Tests live alongside the code they test (FSD convention)
- A `test/` folder at the root holds visual regression / cross-browser / accessibility suites — outside the FSD slice convention

## Alternatives Considered

### Flat structure (controllers/components/hooks/utils)

- Pro: familiar, simple
- Con: no enforcement against cross-feature coupling, hard to scale beyond ~20 components

### Atomic design (atoms/molecules/organisms)

- Pro: clear hierarchy by size
- Con: doesn't map to business features; a "fortune wheel" is hard to file as an organism when it has its own hooks and services

### Domain-driven folders (auth/, billing/, etc.)

- Pro: aligns with the team
- Con: but the team is small and the project has a single domain (internal-hub); no real benefit

## Related

- [[Concept: Feature-Sliced Design]]
- `.kiro/steering/structure.md` — original steering doc
