# MealPlanning

MealPlanning is a React web application for planning meals for the week, maintaining a recipe library, tracking ingredient exclusions for allergy-aware users, and automatically generating a combined shopping list.

## Current MVP

The project already includes a working frontend MVP with:
- onboarding for product and allergen exclusions
- recipe catalog with create, edit, and delete flows
- weekly meal planner by day and meal slot
- aggregated shopping list built from planned recipes
- future-ready account page placeholder
- responsive UI with local-first persistence

## Product Scope

This MVP is designed for a single user and focuses on the core weekly planning flow:
1. save ingredient exclusions during onboarding
2. build a recipe base
3. assign recipes to the week
4. generate one shopping list from the planned meals

Authentication is intentionally deferred to a later iteration.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Zustand
- React Hook Form
- Zod
- Lucide React

## Main Features

### 1. Onboarding and exclusions
Users can define excluded products or allergens before entering the app. These exclusions are used to flag recipe conflicts and shopping list risks.

### 2. Recipe library
Recipes can be created directly in the interface with structured fields inspired by recipe sites like eda.ru:
- title
- description
- image URL
- cooking time
- servings
- cuisine
- meal type
- ingredients
- steps

Recipes can also be edited and deleted.

### 3. Weekly planner
The planner is split by:
- days of the week
- meal slots: breakfast, lunch, dinner

Recipes can be assigned to each slot. The planner also surfaces conflicts when a selected recipe contains excluded ingredients.

### 4. Shopping list
The shopping list is generated automatically from all recipes used in the weekly plan.

Current behavior:
- merges repeated ingredients when name and unit match
- allows checking items off
- supports reset of shopping progress
- marks items that match saved exclusions

### 5. Account area
The account page is currently a product placeholder for the future personal cabinet. It already displays:
- saved exclusions
- current recipe count
- current planned meal count
- roadmap-style future account features

## Project Structure

```txt
MealPlanning/
├── docs/
│   ├── PRD.md
│   ├── TECH_PLAN.md
│   ├── TASKS.md
│   └── UX_FLOW.md
├── public/
├── src/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── pages/
│   ├── store/
│   └── types/
├── package.json
└── README.md
```

## Product and Delivery Docs

The repository contains the initial product pipeline artifacts:
- `docs/PRD.md` - product requirements
- `docs/UX_FLOW.md` - UX and interaction flow
- `docs/TECH_PLAN.md` - technical approach
- `docs/TASKS.md` - implementation responsibilities

## Run Locally

Install dependencies:

```bash
npm install --include=dev
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Current Status

The app currently builds successfully and is already usable as an MVP prototype.

Implemented and verified:
- app shell and routing
- onboarding flow
- recipe CRUD
- weekly planner
- shopping list aggregation
- local persistence
- production build success

## Known Limitations

Current MVP limitations:
- no authentication yet
- no backend or server persistence yet
- ingredient normalization is still basic
- no advanced recipe search or filters yet
- no drag and drop planner interactions yet

## Suggested Next Iterations

Recommended next steps:
- improve recipe filtering and search
- improve ingredient normalization and grouping
- polish planner ergonomics
- add backend persistence
- add authentication and real personal account sync
- expand the account area into a real user cabinet

## Branch / Delivery Notes

This repository now contains the generated MVP implementation and the supporting product/design/tech documentation for further team iterations.
