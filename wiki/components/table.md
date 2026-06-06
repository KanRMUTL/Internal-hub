---
type: component
path: 'src/shared/ui/Table'
status: active
purpose: 'Data table primitive with sticky header, sort indicators, and column width tokens. The legacy `FortuneHistoryTable` used this; the modern `HistoryListModern` uses an avatar-row list instead.'
props:
  - name: 'columns'
    type: 'TableColumn[]'
    required: true
    description: 'Column definitions: id, label, key, align, width, mobileLabel.'
  - name: 'rows'
    type: 'Record<string, unknown>[]'
    required: true
    description: 'Row data; keys must match column `key`.'
  - name: 'keyExtractor'
    type: '(row) => string'
    required: true
    description: 'Stable row id for React keys.'
  - name: 'loading'
    type: 'boolean'
    default: 'false'
    description: 'Shows skeleton rows when true.'
  - name: 'emptyMessage'
    type: 'string'
    default: 'No data'
    description: 'Message when rows is empty.'
  - name: 'striped'
    type: 'boolean'
    default: 'false'
    description: 'Alternating row background.'
used_by:
  - '[[Module: fortune]] (legacy `FortuneHistoryTable` — replaced by `HistoryListModern` for Direction 7)'
tags: [component, table, data, a11y]
created: 2026-06-06
updated: 2026-06-06
---

# Component: Table

Data table primitive. Renders a `<table>` with sticky header, configurable column widths (desktop + mobile), and a skeleton loading state.

## Location

`src/shared/ui/Table/`

## Accessibility

- `<table>` with `<thead>` and `<tbody>` (proper semantic structure).
- `role="columnheader"` on th, `role="cell"` on td.
- `aria-sort` is settable per column when sorting is enabled.

## Notes

- The Direction 7 redesign replaced this in the room page with `HistoryListModern` (an avatar-row list). The Table is still useful for dense data, settings, or admin views.
- For new tables, prefer the avatar-row pattern unless you need sortable columns or >5 rows visible at once.
