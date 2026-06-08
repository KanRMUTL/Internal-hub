---
type: dependency
name: 'React Hook Form'
version: '7.56.1'
status: active
risk: low
alternatives: ['Formik', 'Final Form', 'native useState']
tags: [dependency, form, react]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: React Hook Form

## What It Is

Form state management for React. Uncontrolled-by-default, minimal re-renders, built-in validation, and field arrays. The de facto standard for non-trivial forms in 2026.

## Why We Use It

- **Performance** — uncontrolled inputs mean no re-render on every keystroke.
- **Tiny bundle** — ~9kb gzipped.
- **Schema validation** — works with zod, yup, joi out of the box.
- **Simple API** — `useForm()`, `register`, `handleSubmit`, `formState.errors`.

## Version

`^7.56.1` (caret)

## Risk

**Low** — stable, no breaking changes planned.

## Configuration

- No global config; each form creates a `useForm()` instance.
- Validation is per-field (e.g., `register('name', { required: true, minLength: 2 })`).

## Alternatives Considered

- **Formik** — older, more verbose, slower.
- **Final Form** — subscription model, less React-y.
- **native `useState`** — fine for 1–2 field forms; we use it for the modern member-management modal.

## Upgrades

- [ ] Track 7.x patch releases

## Related

- [[Module: room-management]] — `RoomModal` uses RHF
- [[Tech Stack]]
