---
type: direction
status: active
owner: 'unassigned'
start_date: 2026-06-06
target_date: ''
tags: [direction, design, integration]
created: 2026-06-06
updated: 2026-06-06
---

# Direction: Direction 7 Integration

The rollout of the modern Direction 7 design language (chosen in [[ADR-001: Direction 7 Design]]) into the production codebase.

## Summary

Direction 7 is "modern × minimal × playful" — a restrained teal-led system that uses OKLCH colors, one font family (Inter), hairline borders, and a single playful moment per surface. It replaces the previous unrefined design (bright primary used everywhere, 18-color rainbow wheel, no design system).

## Goal

Every visible surface in `internal-hub` renders in the Direction 7 visual language. The preview infrastructure is removed. No user-facing component retains the old style.

## Status

- ~35% shipped to production (theme tokens, RoomItem card, wheel palette)
- ~10 preview components awaiting integration
- Multiple sessions of work remaining; this direction has no fixed end date

## Tasks

Sorted by priority. Highest priority first.

### High priority — Room page composition

- [[Task: Replace production WheelOfFortune with WheelOfFortuneModern]] — todo · unassigned
- [[Task: Wire WinnerModalModern over LuckyModal]] — todo · unassigned
- [[Task: Wire MemberManagementModalModern over MembersModal]] — todo · unassigned
- [[Task: Replace FortuneHistoryTable with HistoryListModern]] — todo · unassigned

### Medium priority — Home page polish

- [[Task: Update Home page composition to ModernHomePreview]] — todo · unassigned
- [[Task: Add Home page section header]] — todo · unassigned
- [[Task: Add Home page empty state with wheel illustration]] — todo · unassigned
- [[Task: Add Home page keyboard hints]] — todo · unassigned

### Medium priority — App chrome

- [[Task: Replace production Layout widget (top bar)]] — todo · unassigned
- [[Task: Add "..." menu for remove room]] — todo · unassigned

## Files

This direction touches:

- `src/entities/room/ui/RoomItem.tsx` (already modern)
- `src/features/fortune/` (wheel, history, modals)
- `src/features/member-management/` (member management modal)
- `src/features/room-management/` (list composition, member list)
- `src/pages/Home/ui/Home.tsx` (composition)
- `src/pages/Room/ui/RoomPage.tsx` (composition)
- `src/widgets/Layout/` (top bar)

## Related

- [[ADR-001: Direction 7 Design]] — the design language this direction implements
- [[Concept: Design System]] — the tokens
- [[Hot Cache]] — live integration status
