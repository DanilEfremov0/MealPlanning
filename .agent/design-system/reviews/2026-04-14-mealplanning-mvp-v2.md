# Design Review: MealPlanning MVP v2
**Date:** 2026-04-14
**Figma:** https://www.figma.com/file/jeRgiftgUgJV0YV5Yx73Id
**Reviewer:** Product Design Skill (pipeline stage 03 iteration 2)

---

## Summary

Second design iteration after Product Lead review flagged v1 as structurally weak.
v2 introduces a dark hero onboarding, color-coded meal cards, proper bottom sheet
modal, categorized shopping list with progress bar, and consistent Inter type scale.

**Iteration delta vs v1:**
- Onboarding: flat emoji+green → dark gradient hero with badge, preview chips, real CTA shadow
- Schedule cards: flat boxes → accent strip + emoji bubble + shadow + swap link
- Swap modal: flat overlay → proper bottom sheet with drag handle, dimmed backdrop
- Shopping list: flat items → categorized groups + progress bar + share button
- Desktop: basic grid → color-coded columns, proper nav, footer CTA

---

## New Design Tokens (extracted from Figma metadata)

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| color-green | #3ECF8E | Primary CTA, active states, accent strips |
| color-green-dark | #1a9e6a | Hover, active text, allergen pill text |
| color-green-dim | #d1fae5 | Selected chip bg, allergen pill bg, regen btn |
| color-amber | #F59E0B | Breakfast accent strip |
| color-amber-light | #FEF3C7 | Breakfast emoji bubble bg |
| color-blue | #3B82F6 | Lunch accent strip |
| color-blue-light | #DBEAFE | Lunch emoji bubble bg |
| color-violet | #8B5CF6 | Dinner accent strip |
| color-violet-light | #EDE9FE | Dinner emoji bubble bg |
| color-ink | #0f172a | Primary text, nav bg, buttons |
| color-ink-2 | #334155 | Secondary text |
| color-ink-3 | #64748b | Placeholder, metadata, captions |
| color-ink-4 | #94a3b8 | Disabled, nav inactive, helper text |
| color-surface | #f8fafc | Page background |
| color-card | #ffffff | Card background, nav background |
| color-border | #e2e8f0 | Borders, dividers, unchecked checkbox |

### Typography
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| text-hero | 30px | 800 ExtraBold | Hero headline |
| text-h2 | 22px | 700 Bold | Screen titles |
| text-h3 | 18px | 600 SemiBold | Section headers |
| text-body | 15px | 400/500 | Body, item names |
| text-label | 13px | 500/600 | Chip labels, nav labels, CTAs |
| text-caption | 12px | 400 | Metadata (time, calories) |
| text-micro | 10–11px | 600/700 | Meal tags, category tags |

### Spacing
| Token | Value |
|-------|-------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 8–10px | Recipe cards, checkboxes, day pills |
| radius-md | 12–14px | Alternative rows, allergen pills |
| radius-lg | 16–18px | Secondary buttons, share button |
| radius-xl | 22–24px | Bottom sheet corners, primary CTA |
| radius-full | 9999px | Allergen chips (pill shape) |

### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| shadow-xs | 0 1px 3px rgba(15,23,42,.06) | Recipe cards (resting) |
| shadow-sm | 0 4px 6px -1px rgba(15,23,42,.07) | Share button, nav button |
| shadow-md | 0 10px 15px -3px rgba(15,23,42,.08) | Recipe cards (hover) |
| shadow-cta | 0 8px 20px -4px rgba(62,207,142,.45) | Primary CTA button |
| shadow-sheet | 0 -8px 40px rgba(15,23,42,.25) | Bottom sheet |

---

## Components Inventory (from Figma node analysis)

### Atoms (18 total)
| Component | Figma Node | Variants | Notes |
|-----------|-----------|---------|-------|
| StatusBar | text nodes in each screen | — | Static placeholder |
| AllergenChip | 18:19–18:40 | selected / unselected | 44px height, pill shape |
| MealTag | text nodes ЗАВТРАК/ОБЕД/УЖИН | — | 9px, uppercase, ink-4 |
| DayPill | 19:10, 19:40 | weekday / weekend | weekend = green-dark bg |
| RecipeAccentStrip | 19:15, 19:24… | breakfast / lunch / dinner | 3px height, color per meal |
| EmojiBubble | 19:16, 19:25… | breakfast / lunch / dinner | 36×36px, rounded, light color |
| SwapLink | text "↔ Заменить" | — | 11px Semi Bold, green-dark |
| Checkbox | 20:50, 20:55… | checked / unchecked | 24×24px, 7px radius |
| CategoryLabel | 20:48, 20:63, 20:74 | — | 10px Semi Bold, uppercase, emoji prefix |
| DragHandle | 20:6 | — | 36×4px, border color |
| ProgressTrack | 20:45 | — | 6px height, border-radius 3px |
| ProgressFill | 20:46 | — | Animated width, green gradient |
| BadgePill | 18:7 | allergen / default | Semi-transparent green |
| AllergenPill (header) | 19:7 | — | Header-level allergen indicator |
| DividerLine | 20:11, 20:49… | full-width / inset | 1px, border color |
| CloseButton | 20:9 | — | 32×32px circle |
| NavDot | 19:77, 20:90 | — | 4×4px active indicator |

### Molecules (7 total)
| Component | Figma Nodes | Variants | Notes |
|-----------|------------|---------|-------|
| RecipeCard | 19:14, 19:23, 19:32… | breakfast / lunch / dinner | AccentStrip + EmojiBubble + text + SwapLink |
| AlternativeRow | 20:12, 20:17, 20:24, 20:29 | default / selected | 64px row with emoji + info + optional checkmark |
| ShoppingItem | 20:50…20:84 | checked / unchecked | Checkbox + name + amount + divider |
| NavTab | inside 19:74, 20:85 | active / inactive | Icon + label + optional dot |
| HeroChip | 18:12, 18:14, 18:16 | — | Semi-transparent, hero section only |
| RegenButton | 19:72 | — | Dashed green border, ghost style |
| ShareButton | 20:43 | — | Ink bg, white text, rounded |

### Organisms (5 total)
| Component | Figma Nodes | Notes |
|-----------|------------|-------|
| OnboardingHero | 18:3 + children | Dark gradient bg, badge, title, chips |
| AllergenPicker | 18:19…18:42 | Responsive chip grid |
| WeekGrid | 19:10…19:71 | Horizontal scroll, day columns |
| BottomSheet | 20:5 + children | Backdrop + sheet + drag handle |
| BottomNav | 19:74, 20:85 | 2 tabs, fixed bottom |

---

## Design System Impact
**Level: HIGH**

- 16 new color tokens (full palette replacement from v1)
- 7 typography tokens updated (ExtraBold added)
- 3 new shadow tokens (glow, sheet, hover)
- 24+ new components across atoms/molecules/organisms
- 0 existing code components to extend (fresh implementation)

---

## Breaking Changes vs v1
| Area | v1 | v2 | Impact |
|------|----|----|--------|
| Primary color | #4CAF82 | #3ECF8E | All CTA buttons, active states |
| Hero section | emoji on green bg | dark gradient with glow | Full redesign |
| Card structure | flat frame | accent strip + shadow | Full redesign |
| Modal | overlay with flat rows | bottom sheet | Full redesign |

---

## Implementation Recommendations

### Phase 1: Design Tokens (0.5d)
Set up Tailwind config with all 16 color tokens, typography scale, spacing, shadows.

### Phase 2: Atoms (1d)
AllergenChip, RecipeAccentStrip, EmojiBubble, Checkbox, DayPill, NavTab, Badges.

### Phase 3: Molecules (1.5d)
RecipeCard, AlternativeRow, ShoppingItem, BottomNav, RegenButton.

### Phase 4: Organisms (2d)
OnboardingHero, AllergenPicker, WeekGrid, BottomSheet, Shopping categories.

### Phase 5: Pages + Integration (2d)
Wire Zustand store, Firestore data, navigation, analytics events.

**Total estimate: 7 days frontend**
