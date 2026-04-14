# 03 — Design Specs (Developer Handoff)
**Project:** MealPlanning
**Product Designer:** Pipeline Stage 03
**Date:** 2026-04-14
**Figma file:** https://www.figma.com/file/jeRgiftgUgJV0YV5Yx73Id

---

## Figma Pages Structure

| Page | Contents |
|------|---------|
| Design System | Color palette, typography scale |
| Mobile Screens | All 4 mobile screens (375x812) |
| Desktop Screens | Desktop schedule screen (1440x900) |
| Flows & States | User flow diagrams |
| Specs | Component specifications |

---

## Screens Inventory

| ID | Screen Name | Figma Page | Size | States Covered |
|----|------------|-----------|------|---------------|
| 01 | Onboarding | Mobile Screens | 375x812 | Default (allergen selected) |
| 02a | Schedule — Empty | Mobile Screens | 375x812 | Empty state |
| 02b | Schedule — Populated | Mobile Screens | 375x812 | Populated with allergen badge |
| 03 | Swap Modal | Mobile Screens | 375x812 | Item selected state |
| 04 | Shopping List | Mobile Screens | 375x812 | Partially checked |
| D1 | Desktop Schedule | Desktop Screens | 1440x900 | Full 7-day grid |

---

## Color Tokens

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| --color-primary | #4CAF82 | 76, 175, 130 | Buttons, active states, accent bars |
| --color-primary-dark | #388E63 | 56, 142, 99 | Hover states, selected text |
| --color-primary-light | #E8F5EE | 232, 245, 238 | Selected chip bg, badge bg, secondary btn |
| --color-text | #1A1A2E | 26, 26, 46 | Primary text, headings |
| --color-subtext | #6B7280 | 107, 114, 128 | Secondary text, labels, metadata |
| --color-surface | #F9FAFB | 249, 250, 251 | Page background, skeleton bg |
| --color-border | #E5E7EB | 229, 231, 235 | Card borders, dividers, nav border |
| --color-error | #EF4444 | 239, 68, 68 | Error states (future use) |
| --color-warning | #F59E0B | 245, 158, 11 | Warning badges (future use) |
| --color-white | #FFFFFF | 255, 255, 255 | Card backgrounds, nav backgrounds |

Tailwind config:
```js
colors: {
  primary: { DEFAULT: '#4CAF82', dark: '#388E63', light: '#E8F5EE' },
  text: { DEFAULT: '#1A1A2E', sub: '#6B7280' },
  surface: '#F9FAFB',
  border: '#E5E7EB',
}
```

---

## Typography Scale

| Role | Size | Weight | Line Height | Tailwind Class |
|------|------|--------|-------------|---------------|
| H1 | 28px | Bold (700) | 36px | text-[28px] font-bold |
| H2 | 22px | Semi Bold (600) | 30px | text-[22px] font-semibold |
| H3 | 18px | Semi Bold (600) | 26px | text-lg font-semibold |
| Body | 15px | Regular (400) | 22px | text-[15px] |
| Label | 13px | Medium (500) | 18px | text-[13px] font-medium |
| Caption | 12px | Regular (400) | 16px | text-xs |
| Micro | 10–11px | Regular/Medium | 14px | text-[10px] |

Font family: Inter (Google Fonts). Fallback: system-ui, -apple-system, sans-serif.

---

## Spacing System

Base unit: 4px (Tailwind default).

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Micro gaps |
| space-2 | 8px | Chip gaps, small padding |
| space-3 | 12px | Card internal padding |
| space-4 | 16px | Screen horizontal padding |
| space-5 | 20px | Section gaps |
| space-6 | 24px | Screen top padding |
| space-8 | 32px | Large section spacing |

---

## Component Specs

### AllergenChip
States: unselected | selected | none-option

```
Unselected:
  bg: --color-surface
  border: 1px --color-border
  text: --color-text, 13px Regular
  padding: 10px 16px
  height: 44px
  border-radius: 22px

Selected:
  bg: --color-primary-light
  border: 1.5px --color-primary
  text: --color-primary-dark, 13px Medium
  same sizing

Touch target: 44x44px minimum
```

### RecipeCard (Mobile)
```
Width: column width (150px in scroll, full in list)
Height: 148px (with swap button)
bg: white
border: 1px --color-border
border-radius: 12px
Top accent bar: 4px height, bg --color-primary

Internal layout (top to bottom):
  - Accent bar: 4px
  - Emoji: 28px, centered, top: 10px from bar
  - Recipe name: 12px Medium, 8px from sides, top: 44px from top
  - Meta (time + calories): 10px Regular, subtext color
  - Swap button: height 28px, border-radius 8px, bg surface
    - Text: 11px Medium, primary color
    - Margin: 8px sides, 8px from bottom
```

### RecipeCard (Desktop)
```
Width: 182px
Height: 140px
Same visual treatment as mobile, scaled
Accent bar: 3px
Emoji: 24px
Recipe name: 12px Medium
Time/cal: 10px Regular
Swap button: 28px height
```

### SwapModal (Mobile — Bottom Sheet)
```
Backdrop: #1A1A2E at 50% opacity
Sheet:
  border-radius: 24px (top corners only, use CSS)
  bg: white
  padding: 24px
  min-height: 560px

Drag handle:
  width: 40px, height: 4px
  bg: --color-border
  border-radius: 2px
  centered, 8px from top

Alternative row:
  height: 64px
  border-radius: 12px
  padding: 12px 12px
  Unselected: bg white, border 1px --color-border
  Selected: bg --color-primary-light, border 1.5px --color-primary
```

### ShoppingItem
```
Height: 56px
Border-bottom: 1px --color-border
padding: 16px 20px

Checkbox:
  size: 24x24px
  border-radius: 6px
  Unchecked: bg white, border 2px --color-border
  Checked: bg --color-primary, checkmark white

Item name:
  Unchecked: 15px Medium, --color-text
  Checked: 15px Regular, --color-subtext, text-decoration: line-through

Amount: 14px Regular, --color-subtext, right-aligned
```

### PrimaryButton
```
height: 54px (main CTA) / 36px (secondary)
border-radius: 27px (pill)
bg: --color-primary
text: 16px Semi Bold (main) / 13px Semi Bold (secondary), white
padding: 0 24px
hover: bg --color-primary-dark
active: scale(0.97)
disabled: opacity 0.5, cursor not-allowed
```

### SecondaryButton (ghost)
```
Same sizing as primary
bg: --color-primary-light
text: --color-primary-dark
border: none
```

### BottomNav (Mobile)
```
height: 80px
bg: white
border-top: 1px --color-border
Two tabs, evenly spaced

Tab icon: 24px emoji
Tab label: 11px Regular (inactive) / Medium (active)
Active color: --color-primary
Inactive color: --color-subtext
```

### TopNav (Desktop)
```
height: 64px
bg: white
border-bottom: 1px --color-border
padding: 0 40px

Logo: left-aligned
Nav links: centered
Action button: right-aligned (200px wide)
Active nav link: underline 2px --color-primary
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | 375px | Bottom nav, WeekGrid horizontal scroll (150px cols) |
| Mobile L | 430px | Same layout, slightly wider cards |
| Tablet | 768px | Top nav, 3-4 days visible in grid |
| Desktop | 1280px | Full 7-day grid, top nav, sidebar option |
| Wide | 1440px | Full grid with comfortable margins |

### WeekGrid Responsive Behavior
- Mobile (< 768px): horizontal scroll, snap to day, 150px column width
- Tablet (768–1279px): 4 columns visible, scroll
- Desktop (>= 1280px): all 7 columns visible, no scroll
  - Column width: (viewport - 80px padding) / 7

---

## Interaction Notes

### Onboarding
- AllergenChip toggle: instant visual feedback (no loading)
- CTA button: always enabled (allergens optional)
- On tap CTA: brief 200ms scale animation, then navigate

### Schedule Generation
- Show skeleton cards (pulsing gray) while fetching recipes from Firestore
- Skeleton: same card dimensions, bg #EAECF0, animation: pulse 1.5s infinite
- After generation: cards fade in with 300ms stagger per day column

### SwapModal
- Trigger: tap on RecipeCard (anywhere on card)
- Open animation: sheet slides up from bottom, 250ms ease-out
- Close: tap backdrop or Escape key
- Focus trap: Tab cycles within modal
- Alternative row selection: instant visual swap (no loading)
- Confirm: 150ms feedback + close modal + update card

### Shopping List
- Checkbox tap: instant check animation (scale 0.9 → 1 on check)
- Checked item slides toward bottom (or just changes appearance for MVP)
- Share button: native share sheet on mobile, clipboard on desktop

---

## Accessibility Notes

| Requirement | Spec |
|------------|------|
| Color contrast (text) | Min 4.5:1. Primary on white: 3.5:1 — use on non-text only (icons/decorative) |
| Large text contrast | Min 3:1. H1/H2 on white: passes |
| Touch targets | Min 44x44px. All chips, buttons, checkboxes, nav tabs: 44px+ |
| Focus indicator | 2px solid #4CAF82 outline, 2px offset, visible on all interactive elements |
| Screen reader | All icon-only buttons: aria-label. Allergen chips: role="checkbox". Modal: aria-modal, aria-labelledby |
| Motion | All animations respect prefers-reduced-motion: reduce |

Note: Primary green (#4CAF82) on white background has contrast ratio ~3.5:1 — does NOT meet WCAG AA for body text. Only use it for icons, decorative elements, and large text (28px+). For interactive text labels use --color-primary-dark (#388E63) which achieves ~4.7:1.

---

## Assets to Export

| Asset | Format | Size | Usage |
|-------|--------|------|-------|
| App favicon | PNG | 32x32, 64x64 | Browser tab |
| App icon (PWA) | PNG | 192x192, 512x512 | Future PWA |
| Allergen icons | SVG | 24x24 | AllergenChip (use emoji for MVP) |

For MVP: all icons are emoji characters rendered in HTML. No SVG export needed.

---

## Animation Specs

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| AllergenChip toggle | Background + border color crossfade | 150ms | ease |
| CTA button tap | scale(0.97) | 100ms | ease |
| SwapModal open | translateY(100%) → 0 | 250ms | cubic-bezier(0.16, 1, 0.3, 1) |
| SwapModal close | translateY(0) → 100% | 200ms | ease-in |
| Skeleton loading | opacity 0.4 → 0.9 → 0.4 | 1500ms | ease-in-out, infinite |
| Schedule card appear | opacity 0 → 1, translateY(8px) → 0 | 300ms | ease-out, staggered 50ms/col |
| Checkbox check | scale(0.85) → 1 | 150ms | spring |
