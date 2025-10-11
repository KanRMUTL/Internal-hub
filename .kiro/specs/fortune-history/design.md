# Design Document

## Overview

The Fortune History feature extends the existing Wheel of Fortune functionality by adding persistent storage and display of fortune wheel results. The design follows the existing Feature-Sliced Design (FSD) architecture and integrates seamlessly with the current Firebase/Firestore data layer and React/TypeScript frontend.

## Architecture

### Data Flow

1. User spins wheel → Winner selected → LuckyModal displays
2. User clicks "Accept" → Fortune history entry created in Firestore
3. Real-time listener updates fortune history table → UI reflects new entry
4. History table displays chronological list of all fortune results

### Integration Points

- **LuckyModal**: Modified to save fortune history on accept
- **RoomPage**: Extended to display fortune history table
- **Firestore**: New subcollection for fortune history entries
- **Shared Components**: Leverage existing Table, DataBoundary, and styling

## Components and Interfaces

### Data Models

#### FortuneHistoryEntry

```typescript
interface FortuneHistoryEntry {
  id: string
  winnerId: string
  winnerName: string
  roomId: string
  createdAt: string
}
```

#### FortuneHistoryTableProps

```typescript
interface FortuneHistoryTableProps {
  roomId: string
  className?: string
}
```

### Component Structure

#### 1. Fortune History Service (`src/features/fortune/services/fortuneHistoryServices.ts`)

- `getFortuneHistoryQuery(roomId: string)` - Returns Firestore query for history
- `createFortuneHistoryEntry(entry: Omit<FortuneHistoryEntry, 'id'>)` - Saves new entry
- `clearFortuneHistory(roomId: string)` - Removes all history for room

#### 2. Fortune History Hook (`src/features/fortune/hooks/useFortuneHistory.ts`)

- Manages fortune history state and operations
- Provides real-time data subscription
- Handles loading, error states, and CRUD operations
- Returns: `{ history, loading, error, saveEntry, clearHistory }`

#### 3. Fortune History Table (`src/features/fortune/ui/FortuneHistoryTable.tsx`)

- Displays paginated table of fortune history
- Uses existing shared Table component
- Implements responsive design
- Shows loading/error states via DataBoundary

#### 4. Clear History Modal (`src/features/fortune/ui/ClearHistoryModal.tsx`)

- Confirmation dialog for clearing history
- Follows existing modal patterns
- Uses ModalConfirm shared component

### Modified Components

#### 1. LuckyModal Enhancement

- Add `onAccept` callback parameter to save history
- Integrate with fortune history service
- Handle save errors with flash alerts

#### 2. RoomPage Integration

- Add FortuneHistoryTable component below member management
- Pass roomId to fortune history components
- Handle layout adjustments for new table

## Data Models

### Firestore Collection Structure

```
/room/{roomId}/fortune-history/{entryId}
```

### Document Schema

```typescript
{
  winnerId: string,        // Reference to member ID
  winnerName: string,      // Snapshot of winner name at time of spin
  roomId: string,          // Parent room ID
  createdAt: string,       // ISO timestamp
}
```

### Indexing Strategy

- Primary index: `createdAt` (descending) for chronological ordering

## Error Handling

### Save Operation Errors

- Network failures: Retry mechanism with exponential backoff
- Permission errors: Display user-friendly error message
- Validation errors: Client-side validation before save attempt

### Load Operation Errors

- Connection issues: Show retry button in table area
- Empty state: Display "No fortune history yet" message
- Real-time listener errors: Fallback to manual refresh option

### Error Display Strategy

- Use existing FlashAlert component for save errors
- Integrate error states into DataBoundary for table display
- Provide clear error messages with actionable next steps

## Testing Strategy

### Unit Tests

- **Services**: Test Firestore operations with mocked Firebase SDK
- **Hooks**: Test state management and side effects with React Testing Library
- **Components**: Test rendering, user interactions, and prop handling

### Integration Tests

- **Fortune Flow**: End-to-end test from wheel spin to history save
- **Real-time Updates**: Test multiple users seeing updates simultaneously
- **Error Scenarios**: Test network failures and recovery

### Test Data Setup

- Mock Firestore collections with test data
- Create test utilities for fortune history entries
- Use existing test patterns from member management

### Key Test Cases

1. **Happy Path**: Spin wheel → Accept → Verify history entry created
2. **Error Handling**: Network failure during save → Verify error display
3. **Real-time Updates**: Multiple users → Verify all see new entries
4. **Clear History**: Confirm dialog → Verify all entries removed
5. **Responsive Design**: Different screen sizes → Verify table layout

### Performance Considerations

- **Pagination**: Implement virtual scrolling for large datasets
- **Real-time Efficiency**: Use Firestore query limits to reduce bandwidth
- **Caching**: Leverage React Query or similar for client-side caching
- **Bundle Size**: Code-split fortune history components for lazy loading

### Accessibility

- **Table Navigation**: Proper ARIA labels and keyboard navigation
- **Screen Readers**: Semantic HTML and descriptive text
- **Color Contrast**: Follow existing design system standards
- **Focus Management**: Proper focus handling in modals and interacti
