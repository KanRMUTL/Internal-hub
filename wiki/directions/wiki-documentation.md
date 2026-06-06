---
type: direction
status: active
owner: 'unassigned'
start_date: 2026-06-06
target_date: ''
tags: [direction, wiki, documentation]
created: 2026-06-06
updated: 2026-06-06
---

# Direction: Wiki Documentation

Populate the wiki with the project's full knowledge. Every important source, module, component, decision, dependency, and flow should be discoverable via the wiki's index.

## Summary

The wiki was scaffolded on 2026-06-06 with 28 seed pages and a Mode B + concepts structure. Many areas are still stub or empty. This direction covers the work to bring the wiki to "every important project fact is findable in ≤3 clicks" status.

## Goal

Every `src/features/*` module has a page. Every `src/shared/ui/*` component has a page. Every external dependency has a page. Every architectural pattern and design concept has a page. Every meaningful source has been ingested.

## Status

- 4 of 4 features have module pages (done)
- 0 of ~15 shared/ui components have pages
- 3 of ~10 external dependencies have pages
- 0 of ~6 meaningful flows have pages (only 2 placeholder ones exist)
- 0 sources ingested

## Tasks

### High priority — Sources

- [[Task: Ingest PRODUCT.md as a wiki source]] — todo · unassigned
- [[Task: Ingest AGENTS.md as a wiki source]] — todo · unassigned

### Medium priority — Components

- [[Task: Document shared/ui components (Card, Button, Modal, etc.)]] — todo · unassigned

### Medium priority — Dependencies + flows

- [[Task: Document remaining dependencies (React, Vite, etc.)]] — todo · unassigned
- [[Task: Document remaining flows (member CRUD, room CRUD)]] — todo · unassigned

## Files

This direction is mostly about `wiki/*` content creation. It does not touch `src/` unless the agent uncovers a new fact worth filing.

## Related

- [[CLAUDE.md]] — wiki conventions
- [[Hot Cache]] — live status
