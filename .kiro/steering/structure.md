# Project Structure

## Architecture Pattern

Follows **Feature-Sliced Design (FSD)** architecture with clear separation of concerns across layers.

## Directory Structure

```
src/
├── app/           # Application layer - routing, providers
├── pages/         # Page components (Home, Room)
├── widgets/       # Complex UI blocks (Layout)
├── features/      # Business logic features
├── entities/      # Business entities (room, member)
└── shared/        # Reusable code (UI, hooks, config)
```

## Layer Responsibilities

### App Layer (`src/app/`)

- Application setup and configuration
- Global providers (ThemeProvider)
- Routing configuration
- Global styles integration

### Pages (`src/pages/`)

- Route-level components
- Page-specific logic and layout
- Each page has its own folder with `ui/` subdirectory

### Features (`src/features/`)

- Self-contained business features
- Each feature includes:
  - `ui/` - Feature-specific components
  - `hooks/` - Feature logic and state management
  - `services/` - API calls and external integrations
  - `config/` - Feature constants and configuration
  - `libs/` - Feature-specific utilities

### Entities (`src/entities/`)

- Business domain models
- Entity-specific components and types
- Structure: `model/` (types), `ui/` (components)

### Shared (`src/shared/`)

- Reusable UI components (`ui/`)
- Common hooks (`hooks/`)
- Global configuration (`config/`)
- Design system (`styles/`)

## Import Conventions

- Use path aliases: `shared/ui`, `features/member-management`, etc.
- Barrel exports via `index.ts` files
- Clean imports without relative paths

## Component Structure

- Styled Components with theme integration
- Props prefixed with `$` for styled-components
- Motion animations for interactions
- Consistent naming: PascalCase for components, camelCase for props

## File Naming

- Components: PascalCase (e.g., `MemberManagement.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useMemberManagement.ts`)
- Types: PascalCase with descriptive suffixes (e.g., `RoomTypes.ts`)
- Constants: camelCase files, UPPER_CASE exports
