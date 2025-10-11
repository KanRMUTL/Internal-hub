# Implementation Plan

- [x] 1. Create fortune history data models and types

  - Define FortuneHistoryEntry interface in new types file
  - Create constants for collection names and configuration
  - _Requirements: 1.2, 1.3_

- [x] 2. Implement fortune history Firestore services

  - Create fortuneHistoryServices.ts with CRUD operations
  - Implement getFortuneHistoryQuery function for real-time data fetching
  - Implement createFortuneHistoryEntry function for saving new entries
  - Implement clearFortuneHistory function for bulk deletion
  - Implement getNextSpinNumber function for sequence generation
  - _Requirements: 1.1, 1.2, 5.3_

- [x] 3. Create fortune history custom hook

  - Implement useFortuneHistory hook for state management
  - Integrate with useFirestoreCollection for real-time updates
  - Handle loading, error, and success states
  - Provide functions for saving and clearing history
  - _Requirements: 1.1, 3.1, 3.2_

- [x] 4. Build fortune history table component

  - Create FortuneHistoryTable component using existing Table component
  - Implement responsive table layout with winner name, date/time, and spin number columns
  - Format timestamps using day.js for user-friendly display
  - Handle empty state with appropriate messaging
  - _Requirements: 2.1, 2.2, 2.4, 4.2, 4.4_

- [x] 5. Integrate fortune history saving into LuckyModal

  - Modify LuckyModal to accept fortune history save function as prop
  - Update onAccept handler to save fortune history entry before closing modal
  - Add error handling for save failures using FlashAlert
  - _Requirements: 1.1, 1.4, 1.5_

- [x] 6. Update RoomPage to display fortune history

  - Add FortuneHistoryTable component to RoomPage layout
  - Position table below member management section
  - Pass roomId prop to fortune history components
  - Integrate clear history functionality with proper permissions
  - _Requirements: 2.1, 5.1_

- [x] 7. Add fortune history exports and barrel files

  - Create index.ts files for fortune history feature exports
  - Export components, hooks, and services from feature module
  - Update main fortune feature index to include history exports
  - _Requirements: All requirements - enables feature integration_

- [x] 8. Implement error handling and loading states

  - Add DataBoundary wrapper for fortune history table
  - Implement proper error messages for save and load failures
  - Add loading spinners and skeleton states for table
  - Handle network failures with retry mechanisms
  - _Requirements: 1.4, 2.5, 4.5_

- [x] 9. Add real-time update animations and UX enhancements

  - Implement highlight animation for new fortune history entries
  - Add smooth transitions for table updates
  - Maintain scroll position during real-time updates
  - Add motion animations consistent with existing design
  - _Requirements: 3.3, 3.4_

- [x] 10. Write comprehensive unit tests for fortune history services

  - Test createFortuneHistoryEntry with valid and invalid data
  - Test getNextSpinNumber sequence generation
  - Mock Firebase SDK for isolated testing
  - _Requirements: 1.1, 1.2_

- [x] 11. Write unit tests for fortune history hook and components
  - Test useFortuneHistory hook state management and side effects
  - Test FortuneHistoryTable rendering with different data states
  - Test LuckyModal integration with fortune history saving
  - _Requirements: 1.1, 2.1_
