---
name: wiki-scaffold-mode-b
description: 'When setting up a wiki for a developer project (a codebase, a repo, a service), use Mode B (GitHub/Repository) — not one of the 6 general modes. Mode B has the right folder structure: modules/ for features, components/ for UI primitives, decisions/ for ADRs, dependencies/ for external libs, flows/ for user journeys, concepts/ for design/architecture knowledge.'
---

# Wiki Scaffold: Mode B (GitHub/Repository)

When you set up a wiki for a developer project — a codebase, a repo, a service — use **Mode B (GitHub/Repository)**. Not Mode A (Website), not Mode C (Business/Project), not Mode D (Personal). Mode B has the right folder structure for code-shaped work.

## Why Mode B

- The other 5 modes are designed for content-shaped work (websites, businesses, books, research). They have folders like `intel/`, `characters/`, `papers/`, `stakeholders/` — none of which fit a codebase.
- A codebase has specific things to document: features (modules), UI components, architectural decisions, external dependencies, data flows, design concepts. Mode B has folders for all of these.
- Mode B is the only mode designed for "map my codebase" and "architecture wiki for my repo".

## When to Use

- Setting up a wiki for any developer project (React app, Node service, Python lib, etc.)
- The wiki is for code knowledge: how modules work, why decisions were made, what dependencies are in use
- Multiple agents need to share the same project context

## When NOT to Use

- The wiki is for a personal second brain (Mode D)
- The wiki is for a business/project (Mode C)
- The wiki is for a research topic (Mode E)
- The wiki is for a book/course (Mode F)

If you need a hybrid (e.g. a project wiki that also has personal goals), pick the dominant mode and add ONE extension folder from another mode. Don't try to combine 3 modes.

## The Mode B Structure

```
wiki/
├── modules/           # one page per major feature (src/features/*)
│   ├── _index.md
│   ├── fortune.md
│   ├── member-management.md
│   └── ...
├── components/        # one page per shared UI component (src/shared/ui/*)
│   ├── _index.md
│   ├── card.md
│   └── ...
├── decisions/         # Architecture Decision Records (ADRs)
│   ├── _index.md
│   ├── 001-direction-7-design.md
│   └── ...
├── dependencies/      # external libraries
│   ├── _index.md
│   ├── firebase.md
│   ├── motion.md
│   └── ...
├── flows/             # end-to-end user flows + data paths
│   ├── _index.md
│   ├── spin-the-wheel.md
│   └── ...
├── concepts/          # design + architecture knowledge (OPTIONAL EXTENSION)
│   ├── _index.md
│   ├── design-system.md
│   └── ...
├── sources/           # ingested source summaries
├── questions/         # filed Q&A
├── meta/              # dashboards
├── _index.md          # master catalog
├── log.md             # append-only chronological log
├── hot.md             # ~500-word recent context
└── overview.md        # ejecutivo summary
```

The base Mode B doesn't include `concepts/` — that's a useful extension for design/architecture knowledge. Add it if the project has design system work, architectural patterns, or framework-level knowledge to capture.

## The 10 Files to Create at Scaffold

1. **`_index.md`** — master catalog with links to every page
2. **`log.md`** — first entry documenting the scaffold
3. **`hot.md`** — ~500-word summary of current state
4. **`overview.md`** — one-paragraph project summary
5. **`modules/_index.md`** — list of modules
6. **`components/_index.md`** — list of components
7. **`decisions/_index.md`** — list of ADRs
8. **`dependencies/_index.md`** — list of external deps
9. **`flows/_index.md`** — list of flows
10. **`questions/_index.md`** + **`sources/_index.md`** + **`meta/`** (empty or with stubs)

## The Per-Page Schema

### Module page (`modules/[name].md`)

```yaml
---
type: module
path: "src/features/[name]/"
status: active | deprecated | experimental
language: typescript
purpose: ""
maintainer: ""
last_updated: YYYY-MM-DD
depends_on: []
used_by: []
tags: [module]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Module: [Name]

## Purpose
[One sentence]

## Location
`src/features/[name]/`

## Structure
[file tree]

## Public API
[barrel exports]

## Data Model
[TypeScript types]

## State / Data Flow
[hooks, services, how data moves]

## Files
- `path/to/file.ts` — what it does

## Related
- [[Module: X]]
- [[Dependency: Y]]
- [[Flow: Z]]
```

### Decision page (`decisions/NNN-name.md`)

```yaml
---
type: decision
status: proposed | accepted | superseded | deprecated
priority: 1-5
date: YYYY-MM-DD
owner: ""
context: ""
tags: [decision]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# ADR-NNN: [Title]

## Status
[proposed | accepted | ...]

## Context
[What is the issue? What are the forces?]

## Decision
[What is the change?]

## Consequences
### Positive
- [Benefit 1]
### Negative
- [Cost 1]

## Alternatives Considered
### [Alternative 1]
[Why rejected]

## Related
- [[ADR-NNN: ...]]
- [[Concept: ...]]
```

### Dependency page (`dependencies/[name].md`)

```yaml
---
type: dependency
name: ""
version: ""
status: active
risk: low | medium | high
tags: [dependency]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Dependency: [Name]

## What It Is
[One paragraph]

## Why We Use It
[Reason]

## Version
`X.Y.Z`

## Risk
[low | medium | high] — why

## Configuration
[where, notable options]

## Alternatives Considered
- [Alternative 1] — why rejected

## Related
- [[Module: X]]
```

### Flow page (`flows/[name].md`)

```yaml
---
type: flow
name: ""
trigger: ""
outcome: ""
tags: [flow]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Flow: [Name]

## Trigger
[What starts the flow?]

## Steps
1. [Step 1]
2. [Step 2]

## Outcome
[End state]

## Error Paths
- [What happens if step N fails?]

## Related
- [[Module: X]]
```

## Frontmatter Conventions

**Minimum required on every page**:

- `type: <module|component|decision|dependency|flow|concept|meta|question|source>`
- `created: YYYY-MM-DD`
- `updated: YYYY-MM-DD`
- `tags: [...]`

**Type-specific extras**:

- `status:` (most types)
- `path:` (modules, components)
- `version:` (dependencies)
- `priority:` (decisions)
- `risk:` (dependencies)

## The Hot Cache (hot.md)

The most important file. Every agent reads it first. Keep it under 500 words. Overwrite completely each time.

```markdown
---
type: meta
title: 'Hot Cache'
updated: YYYY-MM-DDTHH:MM:SS
---

# Recent Context

## Last Updated

YYYY-MM-DD. [what happened]

## Key Recent Facts

- [Most important recent takeaway]
- [Second most important]

## Recent Changes

- Created: [[New Page 1]], [[New Page 2]]
- Updated: [[Existing Page]] (added section on X)
- Flagged: Contradiction between [[Page A]] and [[Page B]] on Y

## Active Threads

- User is currently researching [topic]
- Open question: [thing still being investigated]
```

The hot cache is updated:

- After every ingest (add new source, update knowledge)
- After any significant query exchange
- At the end of every session

## The Log (log.md)

Append-only. New entries go at the TOP. One entry per significant operation.

```markdown
## 2026-06-06 — Wiki scaffolded

- Created full Mode B structure
- Seeded 28 initial pages
- ...

## 2026-06-05 — Added X

- ...
```

## Visual Customization (Obsidian)

Create `.obsidian/snippets/vault-colors.css` to color-code folders in the file explorer:

```css
:root {
  --wiki-1: #4fc1ff; /* modules - blue */
  --wiki-2: #c586c0; /* components - purple */
  --wiki-3: #dcdcaa; /* concepts - yellow */
  --wiki-4: #ce9178; /* decisions - orange */
  --wiki-5: #6a9955; /* dependencies - green */
  --wiki-6: #d16969; /* flows - red */
  --wiki-7: #569cd6; /* meta - cyan */
}

.nav-folder-title[data-path^='wiki/modules'] {
  color: var(--wiki-1);
}
.nav-folder-title[data-path^='wiki/components'] {
  color: var(--wiki-2);
}
.nav-folder-title[data-path^='wiki/concepts'] {
  color: var(--wiki-3);
}
.nav-folder-title[data-path^='wiki/decisions'] {
  color: var(--wiki-4);
}
.nav-folder-title[data-path^='wiki/dependencies'] {
  color: var(--wiki-5);
}
.nav-folder-title[data-path^='wiki/flows'] {
  color: var(--wiki-6);
}
.nav-folder-title[data-path^='wiki/meta'] {
  color: var(--wiki-7);
}
.nav-folder-title[data-path='.raw'] {
  color: #808080;
  opacity: 0.6;
}
```

Enable in Obsidian: Settings → Appearance → CSS Snippets → enable.

## The CLAUDE.md File

Create `CLAUDE.md` in the project root. This is the wiki's instruction file. It tells any agent (or human) how to use the wiki.

```markdown
# [PROJECT NAME]: LLM Wiki

Mode: B (GitHub/Repository)
Purpose: [ONE SENTENCE]
Owner: [NAME]
Created: YYYY-MM-DD

## Structure

[PASTE THE FOLDER MAP]

## Conventions

- All notes use YAML frontmatter
- Wikilinks use [[Note Name]] format
- .raw/ contains source documents: never modify them
- wiki/\_index.md is the master catalog: update on every ingest
- wiki/log.md is append-only
- wiki/hot.md is overwritten on every operation

## Operations

- Ingest: drop source in .raw/, say "ingest [filename]"
- Query: ask any question
- Lint: say "lint the wiki"
- Save: say "save this"
- Claim a task: edit the task page frontmatter
```

## The 10-Step Scaffold Procedure

1. **Read the project context** — README, PRODUCT.md, AGENTS.md, the codebase itself
2. **Pick the mode** — for a developer project, it's Mode B
3. **Create the folder structure** under `wiki/`
4. **Create the 10 foundational files** (index, log, hot, overview, + 6 \_index.md)
5. **Seed initial pages** — modules from `src/features/*`, key decisions, key dependencies, key flows
6. **Create templates** in `_templates/` for each note type
7. **Create visual customization** (`.obsidian/snippets/vault-colors.css`)
8. **Create the CLAUDE.md** in the project root
9. **Update the project's AGENTS.md** with a "Wiki Knowledge Base" section telling agents how to read the wiki
10. **Present the structure** to the user with the hot cache preview

## The Seed Content

Don't scaffold empty. Seed with at least:

- 1 page per major `src/features/*` module
- 1-2 ADRs for recent decisions
- 1 page per major external dependency
- 1-2 flow pages for the most important user journeys
- 1-2 concept pages for the design system or architecture pattern

This gives the wiki enough content to be useful from day one. Empty wikis feel like abandoned projects.

## The Maintenance Loop

Every agent touching the project should:

1. **Read `hot.md` first** (~500 tokens)
2. **Drill into `_index.md`** if not enough
3. **Make changes** to wiki pages when new facts emerge
4. **Update `hot.md`** after any significant operation
5. **Add a `log.md` entry** for any non-trivial change
6. **Update affected module/decision/concept pages** when relevant

This is the "compounding" part. The wiki gets richer with every session.

## Common Pitfalls

- **Don't scaffold empty.** A wiki with 5 stub pages feels dead. Seed with real content.
- **Don't mix modes.** If the project is a codebase, use Mode B. Don't add `intel/` or `characters/` folders.
- **Don't put the wiki in the wrong place.** It should be IN the project, so any agent working on the project finds it. Don't put it in `~/wiki/[project]/` — it loses proximity to the code.
- **Don't forget the CLAUDE.md.** Without it, agents don't know the wiki exists.
- **Don't forget to update AGENTS.md.** This is how every agent (not just Claude) finds the wiki.

## Related Skills

- `multi-agent-task-tracker` — directions + tasks for the wiki
- `design-direction-explorer` — for when the wiki needs to document a design exploration
- `design-integration-strategy` — for when the wiki needs to document a phased rollout
