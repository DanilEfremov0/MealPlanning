# Technical Plan

## Stack
- React
- TypeScript
- Vite
- React Router
- Zustand for app state
- React Hook Form for forms
- Zod for validation
- Tailwind CSS for styling
- shadcn/ui style component approach or lightweight custom UI primitives
- localStorage for persistence

## App Structure
- `src/pages` for route-level screens
- `src/components` for reusable UI
- `src/features` for domain logic
- `src/store` for persisted state
- `src/lib` for helpers
- `src/types` for shared types

## Domain Modules
- onboarding preferences
- recipe catalog
- weekly planner
- shopping list aggregation
- account placeholder

## Data Model
- Preferences: excluded ingredients array
- Recipe: metadata, ingredients, steps, tags
- Weekly plan: day -> meal slot -> recipe id
- Shopping item: normalized ingredient, unit, quantity, source recipes, checked state

## Implementation Sequence
1. scaffold app shell and routing
2. add theme and design system primitives
3. implement persisted store and seed data
4. build onboarding and preferences flow
5. build recipe CRUD UI
6. build weekly planner UI
7. build shopping list aggregation
8. add account placeholder and polish
9. run build and QA pass

## Technical Constraints
- keep persistence simple with localStorage
- avoid backend for MVP
- make later auth migration possible by isolating persistence behind store actions
