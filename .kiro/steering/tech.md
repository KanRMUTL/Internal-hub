# Technology Stack

## Core Technologies

- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and dev server
- **Styled Components** - CSS-in-JS styling solution
- **Firebase** - Backend services (Firestore, Hosting)

## Key Libraries

- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Motion** - Animation library (Framer Motion successor)
- **Lucide React** - Icon library
- **Day.js** - Date manipulation
- **Lodash** - Utility functions
- **React Use** - Collection of React hooks

## Development Tools

- **ESLint** - Code linting with React-specific rules
- **Prettier** - Code formatting (120 char width, single quotes, no semicolons)
- **Husky** - Git hooks for pre-commit checks
- **Lint-staged** - Run linters on staged files

## Common Commands

### Development

```bash
yarn dev          # Start development server
yarn build        # Build for production (TypeScript + Vite)
yarn preview      # Preview production build
```

### Code Quality

```bash
yarn lint         # Run ESLint
yarn format       # Format code with Prettier
```

### Deployment

- Builds to `dist/` directory
- Deployed via Firebase Hosting
- Uses Firebase rewrites for SPA routing

## Build Configuration

- **Vite aliases** configured for clean imports (src/, app/, features/, etc.)
- **TypeScript paths** mirror Vite aliases
- **Firebase hosting** serves from dist/ with SPA fallback
