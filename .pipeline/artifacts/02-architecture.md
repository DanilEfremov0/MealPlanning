# 02 — Technical Architecture
**Project:** MealPlanning
**Tech Lead:** Pipeline Stage 02
**Date:** 2026-04-14

---

## 1. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React 18 + TypeScript | Component model fits UI complexity; type safety reduces bugs |
| Styling | Tailwind CSS | Utility-first, responsive out of the box, no custom CSS overhead |
| State Management | Zustand | Lightweight, minimal boilerplate, works well with Firebase listeners |
| Routing | React Router v6 | Standard SPA routing |
| Backend / DB | Firebase Firestore | Serverless, real-time, free tier fits MVP scale |
| Auth | None (MVP) | Out of scope per Product Brief |
| Hosting | Firebase Hosting | Zero-config static deploy, global CDN edge |
| Analytics | Firebase Analytics (GA4) | Built into Firebase SDK, zero extra integration cost |
| Build Tool | Vite | Fast dev server, optimized production builds |
| Testing | Vitest + React Testing Library | Co-located with Vite ecosystem |
| CI/CD | GitHub Actions | Auto-deploy on push to main |

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                  React SPA (Firebase Hosting)              │
│                                                            │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │ Onboarding │  │  Schedule   │  │   Shopping List    │  │
│  │   Screen   │  │   Screen    │  │      Screen        │  │
│  └─────┬──────┘  └──────┬──────┘  └─────────┬──────────┘  │
│        │                │                   │             │
│  ┌─────▼────────────────▼───────────────────▼──────────┐  │
│  │                  Zustand Store                       │  │
│  │   userSettings | weekSchedule | shoppingList        │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                  │
│  ┌─────────────────────▼────────────────────────────────┐  │
│  │             Firebase Service Layer                    │  │
│  │   firestoreService.ts  |  analyticsService.ts        │  │
│  └─────────────────────┬────────────────────────────────┘  │
└────────────────────────┼───────────────────────────────────┘
                         │ Firebase SDK
         ┌───────────────▼──────────────────┐
         │          Firebase Cloud           │
         │  ┌────────────────────────────┐   │
         │  │         Firestore          │   │
         │  │  /recipes     (read-only)  │   │
         │  │  /userSettings (rw)        │   │
         │  └────────────────────────────┘   │
         │  ┌────────────────────────────┐   │
         │  │    Firebase Analytics      │   │
         │  │    (GA4 custom events)     │   │
         │  └────────────────────────────┘   │
         └──────────────────────────────────┘
```

---

## 3. Data Model

### Collection: `recipes`
Seed data — 30 recipes, read-only for users.

```
recipes/{recipeId}
  id:           string
  name:         string                    // "Овсянка с бананом"
  description:  string
  imageUrl:     string                    // external URL or data URI
  tags:         string[]                  // ["breakfast", "vegetarian"]
  allergens:    string[]                  // ["gluten", "dairy", "nuts", ...]
  ingredients:  Ingredient[]
    └── { name: string, amount: string, unit: string }
  steps:        string[]
  prepTime:     number                    // minutes
  cookTime:     number                    // minutes
  servings:     number
  calories:     number
```

### Collection: `userSettings`
One document per anonymous session (keyed by localStorage UUID).

```
userSettings/{sessionId}
  sessionId:    string                    // UUID generated client-side
  allergens:    string[]                  // ["gluten", "nuts"]
  onboarded:    boolean
  createdAt:    Timestamp
  updatedAt:    Timestamp
```

### Local State Only (not persisted to Firestore)

```
weekSchedule: {
  [day: string]: {                        // "monday" .. "sunday"
    breakfast: Recipe | null
    lunch:     Recipe | null
    dinner:    Recipe | null
  }
}

shoppingList: ShoppingItem[]
  └── { name: string, amount: string, unit: string, checked: boolean, recipeIds: string[] }
```

> **Decision:** weekSchedule and shoppingList are NOT persisted to Firestore in MVP.
> Rationale: No auth, no user identity → no value storing per-session schedule server-side.
> Persisted in localStorage as JSON for page refresh survival.

---

## 4. Component Tree

```
App
├── Router
│   ├── /onboarding          → OnboardingPage
│   │   ├── AllergenPicker
│   │   └── OnboardingCTA
│   ├── /schedule            → SchedulePage (default route)
│   │   ├── WeekGrid
│   │   │   └── DayColumn × 7
│   │   │       └── MealSlot × 3 (breakfast/lunch/dinner)
│   │   │           └── RecipeCard (or EmptySlot)
│   │   ├── GenerateButton
│   │   └── SwapModal
│   │       └── RecipeList (filtered, swappable alternatives)
│   └── /shopping            → ShoppingPage
│       ├── ShoppingListHeader (share button)
│       └── ShoppingItem × N
│           └── Checkbox + ingredient info
├── Layout
│   └── BottomNav (mobile) / TopNav (desktop)
└── Providers
    └── FirebaseProvider → ZustandProvider
```

---

## 5. API Design (Firebase SDK calls — no REST server)

All data access goes through `src/services/firestoreService.ts`.

### `getRecipes(filters?: RecipeFilter): Promise<Recipe[]>`
```ts
interface RecipeFilter {
  excludeAllergens?: string[]   // filter out recipes containing these
  tags?: string[]               // optional cuisine/meal-type filter
}
```
- Reads from `recipes` collection
- Filters allergens client-side (Firestore doesn't support "not contains array")
- Returns up to 100 docs; seed data = 30, well within limit

### `getUserSettings(sessionId: string): Promise<UserSettings | null>`
- Read from `userSettings/{sessionId}`
- Returns null if first visit

### `saveUserSettings(sessionId: string, settings: Partial<UserSettings>): Promise<void>`
- Upsert `userSettings/{sessionId}` with `{ merge: true }`

### `generateWeekSchedule(recipes: Recipe[], allergens: string[]): WeekSchedule`
- Pure function — no Firebase call
- Algorithm: shuffle allergen-safe recipes, assign 3/day × 7 days
- Ensures no recipe repeats within same day; allows cross-day repeats

### `generateShoppingList(schedule: WeekSchedule): ShoppingItem[]`
- Pure function — no Firebase call
- Aggregates ingredients across all scheduled recipes
- Merges identical ingredients by unit (e.g., "200g flour" + "100g flour" = "300g flour")

---

## 6. Analytics Implementation

All events fired through `src/services/analyticsService.ts` wrapping `logEvent()` from Firebase Analytics.

| Event | Trigger | Parameters |
|-------|---------|-----------|
| `onboarding_started` | OnboardingPage mounts | — |
| `onboarding_allergens_set` | User selects allergens | `{ allergen_count: number }` |
| `onboarding_completed` | CTA clicked | `{ allergens: string[] }` |
| `schedule_generated` | GenerateButton clicked | `{ recipe_count: number }` |
| `recipe_swapped` | Swap confirmed in SwapModal | `{ day, meal, from_recipe_id, to_recipe_id }` |
| `shopping_list_viewed` | ShoppingPage mounts | `{ item_count: number }` |
| `shopping_item_checked` | Checkbox toggled | `{ checked: boolean }` |
| `shopping_list_shared` | Share button tapped | `{ method: 'clipboard' | 'native' }` |

---

## 7. Frontend Route Flow

```
First visit          Returning visit
    │                     │
    ▼                     ▼
/onboarding         /schedule
    │                     │
    ▼                     │
/schedule  ◄─────────────┘
    │
    ▼ (tap shopping icon)
/shopping
```

Session detection: check `localStorage.sessionId` + Firestore `onboarded: true`.

---

## 8. Responsive Strategy

| Breakpoint | Layout |
|-----------|--------|
| < 768px (mobile) | Single-column, bottom nav, horizontal scroll for WeekGrid days |
| 768–1279px (tablet) | 2-column, side nav option |
| ≥ 1280px (desktop) | Full 7-day grid visible, sidebar nav |

Tailwind breakpoints: `sm:` (640) / `md:` (768) / `lg:` (1024) / `xl:` (1280)

---

## 9. Infrastructure & Deployment

```
Developer push → GitHub (main branch)
    │
    ▼
GitHub Actions CI
    ├── npm ci
    ├── npx tsc --noEmit
    ├── npx vitest run
    └── npm run build
         │
         ▼ (if all pass)
    firebase deploy --only hosting
         │
         ▼
Firebase Hosting (CDN)
    URL: mealplanning-<id>.web.app
```

**Firebase project setup required (one-time):**
- Create Firebase project
- Enable Firestore (production mode → security rules: recipes=read, userSettings=rw)
- Enable Analytics
- Set environment variables in `.env.local`

---

## 10. Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      allow read: if true;      // public read
      allow write: if false;    // no client writes
    }
    match /userSettings/{sessionId} {
      allow read, write: if true;  // MVP: open; post-MVP add auth check
    }
  }
}
```

---

## 11. Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Stored in `.env.local` (gitignored). CI uses GitHub Secrets.
