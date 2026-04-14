# TASK-01: MealPlanning MVP — Frontend Implementation
**Type:** Frontend
**Priority:** P0
**Estimate:** 7 days
**Design Review:** `.agent/design-system/reviews/2026-04-14-mealplanning-mvp-v2.md`
**Figma:** https://www.figma.com/file/jeRgiftgUgJV0YV5Yx73Id
**Date:** 2026-04-14

---

## Overview

Implement the MealPlanning React app based on v2 Figma designs.
Stack: React 18 + TypeScript + Tailwind CSS + Zustand + Firebase.

---

## Phase 1: Design Tokens (0.5d)

### Files to create/modify
- `tailwind.config.ts` — extend theme with all design tokens
- `src/styles/globals.css` — CSS custom properties
- `src/types/index.ts` — shared TypeScript interfaces

### Tailwind theme extension
```ts
theme: {
  extend: {
    colors: {
      green:  { DEFAULT: '#3ECF8E', dark: '#1a9e6a', dim: '#d1fae5' },
      ink:    { DEFAULT: '#0f172a', 2: '#334155', 3: '#64748b', 4: '#94a3b8' },
      surface: '#f8fafc',
      card:   '#ffffff',
      border: '#e2e8f0',
      amber:  { DEFAULT: '#F59E0B', light: '#FEF3C7' },
      blue:   { DEFAULT: '#3B82F6', light: '#DBEAFE' },
      violet: { DEFAULT: '#8B5CF6', light: '#EDE9FE' },
    },
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    borderRadius: {
      sm: '10px', md: '14px', lg: '18px', xl: '24px', '2xl': '32px',
    },
    boxShadow: {
      xs:   '0 1px 3px rgba(15,23,42,.06)',
      cta:  '0 8px 20px -4px rgba(62,207,142,.45)',
      sheet:'0 -8px 40px rgba(15,23,42,.25)',
    },
  }
}
```

### Acceptance Criteria
- [ ] `npm run build` passes with no TypeScript errors
- [ ] All color tokens available as Tailwind classes (e.g., `bg-green`, `text-ink-3`)
- [ ] Inter font loaded via `@fontsource/inter`
- [ ] `Recipe`, `WeekSchedule`, `ShoppingItem`, `UserSettings` types defined

---

## Phase 2: Atoms (1d)

### Components to build

#### `AllergenChip` — `src/components/atoms/AllergenChip.tsx`
```tsx
interface AllergenChipProps {
  emoji: string;
  label: string;
  selected: boolean;
  onToggle: () => void;
}
```
- Height: 44px, pill shape (border-radius: 22px)
- Unselected: `bg-surface border border-border`
- Selected: `bg-green-dim border-[1.5px] border-green shadow-[0_0_0_3px_rgba(62,207,142,.18)]`
- Touch target: min 44×44px
- Animation: `transition-all duration-150`

#### `RecipeAccentStrip` — inline div, 3px height
- breakfast: `bg-gradient-to-r from-amber to-amber/70`
- lunch:     `bg-gradient-to-r from-blue to-blue/70`
- dinner:    `bg-gradient-to-r from-violet to-violet/70`

#### `EmojiBubble` — `src/components/atoms/EmojiBubble.tsx`
```tsx
interface EmojiBubbleProps {
  emoji: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  size?: 'sm' | 'md';
}
```
- 36×36px (sm), 32×32px (desktop)
- bg: `amber-light` / `blue-light` / `violet-light` per meal type

#### `Checkbox` — `src/components/atoms/Checkbox.tsx`
- 24×24px, `rounded-[7px]`
- Unchecked: `bg-card border-2 border-border`
- Checked: `bg-green border-green` + white ✓
- Animation: scale 0.85→1 on check (`transition-transform duration-150`)

#### `DayPill` — `src/components/atoms/DayPill.tsx`
- Weekday: `bg-ink text-white`
- Weekend: `bg-green-dark text-white`
- Height: 34–36px, `rounded-[9px]`

#### `NavTab` — `src/components/atoms/NavTab.tsx`
- Icon (22px emoji) + label (11px)
- Active: `text-green-dark font-semibold` + 4px dot below
- Inactive: `text-ink-4 font-medium`

#### `BadgePill` — `src/components/atoms/BadgePill.tsx`
- `bg-green-dim border border-green/40 rounded-full`
- 11px Semi Bold, `text-green-dark`

### Acceptance Criteria
- [ ] All 7 atom components render without errors
- [ ] AllergenChip toggles on click with visual feedback
- [ ] Checkbox checks/unchecks with animation
- [ ] All components meet 44×44px touch target
- [ ] Keyboard accessible (space/enter trigger toggles)
- [ ] Unit tests: AllergenChip (selected/unselected), Checkbox (checked/unchecked)

---

## Phase 3: Molecules (1.5d)

### Components to build

#### `RecipeCard` — `src/components/molecules/RecipeCard.tsx`
```tsx
interface RecipeCardProps {
  recipe: Recipe;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  onSwap: () => void;
  width?: number; // px, default full
}
```
- Structure: AccentStrip + EmojiBubble + name (12–14px Semi Bold) + meta (10px) + divider + SwapLink
- Shadow: `shadow-xs hover:shadow-md`
- `hover:-translate-y-px transition-all duration-150`
- Swap link: `text-green-dark font-semibold text-[10px]`

#### `AlternativeRow` — `src/components/molecules/AlternativeRow.tsx`
```tsx
interface AlternativeRowProps {
  recipe: Recipe;
  selected: boolean;
  onSelect: () => void;
}
```
- Height: 64px, `rounded-2xl`
- Unselected: `bg-surface border border-border`
- Selected: `bg-green-dim border-[1.5px] border-green shadow-[0_0_0_3px_rgba(62,207,142,.15)]`
- Emoji bubble (40×40px) + name + meta + checkmark (selected only)

#### `ShoppingItem` — `src/components/molecules/ShoppingItem.tsx`
- Checkbox + name (15px Medium/Regular) + amount (14px Semi Bold, right)
- Checked: strikethrough + `text-ink-4`
- Divider bottom (inset, from checkbox edge)

#### `BottomNav` — `src/components/molecules/BottomNav.tsx`
- Fixed bottom, `bg-card/92 backdrop-blur-lg border-t border-border`
- Height: 80px, 2 NavTab items
- `safe-area-inset-bottom` padding for notch

#### `RegenButton` — `src/components/molecules/RegenButton.tsx`
- `border-[1.5px] border-dashed border-green/40 bg-green-dim rounded-3xl`
- Height: 44px, `text-green-dark font-semibold text-sm`

### Acceptance Criteria
- [ ] RecipeCard shows correct accent color per meal type
- [ ] RecipeCard hover effect works on desktop
- [ ] AlternativeRow selects on click, shows checkmark
- [ ] BottomNav highlights correct active tab
- [ ] ShoppingItem strikethrough works when checked
- [ ] Unit tests: RecipeCard (all 3 meal types), ShoppingItem (checked/unchecked)

---

## Phase 4: Organisms (2d)

### Components to build

#### `OnboardingHero` — `src/components/organisms/OnboardingHero.tsx`
- Dark gradient bg: `bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0d4a2e]`
- Radial glow overlay (pseudo-element or absolute div, `bg-green/8 blur-3xl`)
- BadgePill + hero text (ExtraBold 30px) + subtitle + preview chips
- Height: ~320px

#### `AllergenPicker` — `src/components/organisms/AllergenPicker.tsx`
```tsx
const ALLERGENS = [
  { id: 'gluten', emoji: '🌾', label: 'Глютен' },
  { id: 'dairy', emoji: '🥛', label: 'Молоко' },
  { id: 'eggs', emoji: '🥚', label: 'Яйца' },
  { id: 'nuts', emoji: '🥜', label: 'Орехи' },
  { id: 'peanuts', emoji: '🫘', label: 'Арахис' },
  { id: 'soy', emoji: '🌱', label: 'Соя' },
  { id: 'seafood', emoji: '🦐', label: 'Морепродукты' },
  { id: 'none', emoji: '✓', label: 'Нет аллергий' },
];
```
- Wrapping flex grid, gap-2
- "none" deselects all others
- Selecting any allergen deselects "none"

#### `WeekGrid` — `src/components/organisms/WeekGrid.tsx`
- Mobile: `overflow-x-auto` horizontal scroll, snap points, 152px columns
- Desktop (≥1280px): CSS Grid 7 columns, full width
- Renders DayColumn per day (Mon–Sun)
- DayColumn: DayPill + 3 meal sections (MealTag + RecipeCard)

#### `BottomSheet` — `src/components/organisms/BottomSheet.tsx`
```tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}
```
- Backdrop: `fixed inset-0 bg-ink/55 backdrop-blur-sm`
- Sheet: `fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl`
- Slide animation: `translate-y-full → translate-y-0`, 250ms `cubic-bezier(0.16, 1, 0.3, 1)`
- Focus trap (react-focus-lock or manual)
- Close on Escape + backdrop click
- aria-modal, aria-labelledby

#### `ShoppingCategories` — `src/components/organisms/ShoppingCategories.tsx`
- Category header: emoji + uppercase label + horizontal rule
- ShoppingItem list per category
- Progress bar: track + animated fill (green gradient)

### Acceptance Criteria
- [ ] OnboardingHero renders dark gradient with glow effect
- [ ] AllergenPicker: selecting "Нет аллергий" deselects all others
- [ ] WeekGrid horizontal scroll works on mobile, full grid on desktop ≥1280px
- [ ] BottomSheet slides in/out with animation
- [ ] BottomSheet: focus trapped, Escape closes, backdrop click closes
- [ ] BottomSheet: aria-modal and aria-labelledby set correctly
- [ ] Shopping progress bar width reflects actual checked count

---

## Phase 5: Pages + Integration (2d)

### Pages

#### `OnboardingPage` — `src/pages/OnboardingPage.tsx`
- OnboardingHero + AllergenPicker + PrimaryButton + SkipLink
- On CTA: save allergens → Firestore via `saveUserSettings` → navigate to /schedule
- Fire: `onboarding_started` on mount, `onboarding_allergens_set` on select, `onboarding_completed` on CTA

#### `SchedulePage` — `src/pages/SchedulePage.tsx`
- Header (title + date + AllergenPill) + scroll hint
- Empty state: show generate button
- Loaded state: WeekGrid + RegenButton
- Skeleton: 3 columns × 3 rows of skeleton cards (pulsing gray)
- Click RecipeCard → open BottomSheet (SwapModal content)
- Fire: `schedule_generated` on generate

#### `SwapModalContent` — inside SchedulePage
- List of AlternativeRows (filtered by meal type + allergens)
- PrimaryButton confirms swap
- On confirm: `recipe_swapped` analytics event

#### `ShoppingPage` — `src/pages/ShoppingPage.tsx`
- ShoppingCategories (from current weekSchedule)
- Empty state if no schedule
- Share button → Web Share API with clipboard fallback
- Fire: `shopping_list_viewed` on mount, `shopping_item_checked` on toggle, `shopping_list_shared` on share

### Zustand Store
```ts
interface AppStore {
  userSettings: UserSettings | null;
  recipes: Recipe[];
  weekSchedule: WeekSchedule | null;
  shoppingList: ShoppingItem[];
  setUserSettings: (s: UserSettings) => void;
  setRecipes: (r: Recipe[]) => void;
  generateSchedule: () => void;
  swapRecipe: (day: string, mealType: MealType, newRecipe: Recipe) => void;
  toggleShoppingItem: (index: number) => void;
  generateShoppingList: () => void;
}
```

### Acceptance Criteria
- [ ] Onboarding → Schedule navigation works
- [ ] Already-onboarded users skip to /schedule
- [ ] Schedule generates without errors for allergen-filtered recipe pool
- [ ] Swap modal opens for any recipe card, swap confirmed updates grid
- [ ] Shopping list reflects current schedule (not stale)
- [ ] Share button works on mobile (native sheet) and desktop (clipboard)
- [ ] All 8 analytics events fire in correct moments (verify in Firebase DebugView)
- [ ] localStorage persists schedule + shopping checked state across page refresh
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Lighthouse Accessibility ≥ 95

---

## Testing Strategy

### Unit Tests (Vitest + RTL)
- AllergenChip: toggle behavior
- AllergenPicker: none-deselects-all logic
- Checkbox: checked/unchecked state
- RecipeCard: renders correctly for all 3 meal types
- ShoppingItem: strikethrough on checked
- scheduleGenerator.ts: allergen filtering, no same-day repeats
- shoppingListGenerator.ts: merging, unit mismatch handling

### Integration Tests
- Onboarding flow end-to-end (mock Firestore)
- Schedule generation + swap
- Shopping list generation from schedule

### Manual QA Checklist
- [ ] Tested at 375px, 430px, 768px, 1280px, 1440px
- [ ] No horizontal overflow
- [ ] Color contrast checked with axe
- [ ] Keyboard navigation through all interactive elements
- [ ] SwapModal focus trap works
- [ ] Reduced motion: animations disabled when prefers-reduced-motion active

---

## Rollout

1. Feature branch: `feature/mvp-implementation`
2. PR with screenshots per screen
3. Deploy to Firebase Hosting preview channel
4. QA Code + QA Design (pipeline stages 06+07)
5. Final Review (pipeline stage 08)
6. Merge to main → auto-deploy
