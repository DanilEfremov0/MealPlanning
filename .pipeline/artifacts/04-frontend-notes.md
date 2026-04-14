# Stage 04 — Frontend Notes

## Status: ✅ Complete

## Tech Stack
- React 19 + TypeScript (via esbuild/Vite 8 transpilation)
- Tailwind CSS v4 (@tailwindcss/vite plugin)
- Zustand v5 with persist middleware (localStorage)
- Firebase SDK v12 (Firestore + Analytics)
- Vite 8 + Rolldown bundler

## Project Structure
```
src/
  components/
    atoms/          AllergenChip, RecipeCard, DayPill
    molecules/      AlternativeRow, ShoppingItemRow, BottomNav
    organisms/      SwapBottomSheet, WeekGrid, ShoppingList
  lib/              firebase.ts, firestore.ts, analytics.ts, scheduleGenerator.ts
  pages/            OnboardingPage, SchedulePage, ShoppingPage
  store/            useStore.ts (Zustand + persist)
  types/            index.ts
  App.tsx           Root router (tab-based navigation)
  main.tsx
```

## Key Implementation Decisions
- **No react-router**: tab-based navigation via Zustand state (no URL routing needed)
- **No auth**: schedule persisted to localStorage only (sessionId UUID)
- **Allergen filter**: client-side — filter recipes before schedule generation
- **Shopping list**: regenerated on every swap to stay in sync
- **Analytics**: fire-and-forget via firebase/analytics logEvent wrappers

## Design Tokens (Tailwind v4 @theme)
Defined in src/index.css:
- green-primary: #3ECF8E  (icons + decorative only, 3.5:1)
- green-dark: #1a9e6a     (text + interactive, 4.7:1 AA)
- orange-primary: #FB923C (lunch accent)
- purple-primary: #A78BFA (dinner accent)
- hero-dark: #0f1923      (onboarding background)

## Build
```bash
NODE_ENV=development npm install
node node_modules/vite/bin/vite.js build
# Output: dist/ (473 kB JS gzip 148 kB, 28 kB CSS gzip 5 kB)
```

## Known Issue
NODE_ENV was set to 'production' in the shell environment, which caused npm to skip
devDependencies. Always run `NODE_ENV=development npm install` to get full deps.

## Analytics Events Instrumented
| Event | Trigger |
|-------|---------|
| onboarding_start | App mount |
| allergen_toggled | AllergenChip click |
| schedule_generated | "Составить меню" button |
| meal_swap_opened | RecipeCard click |
| meal_swapped | Swap confirmation |
| shopping_list_opened | Shopping tab click |
| shopping_item_toggled | Checkbox click |
| schedule_regenerated | Regenerate button |
