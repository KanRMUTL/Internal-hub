---
type: flow
name: 'Spin the Wheel'
trigger: "User clicks 'Spin the wheel' button on the Room page"
outcome: 'A winner is revealed, a history entry is written, and the wheel resets for the next spin'
tags: [flow, hero-feature]
created: 2026-06-06
updated: 2026-06-06
---

# Flow: Spin the Wheel

## Trigger

User clicks the **Spin the wheel** button on the Room page (or presses `Space`).

## Steps

1. `RoomPage` calls `handleSpinClick`
2. State: `spinning = true`, `rotation += SPINS_COUNT * 360 + randomOffset`
3. `WheelOfFortune` animates `rotate` from current to new value over 5.6s (ease-out-quart)
4. After 5.6s: pickWinner(rotation) → index of slice under pointer
5. `setLastWinnerId(winner.id)`, `setShowWinnerModal(true)`
6. `WinnerModal` opens with winner avatar + 3 actions
7. User chooses:
   - **Save to history** → `createFortuneHistoryEntry({roomId, winnerId, winnerName})` writes to Firestore
   - **Discard** → modal closes, no write
   - **Spin again** → modal closes, new spin starts after 80ms

## Outcome

A `fortunes/{id}` document in Firestore. The history list re-renders in real time across all clients subscribed to that room.

## Error Paths

- Firestore write fails → `FlashAlert` shows danger message
- Wheel has <2 active members → Spin button disabled
- Page reloads mid-spin → animation aborts, no winner, no write

## Related

- [[Module: fortune]]
- [[Module: room-management]] — provides roomId
- [[Module: member-management]] — provides eligible members
- [[Concept: Design System]] — motion tokens
