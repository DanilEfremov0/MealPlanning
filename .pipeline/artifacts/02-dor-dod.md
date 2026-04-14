# 02 — Definition of Ready / Definition of Done
**Project:** MealPlanning
**Tech Lead:** Pipeline Stage 02
**Date:** 2026-04-14

---

## Frontend Tasks

### Definition of Ready
A frontend task can start when:
- [ ] Figma design exists for all UI states (default, loading, error, empty, success)
- [ ] API contract defined for all data it needs
- [ ] Acceptance criteria written and unambiguous
- [ ] Task has no unresolved dependencies still in progress

### Definition of Done
A frontend task is done when:
- [ ] Feature works end-to-end in browser (not just isolated component)
- [ ] All acceptance criteria checked off
- [ ] Unit tests written, passing, coverage ≥ 80% for the new code
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No ESLint warnings/errors on changed files
- [ ] Visual matches Figma design (±2px tolerance, exact colors)
- [ ] Tested at 375px, 768px, 1280px — no layout breakage
- [ ] Keyboard navigable, focus visible
- [ ] WCAG contrast ≥ 4.5:1 on all text (verified with axe or contrast checker)
- [ ] No console errors or warnings in dev mode
- [ ] `04-frontend-notes.md` updated with any implementation decisions

---

## Backend Tasks

### Definition of Ready
A backend/Firestore task can start when:
- [ ] Data model approved (schema, field types, relationships)
- [ ] Security requirements clear (who can read/write what)
- [ ] Acceptance criteria written
- [ ] Firebase project exists and accessible

### Definition of Done
A backend task is done when:
- [ ] All acceptance criteria checked off
- [ ] Firestore security rules updated and deployed
- [ ] Unit tests for all pure functions
- [ ] Integration tested against real Firestore (not mocked)
- [ ] Error cases handled (not found, permission denied, network error)
- [ ] No `any` types in service layer
- [ ] `05-backend-notes.md` updated with schema decisions

---

## Design Tasks

### Definition of Ready
A design task can start when:
- [ ] User stories and acceptance criteria confirmed by Product Lead
- [ ] Tech constraints documented (what layout/interactions are feasible)
- [ ] Analytics events listed (which user actions must be trackable)
- [ ] Component inventory from existing design system (if any)

### Definition of Done
A design task is done when:
- [ ] All screens designed in hi-fi Figma
- [ ] All UI states covered: default, loading, error, empty, success, disabled
- [ ] Responsive variants: mobile (375px) and desktop (1280px) at minimum
- [ ] Interactive prototype links all screens
- [ ] Components documented with specs (spacing, color, typography as Figma annotations)
- [ ] Allergen icons/assets exported or specified
- [ ] Design reviewed against Product Brief acceptance criteria
- [ ] `03-design-specs.md` written with Figma frame links per screen

---

## Analytics Tasks

### Definition of Ready
- [ ] Event names and parameters agreed with Product Lead
- [ ] Trigger point (which UI interaction) specified per event
- [ ] Firebase Analytics / DebugView access confirmed

### Definition of Done
- [ ] All 8 events from Product Brief fire correctly
- [ ] Events verified in Firebase DebugView (real-time test)
- [ ] Parameters match schema (correct types, correct names)
- [ ] No duplicate events firing (e.g., onboarding_completed not firing on back navigation)

