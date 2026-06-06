---
type: module
path: ''
status: active
language: typescript
purpose: ''
maintainer: ''
last_updated: YYYY-MM-DD
linked_issues: []
depends_on: []
used_by: []
tags: [module]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Module: [Name]

## Purpose

[One sentence. What does this module do and why does it exist?]

## Location

`src/features/[name]/`

## Structure

```
src/features/[name]/
├── ui/           # React components
├── hooks/        # data hooks
├── services/     # Firebase / API calls
├── model/        # types and business logic
├── config/       # constants
└── index.ts      # public barrel
```

## Public API

[What does the module export via its barrel?]

## Dependencies

- [What does it import?]
- [[Dependency: firebase]]
- [[Module: X]]

## Used By

- [[Module: Y]]
- [[Page: Z]]

## State / Data Flow

[Hooks, services, how data moves]

## Key Files

- `path/to/file.ts` — [what it does]
