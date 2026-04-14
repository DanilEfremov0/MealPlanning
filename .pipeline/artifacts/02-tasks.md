# 02 — Task Breakdown
**Project:** MealPlanning
**Tech Lead:** Pipeline Stage 02
**Date:** 2026-04-14

---

## Implementation Order

1. **Sprint 0 — Setup** (BE-01, FE-01): Firebase project + React scaffold
2. **Sprint 1 — Data layer** (BE-02, BE-03): Seed recipes, Firestore service
3. **Sprint 2 — Core screens** (FE-02, FE-03, FE-04): Onboarding + Schedule + Shopping (parallel with Sprint 1)
4. **Sprint 3 — Logic** (FE-05, FE-06): Schedule generation + Shopping list generation
5. **Sprint 4 — Swap feature** (FE-07): SwapModal + recipe filtering
6. **Sprint 5 — Analytics** (FE-08): Fire all analytics events
7. **Sprint 6 — Polish** (FE-09): Responsive, accessibility, performance

---

## Backend Tasks

---

## Task BE-01: Firebase Project Setup
**Type:** Backend
**Estimate:** S (1d)
**Priority:** P0
**Dependencies:** none

### Description
Create and configure the Firebase project. Initialize Firestore, Analytics, and Hosting. Write Firestore security rules. Set up environment variable templates.

### Acceptance Criteria
- [ ] Firebase project created and linked to `DanilEfremov0/MealPlanning` repo
- [ ] Firestore database created (production mode)
- [ ] Security rules deployed: recipes=read-only, userSettings=rw
- [ ] Firebase Hosting configured
- [ ] Firebase Analytics enabled
- [ ] `.env.local.example` file committed with all required VITE_ keys (values empty)
- [ ] `.env.local` added to `.gitignore`
- [ ] `firebase.json` + `.firebaserc` committed

### Technical Notes
Use Firebase CLI: `firebase init`. Select Firestore, Hosting, Analytics. For hosting: `dist` as public dir, configure as SPA (`rewrites all to /index.html`).

---

## Task BE-02: Seed Recipe Data
**Type:** Backend
**Estimate:** M (3d)
**Priority:** P0
**Dependencies:** BE-01

### Description
Create 30 seed recipes covering breakfast, lunch, dinner across Russian/European cuisine. Each recipe must have full ingredient list, allergen tags, prep time, calories. Write a seed script to upload to Firestore.

### Acceptance Criteria
- [ ] 30 recipes created: at minimum 10 breakfast, 10 lunch, 10 dinner
- [ ] Every recipe has: name, description, ingredients[], allergens[], tags[], prepTime, cookTime, servings, calories
- [ ] Allergen coverage across seed data: gluten, dairy, nuts, eggs, soy, seafood — at least 5 recipes safe for each common allergen
- [ ] At least 10 recipes are allergen-free (safe for all)
- [ ] Seed script in `scripts/seed-recipes.ts` committed
- [ ] Recipes uploaded to Firestore `/recipes` collection
- [ ] README section added: "How to re-seed"

### Technical Notes
Use `tsx scripts/seed-recipes.ts` with Admin SDK. Data in `scripts/recipes-data.ts` as typed array. Cover common Russian staples: гречка, борщ, овсянка, куриный суп, etc. Keep imageUrl as placeholder `null` for MVP (design will decide if images shown).

---

## Task BE-03: Firestore Service Layer
**Type:** Backend
**Estimate:** S (1d)
**Priority:** P0
**Dependencies:** BE-01

### Description
Implement `src/services/firestoreService.ts` with typed functions for all Firestore reads/writes. Implement `src/services/analyticsService.ts` for all GA4 event logging.

### Acceptance Criteria
- [ ] `getRecipes(filters?)` fetches all recipes, applies allergen filter client-side
- [ ] `getUserSettings(sessionId)` reads userSettings doc or returns null
- [ ] `saveUserSettings(sessionId, settings)` upserts with merge
- [ ] `generateSessionId()` creates and persists UUID to localStorage
- [ ] All functions are typed (no `any`)
- [ ] All Firebase errors are caught and re-thrown as typed AppError
- [ ] `analyticsService.ts` exports one function per event (8 total)
- [ ] Unit tests for pure logic functions (generateSchedule, generateShoppingList)

### Technical Notes
`getRecipes` returns `Promise<Recipe[]>`. Allergen filtering: `recipes.filter(r => !r.allergens.some(a => userAllergens.includes(a)))`. Session ID: `localStorage.getItem('mealplanning_session_id') || uuid()`.

---

## Frontend Tasks

---

## Task FE-01: React + Vite Project Scaffold
**Type:** Frontend
**Estimate:** S (1d)
**Priority:** P0
**Dependencies:** none

### Description
Initialize React 18 + TypeScript + Vite project. Install and configure Tailwind CSS, React Router v6, Zustand, Firebase SDK. Set up folder structure. Configure GitHub Actions CI for build + test + deploy.

### Acceptance Criteria
- [ ] `npm create vite@latest` with react-ts template
- [ ] Tailwind CSS v3 configured with `tailwind.config.ts`
- [ ] React Router v6 installed, basic routing skeleton in place
- [ ] Zustand installed
- [ ] Firebase SDK v10 installed
- [ ] ESLint + Prettier configured
- [ ] Vitest + React Testing Library installed
- [ ] Folder structure created: `src/components/`, `src/pages/`, `src/services/`, `src/store/`, `src/types/`
- [ ] GitHub Actions workflow: `.github/workflows/deploy.yml` — runs `tsc`, `vitest`, `build`, `firebase deploy`
- [ ] App runs with `npm run dev`, deploys with `npm run build`

### Technical Notes
Folder structure:
```
src/
  components/   # reusable UI components
  pages/        # route-level screens
  services/     # Firebase service layer
  store/        # Zustand store
  types/        # shared TypeScript interfaces
  utils/        # pure helper functions (schedule gen, shopping list gen)
```

---

## Task FE-02: Onboarding Screen
**Type:** Frontend
**Estimate:** M (3d)
**Priority:** P0
**Dependencies:** FE-01, BE-03, Design specs (03-design-specs.md)

### Description
Build the onboarding flow shown to first-time users. User selects their allergens from a visual list, then proceeds to the schedule screen.

### Acceptance Criteria
- [ ] Route `/onboarding` renders OnboardingPage
- [ ] AllergenPicker shows all 8 allergen options with icons: gluten, dairy, eggs, nuts, peanuts, soy, seafood, sesame
- [ ] Each allergen is a toggle chip — tap to select/deselect
- [ ] "None" option deselects all
- [ ] CTA button "Создать план питания" enabled always (allergens optional)
- [ ] On CTA click: saves allergens to Zustand store + Firestore via `saveUserSettings`
- [ ] Fires `onboarding_allergens_set` + `onboarding_completed` analytics events
- [ ] Redirects to `/schedule` after save
- [ ] First-visit detection: if `userSettings.onboarded === true` → skip to `/schedule`
- [ ] Responsive: mobile-first, works at 375px and 1280px

### Technical Notes
Generate session ID on app init in `FirebaseProvider`. `useEffect` on mount: load settings → if onboarded, navigate to schedule. AllergenPicker state: local React state, flushed to Zustand on confirm.

---

## Task FE-03: Schedule Screen (WeekGrid)
**Type:** Frontend
**Estimate:** L (5d)
**Priority:** P0
**Dependencies:** FE-01, FE-05, Design specs

### Description
Main screen. Displays 7-day meal plan grid (breakfast/lunch/dinner per day). Includes "Сгенерировать" button. Empty state before generation. Tapping a recipe card opens the SwapModal.

### Acceptance Criteria
- [ ] Route `/schedule` is the default route (`/` redirects here if onboarded)
- [ ] WeekGrid shows 7 columns (Mon–Sun) × 3 rows (breakfast/lunch/dinner)
- [ ] Each cell shows RecipeCard (name, time, allergen badge) or EmptySlot placeholder
- [ ] "Сгенерировать план" button prominent, triggers schedule generation
- [ ] Loading state while generating (skeleton cards or spinner)
- [ ] Tapping RecipeCard opens SwapModal for that slot
- [ ] Schedule persisted to localStorage on change
- [ ] Mobile: days scroll horizontally, 1-2 days visible; Desktop: all 7 days visible
- [ ] Responds correctly at 375px / 768px / 1280px

### Technical Notes
`WeekGrid` reads from Zustand `weekSchedule`. `GenerateButton` calls util `generateWeekSchedule(recipes, allergens)`. Store recipes in Zustand after first `getRecipes` call (cache). Days: Monday = index 0.

---

## Task FE-04: Shopping List Screen
**Type:** Frontend
**Estimate:** M (3d)
**Priority:** P0
**Dependencies:** FE-01, FE-06, Design specs

### Description
Shopping list aggregated from the current week schedule. Items can be checked off. Share button copies list to clipboard (or uses Web Share API on mobile).

### Acceptance Criteria
- [ ] Route `/shopping` renders ShoppingPage
- [ ] List is empty + CTA to generate schedule if no schedule exists
- [ ] Items grouped by category (produce, dairy, grains, etc.) — stretch goal; flat list acceptable for MVP
- [ ] Each item: checkbox + name + amount + unit
- [ ] Checked items visually struck-through, move to bottom
- [ ] Checked state persisted to localStorage
- [ ] "Поделиться" button: uses `navigator.share` if available, else copies to clipboard
- [ ] Fires `shopping_list_viewed` on mount, `shopping_item_checked` on toggle, `shopping_list_shared` on share
- [ ] Responsive at 375px and 1280px

### Technical Notes
Share format: plain text list "- 300g мука\n- 2 яйца\n...". `navigator.share` falls back to `navigator.clipboard.writeText`. Fires `shopping_list_shared` with `{ method: 'native' | 'clipboard' }`.

---

## Task FE-05: Schedule Generation Logic
**Type:** Frontend
**Estimate:** S (1d)
**Priority:** P0
**Dependencies:** BE-02, BE-03

### Description
Pure utility function `generateWeekSchedule(recipes, allergens)` that assigns recipes to 7 days × 3 meals.

### Acceptance Criteria
- [ ] Function lives in `src/utils/scheduleGenerator.ts`
- [ ] Filters out recipes with user allergens before selection
- [ ] Assigns recipes round: breakfast pool → random shuffle → assign Mon-Sun; same for lunch, dinner
- [ ] No recipe repeated in the same day (e.g., can't have same recipe for breakfast and dinner on Monday)
- [ ] If fewer than 7 safe recipes in a category, allows repetition across days (logs warning)
- [ ] Returns `WeekSchedule` object matching type definition
- [ ] Unit tested with Vitest: 5+ test cases including empty allergen list, all-allergen filter, single recipe pool

### Technical Notes
Algorithm: Fisher-Yates shuffle on each meal pool. Three independent pools: breakfast-tagged, lunch-tagged, dinner-tagged. Fallback: if pool empty for a meal type, use any safe recipe.

---

## Task FE-06: Shopping List Generation Logic
**Type:** Frontend
**Estimate:** S (1d)
**Priority:** P0
**Dependencies:** FE-05

### Description
Pure utility function `generateShoppingList(schedule)` that aggregates all ingredients from scheduled recipes into a deduplicated shopping list.

### Acceptance Criteria
- [ ] Function lives in `src/utils/shoppingListGenerator.ts`
- [ ] Aggregates all ingredients from all recipe slots in the schedule
- [ ] Merges identical ingredients by `(name, unit)` pair — sums amounts
- [ ] Amount parsing: handles "200" (numeric) → sum; "2 pieces" → sum integers; mismatched units kept separate
- [ ] Returns `ShoppingItem[]` sorted alphabetically by name
- [ ] Unit tested: 3+ test cases including merging, empty schedule, unit mismatch

---

## Task FE-07: Swap Modal
**Type:** Frontend
**Estimate:** M (3d)
**Priority:** P0
**Dependencies:** FE-03, Design specs

### Description
Modal overlay for swapping a meal. Shows alternative recipes filtered by same meal type and user allergens. Selecting one updates the schedule.

### Acceptance Criteria
- [ ] SwapModal opens when RecipeCard tapped
- [ ] Header shows: "Заменить [meal name]" + day + meal type
- [ ] Shows list of alternative recipes (excluding current recipe, respecting allergens)
- [ ] Each alternative: name, prep time, calories, allergen badges
- [ ] Tapping alternative: highlights it
- [ ] "Заменить" button confirms swap — updates Zustand store
- [ ] "Отмена" button / backdrop tap closes modal without change
- [ ] Fires `recipe_swapped` analytics event on confirm
- [ ] Accessible: focus trap in modal, Escape closes, aria-modal
- [ ] Responsive: bottom sheet on mobile, centered modal on desktop

### Technical Notes
Filter alternatives: `recipes.filter(r => r.id !== currentRecipeId && r.tags.includes(mealType) && !hasAllergenConflict(r, userAllergens))`. Use Zustand `swapRecipe(day, mealType, newRecipe)` action.

---

## Task FE-08: Analytics Instrumentation
**Type:** Frontend
**Estimate:** S (1d)
**Priority:** P1
**Dependencies:** FE-02, FE-03, FE-04, FE-07, BE-03

### Description
Wire all 8 analytics events from the Product Brief into the correct UI interactions using `analyticsService.ts`.

### Acceptance Criteria
- [ ] `onboarding_started` — fires on OnboardingPage mount
- [ ] `onboarding_allergens_set` — fires when user confirms allergen selection (with count)
- [ ] `onboarding_completed` — fires on CTA click (with allergen array)
- [ ] `schedule_generated` — fires on GenerateButton click (with recipe_count)
- [ ] `recipe_swapped` — fires on swap confirm (with day, meal, from/to recipe IDs)
- [ ] `shopping_list_viewed` — fires on ShoppingPage mount (with item_count)
- [ ] `shopping_item_checked` — fires on checkbox toggle (with checked state)
- [ ] `shopping_list_shared` — fires on share action (with method)
- [ ] All events verified in Firebase Analytics DebugView

---

## Task FE-09: Responsive Polish + Accessibility + Performance
**Type:** Frontend
**Estimate:** M (3d)
**Priority:** P1
**Dependencies:** FE-02, FE-03, FE-04, FE-07

### Description
Final polish pass covering responsive correctness at all breakpoints, WCAG 2.1 AA compliance, and Lighthouse performance score ≥ 90.

### Acceptance Criteria
- [ ] Tested and correct at 375px / 430px / 768px / 1280px / 1440px
- [ ] No horizontal overflow at any breakpoint
- [ ] Color contrast ≥ 4.5:1 for all text (check with axe)
- [ ] All interactive elements keyboard-navigable
- [ ] Focus visible on all focusable elements
- [ ] Touch targets ≥ 44×44px
- [ ] Alt text on all meaningful images
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] All console errors resolved

---

## Design Tasks (for Product Designer Stage)

---

## Task D-01: Onboarding Flow — Figma
**Type:** Design
**Priority:** P0
**Screens:** Allergen selection, welcome message, CTA

### Design Constraints
- Mobile-first (375px primary)
- Allergen chips: icon + label, toggle state (selected/unselected)
- Keep to 1 screen — no multi-step wizard for MVP

---

## Task D-02: Schedule Screen — Figma
**Type:** Design
**Priority:** P0
**Screens:** Empty state, populated state, loading state

### Design Constraints
- WeekGrid: horizontal scroll on mobile, full 7-col on desktop
- RecipeCard: compact (name + time + allergen count)
- GenerateButton: prominent, primary color

---

## Task D-03: SwapModal — Figma
**Type:** Design
**Priority:** P0
**Screens:** Modal open, alternative selected, loading

### Design Constraints
- Bottom sheet on mobile, centered modal on desktop
- Alternative recipe row: name + time + calories + allergen badges

---

## Task D-04: Shopping List Screen — Figma
**Type:** Design
**Priority:** P0
**Screens:** Populated list, empty state, item checked state

### Design Constraints
- Clear checkbox tap targets (≥ 44px)
- Share button: prominent in header
- Checked items: strikethrough, reduced opacity

