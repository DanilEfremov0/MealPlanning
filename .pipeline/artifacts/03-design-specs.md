# 03 — Design Specs (Developer Handoff) v2
**Project:** MealPlanning
**Iteration:** v2 (after Product Lead review)
**Date:** 2026-04-14
**Figma:** https://www.figma.com/file/jeRgiftgUgJV0YV5Yx73Id
**Implementation plan:** `.agent/tasks/TASK-01-mealplanning-mvp-frontend.md`
**Design review:** `.agent/design-system/reviews/2026-04-14-mealplanning-mvp-v2.md`

---

## What Changed from v1

| Area | v1 | v2 |
|------|----|----|
| Onboarding hero | Flat emoji on green bg | Dark gradient with radial glow, badge, preview chips |
| Primary color | #4CAF82 | #3ECF8E (better vibrancy) |
| Cards | Flat white frames | Accent strip (color per meal) + emoji bubble + shadow |
| Swap modal | Flat overlay with rows | Bottom sheet with drag handle + dimmed backdrop |
| Shopping list | Flat item list | Categorized + progress bar + share button |
| Typography | Missing ExtraBold | Inter ExtraBold added for hero (800 weight) |
| Shadows | None | xs (cards), cta (buttons), sheet (modal) |

---

## Figma Pages

| Page | Contents |
|------|---------|
| Design System | Color palette (v1) + Typography scale |
| Mobile Screens | 4 screens v2: Onboarding, Schedule, Swap Modal, Shopping |
| Desktop Screens | Desktop Schedule v2 (1440x900) |

---

## Color Tokens

```js
// tailwind.config.ts
colors: {
  green:  { DEFAULT: '#3ECF8E', dark: '#1a9e6a', dim: '#d1fae5' },
  ink:    { DEFAULT: '#0f172a', 2: '#334155', 3: '#64748b', 4: '#94a3b8' },
  surface: '#f8fafc',
  card:   '#ffffff',
  border: '#e2e8f0',
  amber:  { DEFAULT: '#F59E0B', light: '#FEF3C7' },
  blue:   { DEFAULT: '#3B82F6', light: '#DBEAFE' },
  violet: { DEFAULT: '#8B5CF6', light: '#EDE9FE' },
  red:    '#F43F5E',
  amber2: '#F59E0B',
}
```

**Accessibility note:** `green` (#3ECF8E) on white = ~3.5:1 — use ONLY for icons,
accent strips, decorative. For text on white, always use `green-dark` (#1a9e6a = 4.7:1 ✓).

---

## Typography

```js
fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] }
```

| Role | Size | Weight | Tailwind |
|------|------|--------|---------|
| Hero | 30px | 800 | `text-[30px] font-extrabold` |
| Title | 22px | 700 | `text-[22px] font-bold` |
| Section | 18px | 600 | `text-lg font-semibold` |
| Body | 15px | 400–500 | `text-[15px]` |
| Label | 13px | 500–600 | `text-[13px] font-medium` |
| Caption | 12px | 400 | `text-xs` |
| Micro | 10–11px | 600–700 | `text-[10px] font-semibold` |

---

## Spacing

Base: 4px. Use Tailwind defaults. Key values: 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px).

---

## Component Specs

### PrimaryButton
```
height: 54px
border-radius: 9999px (pill)
bg: green (#3ECF8E)
text: 16px Bold, ink (#0f172a)  ← ink on green = 10:1 contrast ✓
shadow: 0 8px 20px -4px rgba(62,207,142,.45)
hover: bg green-dark
active: scale(0.97) 100ms
```

### AllergenChip
```
height: 44px (touch target)
border-radius: 22px
unselected: bg surface, border border, text ink-2 13px Medium
selected:   bg green-dim, border 1.5px green, text green-dark 13px SemiBold
            shadow: 0 0 0 3px rgba(62,207,142,.18)
transition: all 150ms ease
```

### RecipeCard (Mobile)
```
width: 152px (mobile scroll column)
border-radius: 10px
border: 1px border
shadow: 0 1px 3px rgba(15,23,42,.06)
hover:  0 10px 15px rgba(15,23,42,.08), translateY(-1px)

AccentStrip: 3px top, full width
  breakfast: linear-gradient(90deg, #F59E0B, #FBBF24)
  lunch:     linear-gradient(90deg, #3B82F6, #60A5FA)
  dinner:    linear-gradient(90deg, #8B5CF6, #A78BFA)

EmojiBubble: 36x36px, rounded-[10px]
  breakfast: bg amber-light
  lunch:     bg blue-light
  dinner:    bg violet-light

Recipe name: 12px SemiBold, ink, max 2 lines
Meta: 10px Regular, ink-4
SwapLink: centered, 11px SemiBold, green-dark
```

### RecipeCard (Desktop)
```
width: (viewport - 80px) / 7 ≈ 182px
AccentStrip: 3px
EmojiBubble: 32x32px
Recipe name: 12px SemiBold
Same hover behavior
```

### AlternativeRow (SwapModal)
```
height: 64px
border-radius: 14px
unselected: bg surface, border 1px border
selected:   bg green-dim, border 1.5px green
            shadow: 0 0 0 3px rgba(62,207,142,.15)
transition: all 150ms

EmojiArea: 40x40px, rounded-[10px]
  unselected: bg border/50
  selected:   bg rgba(62,207,142,.25)

Name: 14px SemiBold (selected green-dark, unselected ink)
Meta: 12px Regular, ink-3
Checkmark: 26x26px circle, bg green, white ✓
```

### BottomSheet
```
Backdrop: fixed inset-0, bg ink/55, backdrop-blur-sm
Sheet: fixed bottom-0 left-0 right-0
       bg card, border-radius 24px 24px 0 0
       shadow: 0 -8px 40px rgba(15,23,42,.25)

Open animation:  translateY(100%) → translateY(0), 250ms cubic-bezier(0.16,1,0.3,1)
Close animation: translateY(0) → translateY(100%), 200ms ease-in

DragHandle: 36x4px, bg border, border-radius 2px, centered, margin-top 10px
```

### ShoppingItem
```
height: 56px
border-bottom: 1px border (inset: from checkbox edge)
padding: 0 20px

Checkbox: 24x24px, rounded-[7px]
  unchecked: bg card, border 2px border
  checked:   bg green, no border, white ✓ (13px Bold)
  animation: scale 0.85→1, 150ms

Name (unchecked): 15px Medium, ink
Name (checked):   15px Regular, ink-4, text-decoration: line-through

Amount: 14px SemiBold, ink-3, right-aligned
```

### ProgressBar
```
Track: height 6px, bg border, border-radius 3px
Fill:  height 6px, bg linear-gradient(90deg, green, green-dark)
       width: (checked/total * 100)%
       transition: width 300ms ease
Label: 11px Medium, ink-4
```

### BottomNav
```
height: 80px + safe-area-inset-bottom
bg: card/92 with backdrop-blur-md
border-top: 1px border

NavTab (active):   icon 22px + label 11px SemiBold, color green-dark
                   4x4px dot, color green, below label
NavTab (inactive): icon 22px + label 11px Medium, color ink-4
```

### OnboardingHero
```
height: ~320px
bg: linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #0d4a2e 100%)
overlay: radial-gradient(ellipse 70% 60% at 60% 50%, rgba(62,207,142,.18), transparent)

BadgePill: bg green/12, border green/30, 12px SemiBold, green text
HeroTitle: 30px ExtraBold, white; accent word: green
Subtitle:  14px Regular, white/65, line-height 1.5
PreviewChips: bg white/8, border white/15, 12px Medium, white/80
```

---

## Responsive Breakpoints

| Breakpoint | px | WeekGrid | Nav |
|-----------|-----|---------|-----|
| Mobile | 375 | Horizontal scroll, 152px cols | Bottom nav |
| Mobile L | 430 | Same | Bottom nav |
| Tablet | 768 | 4 cols visible, scroll | Top nav |
| Desktop | 1280 | All 7 cols, CSS Grid | Top nav + sidebar option |
| Wide | 1440 | Full grid, 40px padding | Top nav |

---

## Animations

| Element | Spec |
|---------|-----|
| AllergenChip toggle | bg + border crossfade, 150ms ease |
| PrimaryButton tap | scale(0.97), 100ms ease |
| BottomSheet open | translateY(100%→0), 250ms cubic-bezier(0.16,1,0.3,1) |
| BottomSheet close | translateY(0→100%), 200ms ease-in |
| Skeleton pulse | opacity 0.4↔0.9, 1500ms ease-in-out infinite |
| RecipeCard hover | translateY(-1px) + shadow-md, 150ms ease |
| Checkbox check | scale(0.85→1), 150ms ease |
| ProgressBar fill | width, 300ms ease |
| Schedule cards appear | opacity 0→1 + translateY(8px→0), 300ms, 50ms stagger/col |

All animations: `@media (prefers-reduced-motion: reduce) { * { animation: none; transition: none; } }`

---

## Accessibility

| Requirement | Implementation |
|------------|---------------|
| Contrast (body text) | Use ink (#0f172a) or ink-2/3 on light — all pass 4.5:1 |
| Contrast (green on ink) | white text on ink bg: 16:1 ✓ |
| Touch targets | All chips, buttons, checkboxes, nav tabs: min 44x44px |
| Focus visible | `focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2` |
| BottomSheet | `role="dialog" aria-modal="true" aria-labelledby="sheet-title"` |
| AllergenChip | `role="checkbox" aria-checked={selected}` |
| Nav tabs | `role="tab" aria-selected={active}` |
| Images/emoji | Decorative emoji: `aria-hidden="true"` |
| Form fields | All inputs labeled (future auth phase) |
