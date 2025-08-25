# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

The GMP (Good Manufacturing Practices) Training Game is a React-based educational gaming platform built with TypeScript, Vite, and Supabase. It provides interactive training modules for pharmaceutical manufacturing compliance through gamified learning experiences.

**Technology Stack:**
- Frontend: React 18, TypeScript, Vite
- UI: Tailwind CSS, Framer Motion, Lucide React icons
- State Management: Redux Toolkit, Redux Persist
- Backend: Supabase (PostgreSQL database, authentication, real-time)
- Drag & Drop: @dnd-kit
- Routing: React Router DOM 7

## Development Commands

### Core Commands
```bash
# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Testing
The project uses custom test files and console-based testing rather than traditional test frameworks:
- Browser console test scripts in root directory (`test-*.js`)
- Component test files in `src/components/*/tests/`
- Manual testing components for UI validation

## Architecture Overview

### Core Structure
- `src/components/` - Reusable UI components organized by feature
- `src/screens/` - Main application screens and routing
- `src/gmp-simulation/` - Core game simulation logic
- `src/data/` - Static game data, questions, scenarios
- `src/services/` - External service integrations (Supabase, etc.)
- `src/store/` - Redux state management
- `src/types/` - TypeScript type definitions

### Key Components by Level

**Level 1: Bingo Game (Modules 1-4)**
- Location: `src/screens/BingoGame.tsx`, `src/components/Level1/`
- Features: Multiple choice questions in bingo grid format
- Data: Module-specific questions in `src/data/Level1/`

**Level 2: GMP vs Non-GMP Comparison**
- Location: `src/components/Level2/`
- Features: Drag-and-drop term placement, real-time scoring
- Architecture: Service-oriented with `level2GameService.ts`

**Level 3: Jigsaw Puzzle Game**
- Location: `src/components/l3/`
- Features: Drag-and-drop violation/action matching
- Key Files: `JigsawBoard.tsx` (main game), `ScenarioDialog.tsx`
- Data: `src/data/level3Scenarios.ts`

**Level 4: Case-Based Learning**
- Location: `src/components/Level4/`
- Features: 2D facility simulation, case file analysis
- Architecture: Container pattern with Supabase integration

**GMP Simulation (Innovation Quest)**
- Location: `src/gmp-simulation/`
- Features: Multi-stage hackathon simulation
- Key Files: `GmpSimulation.tsx`, `level2/Level2Screen3.tsx`

## Database Schema & Services

### Primary Tables
- `level_1` - Bingo game progress and scores
- `level2_game_data` - Level 2 game sessions and results
- `level3_progress` - Jigsaw game progress with piece placements
- `level3_history` - Completed Level 3 sessions for analytics
- `level_4` - Case-based learning progress
- `level2_screen3_progress` - Innovation Quest progress
- `selected_cases` - User case selections for simulation

### Service Layer
- `levelProgressService.ts` - Cross-level completion tracking
- `moduleProgressService.ts` - Module-level progress management
- Level-specific services in respective component directories

## Common Development Patterns

### State Management
- Redux Toolkit for global state
- Redux Persist for data persistence
- Component-level state with hooks for UI interactions

### Authentication Flow
- Supabase Auth with email/password
- Row Level Security (RLS) for data protection
- User context throughout application

### Responsive Design
- Mobile-first approach with `useDeviceLayout` hook
- Landscape orientation required for most games
- Conditional rendering based on device type

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Console logging for debugging

## Key Development Guidelines

### Code Organization
- Components are organized by feature/level in separate directories
- Shared utilities in `src/utils/`
- Type definitions co-located with components or in `src/types/`
- Data files separated by level/module

### Database Operations
- Use service layer for all database operations
- Implement progress saving at key game milestones
- Handle offline scenarios gracefully
- Maintain data integrity with proper error handling

### Game State Management
- Save progress frequently to prevent data loss
- Use debounced saves to avoid excessive database calls
- Implement proper loading and saving states
- Handle page refresh scenarios

### Testing Strategy
- Browser console testing for database operations
- Manual component testing for UI validation
- Integration testing through browser-based scripts
- Use test utility files in root directory for complex scenarios

## Module-Specific Notes

### Level 1 (Bingo Game)
- Questions loaded from module-specific data files
- Score calculation based on correct answers and time
- Timer functionality with pause/resume
- Progress saved per module per user

### Level 2 (Drag & Drop)
- Real-time term placement validation
- Multiple game modes (GMP vs Non-GMP, etc.)
- Complex scoring system with combo multipliers
- Service-oriented architecture for flexibility

### Level 3 (Jigsaw Game)
- Scenario-based gameplay with multiple scenarios per module
- Drag-and-drop piece placement with validation
- Health/combo/score system
- Comprehensive progress tracking and history

### Level 4 (Case Studies)
- 2D facility layout with interactive elements
- Case file analysis with structured questions
- Module-specific case data (currently 4 modules supported)
- Supabase integration for progress tracking

### GMP Simulation (Innovation Quest)
- Multi-stage workflow simulation
- File upload capabilities for prototypes
- Real-time collaboration features
- Case selection and progress tracking

## Common Debugging Approaches

### Database Issues
- Use browser console test scripts (`test-level*-console.js`)
- Check authentication status first
- Verify table structure and permissions
- Test RPC functions directly

### Game State Issues
- Check Redux DevTools for state changes
- Verify localStorage for persisted data
- Test with fresh user accounts
- Use component debug modes where available

### Authentication Problems
- Run `test-auth-fix.js` in browser console
- Check session expiry and refresh tokens
- Verify Supabase configuration
- Test with different user accounts

## Performance Considerations

### Optimization Strategies
- Lazy loading for level components
- Image preloading for game assets
- Debounced database operations
- Efficient state updates

### Memory Management
- Clean up timers and intervals
- Remove event listeners on unmount
- Optimize Redux store structure
- Use React.memo for expensive components

## Environment Setup

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Prerequisites
- Node.js 18+
- Supabase project with proper table structure
- Database functions and RLS policies configured

This codebase is well-structured for educational gaming with comprehensive progress tracking, multi-level gameplay, and robust database integration. The modular architecture allows for easy extension and maintenance of individual game levels.
