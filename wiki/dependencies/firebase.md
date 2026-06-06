---
type: dependency
name: 'Firebase'
version: '^11.6.1'
status: active
risk: medium
alternatives: ['Supabase', 'Convex', 'self-hosted Postgres + REST']
tags: [dependency, backend, baas]
created: 2026-06-06
updated: 2026-06-06
---

# Dependency: Firebase

## What It Is

Google's Backend-as-a-Service. We use only the **Firestore** part — no Auth, no Storage, no Cloud Functions in app code. Auth wiring exists in the config but is not actively used by features.

## Why We Use It

- Real-time subscriptions built in (`onSnapshot` style)
- No server to manage (this is a single-dev internal tool)
- Free tier covers an internal team's traffic
- The data model is hierarchical (`rooms/{id}/members/{id}`) which fits Firestore's document model

## Risk

**Medium**. Vendor lock-in is real — Firestore's query model is its own. Migrating to Postgres or another document store would require re-shaping the data layer.

## Configuration

`src/shared/config/firebase.ts` reads from env:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Both `.env` (placeholders) and `.env.local` (real keys) are committed. The `.env.local` values are real and should NOT be propagated to forks.

## Data Model

```
rooms/{roomId}                # document
  ├── name, description, active, lastWinner
  ├── createdAt, updatedAt
  └── members                  # subcollection of RoomMember documents
fortunes/{fortuneId}          # global history of all spins
```

## Related

- [[Module: fortune]] — uses `fortunes` collection
- [[Module: room-management]] — uses `rooms` collection
- [[Module: member-management]] — uses `rooms/{id}/members` subcollection
