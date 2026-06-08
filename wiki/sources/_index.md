---
type: meta
title: 'Sources Index'
updated: 2026-06-06T03:55:00
---

# Sources Index

Source documents ingested into the wiki.

- [[Source: PRODUCT.md]] — register, users, brand personality, anti-references, design principles, accessibility commitments
- [[Source: AGENTS.md]] — stack, commands, FSD rules, traps, testing notes, wiki integration

## How to add a new source

1. Drop the original in `wiki/.raw/` (gitignored) or note its path.
2. Create a summary at `wiki/sources/<name>.md` using `_templates/source.md`.
3. Cross-reference it from relevant concept/ADR/module pages.
4. Add the entry to this index.
5. Append a `wiki/log.md` entry.
