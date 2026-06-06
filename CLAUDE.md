# internal-hub Wiki

Mode: B (GitHub/Repository) + concepts/ extension
Purpose: Centralized context hub so multiple agents working on this project share the same knowledge.
Owner: project
Created: 2026-06-06

## Structure

```
internal-hub/
├── .raw/             # Immutable source documents (drop files here to ingest)
├── wiki/             # LLM-generated knowledge base
│   ├── modules/      # one page per major feature (src/features/*)
│   ├── components/   # one page per shared UI component (src/shared/ui/*)
│   ├── decisions/    # Architecture Decision Records (ADRs)
│   ├── dependencies/ # external libraries
│   ├── flows/        # end-to-end user flows + data paths
│   ├── concepts/     # design + architecture knowledge
│   ├── directions/   # long-running initiatives (multi-agent coordination)
│   ├── tasks/        # concrete units of work (one per task)
│   ├── sources/      # ingested source summaries
│   ├── questions/    # filed Q&A
│   ├── meta/         # dashboards, lint reports
│   ├── _index.md     # master catalog
│   ├── log.md        # append-only chronological log
│   ├── hot.md        # ~500-word recent context
│   └── overview.md   # ejecutivo summary
├── _templates/       # note templates (module, component, decision, task, direction, etc.)
└── CLAUDE.md         # this file
```

## Conventions

- All notes use YAML frontmatter: `type`, `status`, `created`, `updated`, `tags` (minimum)
- Wikilinks use `[[Note Name]]` format — filenames are unique, no paths needed
- `.raw/` contains source documents — never modify them
- `wiki/_index.md` is the master catalog — update on every ingest
- `wiki/log.md` is append-only — new entries go at the TOP
- `wiki/hot.md` is the ~500-word recent context — overwrite completely each time

## Task Conventions (multi-agent coordination)

The wiki has a built-in task tracker so multiple agents can work together without file conflicts.

**Layout**:

- `wiki/directions/` — long-running initiatives (one page each). Each has an `owner`.
- `wiki/tasks/` — concrete units of work (one page each). Use `_templates/task.md`.
- `wiki/tasks/_index.md` — master list of all tasks

**Task frontmatter** (key fields):

- `status`: `todo` | `in-progress` | `blocked` | `review` | `done`
- `direction`: which initiative this belongs to (e.g. `Direction 7 Integration`)
- `owner`: which agent is working on this (e.g. `agent-a`, `human`)
- `files`: list of files this task owns — other agents MUST NOT touch these while in-progress
- `depends_on` / `blocks`: cross-task dependencies

**How an agent claims a task**:

1. Check `wiki/hot.md` and the task page — confirm no other agent is on it
2. Update frontmatter: `status: todo` → `in-progress`, `owner: your-agent-name`, `started: today`
3. Add a Progress Log entry: "Claimed by [your-agent-name]"
4. Begin work

**How an agent completes a task**:

1. Update frontmatter: `status: in-progress` → `done`
2. Add a Progress Log entry: "Done — [one-line summary]"
3. Update `wiki/hot.md` with the new fact
4. If you changed code, run `yarn lint && yarn build && yarn test:run` and note the result

**Conflict avoidance**: the `files` field is the source of truth. If you need to edit a file that's listed in another agent's in-progress task, ask first (in their Progress Log) or pick a different task.

## Operations

- **Ingest**: drop a source in `.raw/`, then say "ingest [filename]"
- **Query**: ask any question — Claude reads `hot.md` → `overview.md` → `_index.md` → specific pages
- **Lint**: say "lint the wiki" to run a health check
- **Save**: say "save this" to file the current conversation
- **Claim a task**: edit the task page's frontmatter; the conflict-avoidance field is `files`

## Agent Integration

The wiki is the single source of truth for project context. When working on this project:

1. Read `wiki/hot.md` first (recent context, ~500 tokens)
2. If not enough, read `wiki/overview.md` + `wiki/_index.md` (~1.5k tokens)
3. Drill into specific module/decision/concept pages (~200-400 each)
4. **Do not crawl the wiki for general coding questions** — only for project-specific context

See `AGENTS.md` in the project root for the full agent rules.

## Visual Customization

`vault-colors.css` is in `.obsidian/snippets/`. Enable in Obsidian:
Settings → Appearance → CSS Snippets → open folder (the snippet is already there) → refresh → toggle on.

Folder colors:

- modules/ → blue
- components/ → purple
- concepts/ → yellow
- decisions/ → orange
- dependencies/ → green
- flows/ → red
- meta/ → cyan
- .raw/ → grey (faded)

<!-- gitnexus:start -->

# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Internal-hub** (1862 symbols, 2285 relationships, 8 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource                                      | Use for                                  |
| --------------------------------------------- | ---------------------------------------- |
| `gitnexus://repo/Internal-hub/context`        | Codebase overview, check index freshness |
| `gitnexus://repo/Internal-hub/clusters`       | All functional areas                     |
| `gitnexus://repo/Internal-hub/processes`      | All execution flows                      |
| `gitnexus://repo/Internal-hub/process/{name}` | Step-by-step execution trace             |

## CLI

| Task                                         | Read this skill file                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md`       |
| Blast radius / "What breaks if I change X?"  | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?"             | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md`       |
| Rename / extract / split / refactor          | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md`     |
| Tools, resources, schema reference           | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md`           |
| Index, status, clean, wiki CLI commands      | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md`             |

<!-- gitnexus:end -->
