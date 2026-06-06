---
type: meta
title: 'Flows Index'
updated: 2026-06-06T04:05:00
---

# Flows Index

End-to-end user flows and data paths. Each flow is a step-by-step trace from trigger to outcome, with error paths.

## Hero Flows

- [[Flow: Spin the Wheel]] — press spin → wheel animates → winner modal → save to history
- [[Flow: Member Toggle Active/Inactive]] — toggle eye/eye-off in the modal → wheel pool updates

## Room Management

- [[Flow: Create Room]] — `+ New` button or `N` shortcut → modal → Firestore write → new card
- [[Flow: Remove Room]] — `...` menu on card → confirm modal → Firestore delete → card disappears

## Members

- [[Flow: Add Member]] — `Manage` button in members side card → type name → Enter → Firestore write → new row

## Theme

- [[Flow: Theme Toggle]] — icon in the top bar → localStorage write → re-render

## How to Document a New Flow

1. Use `_templates/flow.md`.
2. Name the trigger as concretely as possible ("Click X" not "User wants Y").
3. List steps in order, including async steps.
4. Always include error paths.
5. Cross-reference the implementing module.
