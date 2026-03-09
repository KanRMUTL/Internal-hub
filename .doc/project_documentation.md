# Project Documentation: internal-hub

## 1. High-Level Architecture

### 1.1 System Context Diagram

```mermaid
flowchart TD
    User([User / Internal Employee]) -->|Interacts with| WebApp[React Web Application]

    subgraph Frontend [Frontend Application (internal-hub)]
        WebApp -->|Routes| Pages[Pages Layer]
        Pages -->|Composes| Widgets[Widgets Layer]
        Widgets -->|Uses| Features[Features Layer]
        Features -->|Depends on| Entities[Entities Layer]
        Entities -->|Relies on| Shared[Shared UI/Config/Hooks]
    end

    Shared -->|Firebase SDK| FirebaseBackend[(Firebase Services)]

    subgraph Backend [Backend]
        FirebaseBackend --> Firestore[Cloud Firestore]
        FirebaseBackend --> FirebaseAuth[Firebase Authentication]
    end
```

### 1.2 Tech Stack

- **Core Framework**: React 19, TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Styled Components
- **Animations**: Motion (Framer Motion)
- **Backend / BaaS**: Firebase (Firestore v11)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Utilities**: Lodash, Dayjs, React-Use
- **Testing**: Vitest, React Testing Library, JSDOM
- **Code Quality**: ESLint, Prettier, Husky, Lint-Staged

### 1.3 Data Flow

1.  **UI Interaction**: Users interact with components in the `Pages` or `Features` layer.
2.  **State & Logic Hook**: The component triggers a custom hook (e.g., `useFirestoreCollection` or feature-specific hooks like `hooks/useAnimationPerformance.ts`).
3.  **Service Layer**: The hook communicates with Firebase through the `services` defined in the feature layer or `shared/config/firebase.ts`.
4.  **Real-time Sync**: Firebase Firestore synchronizes data changes back to the client.
5.  **UI Update**: React re-renders the DOM, utilizing `WithMotion` or `MotionWrapper` for smooth transitions.

---

## 2. Development Workflow & Standards

### 2.1 Branching Strategy

The project utilizes **Trunk-based development**:

- All developers merge their code directly into the main `trunk` (or `main` branch) frequently (at least daily).
- Short-lived feature branches are used for isolated work and merged back into the trunk quickly via Pull Requests.
- Feature flags/toggles are encouraged to decouple deployment from release, ensuring incomplete features do not affect the production environment.

### 2.2 Coding Standards

The architecture strictly adheres to **Feature-Sliced Design (FSD)** (https://feature-sliced.design/).

- Code is organized by business domain rather than technical function.
- Strict unidirectional dependency rule: upper layers (`app`, `pages`) can import from lower layers (`features`, `entities`, `shared`), but lower layers cannot import from upper layers.
- Automated formatting and linting are enforced via Prettier and ESLint, orchestrated by Husky pre-commit hooks.

---

## 3. API & Interface Documentation

### 3.1 Endpoint Definitions

Given the serverless Firebase architecture, "endpoints" correlate to Firestore Collections and Documents.

- **Rooms**: `collections('rooms')` - Manages active application rooms/sessions.
- **Members**: `collections('members')` - Data regarding team members and their statuses.
- **Quiz**: `collections('quizzes')` - Stores questions, answers, host data, and live game states.
- **Fortune**: `collections('fortunes')` - Stores history and results for the Fortune feature.

### 3.2 Authentication

- Managed natively by Firebase Authentication.
- Interaction occurs through shared configurations located at `src/shared/config/firebase.ts`.

### 3.3 Error handling

- **Service Level**: Firebase operations utilize custom hooks (`useFirestoreCollectionWithRetry`) to gracefully handle network issues.
- **Component Level**: Try/catch blocks are implemented in feature hooks.
- **UI Level**: Errors are surfaced to the user using shared feedback components:
  - `DataBoundary` for wrapping suspends/errors in rendering.
  - `FlashAlert` and `Alert` for transient notifications.
  - `EmptyState` for visualizing missing data scenarios.

---

## 4. Directory Structure

### 4.1 Root Map

```text
src/
├── app/              # Application initialization, global routing, and providers
├── pages/            # Routable page components (Home, Room, Lobby, HostScreen, etc.)
├── widgets/          # Complex, independent UI blocks (e.g., Layout)
├── features/         # User scenarios and business logic (fortune, quiz, member-management)
├── entities/         # Business entities (room)
├── shared/           # Reusable core elements (UI kit, hooks, config, styles, assets)
└── test/             # Global test setups, utilities, and visual regression reporting
```

### 4.2 Naming Convention

- **Directories**: Kebab-case for generic folders (`member-management`, `room-management`) or PascalCase for specific Pages/Components (`HostCreateQuiz`, `PlayerScreen`).
- **React Components**: PascalCase (e.g., `AppRouter.tsx`, `FlashAlert.tsx`).
- **Hooks**: camelCase with `use` prefix (e.g., `useFirestoreCollection.ts`, `useModal.ts`).
- **Utility/Config**: camelCase (e.g., `firebase.ts`, `globalStyle.ts`).
- **Types**: Interfaces and types are PascalCase and generally housed in `types.ts` or `model/` directories.

### 4.3 Component design

- **Styling**: Components utilize `styled-components` for encapsulated CSS-in-JS.
- **Accessibility**: Components integrate strict accessibility (a11y) standards, utilizing elements like `LiveRegion`, `ScreenReaderOnly`, `FocusTrap`, and `SkipLinks`.
- **Animation**: Delegated to Framer Motion via shared wrappers (`MotionWrapper`, `WithMotion`).
- **Reusability**: Core UI components (Buttons, Inputs, Modals, Cards, Typography) are entirely generic, abstracted into `src/shared/ui/` and agnostic of business logic.

---

## 5. Modules and feature in project

- **Fortune (`src/features/fortune`)**:
  - A module for randomized fortune telling or gamified selection. Includes its own history tracking, models, and UI.
- **Member Management (`src/features/member-management`)**:
  - Handles internal directory operations. Enables viewing, organizing, and managing internal hub members.
- **Quiz (`src/features/quiz`)**:
  - A robust interactive multiplayer game feature.
  - Includes distinct user flows: `HostCreateQuiz`, `HostScreen`, `JoinQuizeGame`, `Lobby`, and `PlayerScreen`.
  - Manages live state synchronization between hosts and players via Firebase.
- **Room Management (`src/features/room-management` / `src/entities/room`)**:
  - Core logic for real-time collaborative spaces. Allows users to join, leave, and interact within a shared context or session.
- **Theme Toggle (`src/features/toggle-theme`)**:
  - Application-wide Light/Dark mode management, complete with localized context providers and shared UI toggles.
