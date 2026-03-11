# Batch 7: Performance Audit - Implementation Plan

## 1. Bundle Size Audit

- [ ] Run `npm run build` to generate chunks.
- [ ] Analyze the output for large vendor libraries.
- [ ] If `firebase` or `lucide-react` are too large, consider tree-shaking or dynamic imports.

## 2. Code Splitting (Lazy Loading)

- [ ] Modify `src/app/routes/AppRouter.tsx`.
- [ ] Replace direct imports with `React.lazy()` for:
  - `Room` (likely `RoomPage`)
  - `Lobby`
  - `HostCreateQuiz`
  - `HostScreen`
  - `PlayerScreen`
- [ ] Wrap routes in `Suspense`.

## 3. Firebase Optimization

- [ ] Audit `src/features/member-management/hooks/useMemberCollection.ts`.
- [ ] Audit `src/features/quiz/hooks/useQuizRoom.ts`.
- [ ] Ensure `onSnapshot` returns a clean-up function in `useEffect`.

## 4. Render Optimization

- [ ] Wrap `src/features/fortune/ui/WheelOfFortune.tsx` with `React.memo`.
- [ ] Wrap `src/features/quiz/ui/QuizTimer.tsx` with `React.memo`.
- [ ] Verify if props passed to these components need `useMemo` or `useCallback` in their parents.

## 5. A11y & Perf Sync

- [ ] Inspect `src/pages/Room/ui/RoomPage.tsx`.
- [ ] Verify `PerformanceMonitor` is implemented and tracking metrics.

## 6. Git Push

- [ ] Stage changes.
- [ ] Commit with "perf: execute Batch 7 Performance Audit optimizations".
- [ ] Push to main.
