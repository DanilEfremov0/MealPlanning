# 02 — Risk Assessment
**Project:** MealPlanning
**Tech Lead:** Pipeline Stage 02
**Date:** 2026-04-14

---

## Risk Matrix

| ID | Risk | Severity | Probability | Mitigation |
|----|------|----------|-------------|-----------|
| R-01 | Firebase free tier limits exceeded | Low | Low | Firestore free: 50k reads/day. With 30 recipes and ~100 daily users = ~3k reads/day. Safe. Revisit at 1000 DAU. |
| R-02 | Allergen filtering returns 0 recipes | High | Medium | Mitigated in FE-05: fallback to any safe recipe. UI shows warning if pool < 7. |
| R-03 | Recipe ingredient merging breaks on unit mismatch | Medium | High | Mitigated in FE-06: mismatched units kept separate, not summed. Explicit unit normalization for common cases (г/g, мл/ml). |
| R-04 | Firebase Analytics blocked by ad-blockers | Low | Medium | Expected — analytics is enhancement, not core feature. No user-facing impact. |
| R-05 | Web Share API not available (desktop) | Low | High | Mitigated in FE-04: `navigator.share` check with clipboard fallback. Both flows tested. |
| R-06 | Figma designs not ready before frontend starts | High | Medium | Mitigation: FE-01 (scaffold) and FE-05/FE-06 (pure logic) can start without designs. FE-02, FE-03, FE-04, FE-07 gate on design. |
| R-07 | 30 recipes insufficient for unique 7-day schedule | Medium | Medium | Math: 3 meals × 7 days = 21 slots. 30 recipes → sufficient with minor repetition. Allergen-heavy users may see repeats. Logged warning, acceptable for MVP. |
| R-08 | localStorage unavailable (private/incognito) | Low | Low | Catch + no-op fallback. App still works session-scoped, just doesn't persist. |
| R-09 | Firebase project setup delays unblock backend tasks | High | Low | Mitigation: BE-01 is first task, unblocks everything. Can mock Firebase locally with Firestore emulator. |
| R-10 | Tailwind CSS output too large on production | Low | Low | Vite + Tailwind purge via content config. Final CSS should be <10KB gzipped. |

---

## Spikes Required

None. All technologies (React, Firebase, Tailwind) are well-understood with no unknowns requiring investigation before implementation.

---

## Key Technical Decisions

| Decision | Rationale | Alternative Considered |
|----------|-----------|----------------------|
| No auth in MVP | Product Brief explicitly out-of-scope. Adds complexity without clear user value for v1. | Firebase Anonymous Auth — deferred to v2 |
| Schedule not persisted to Firestore | No auth = no stable user identity. localStorage sufficient for MVP retention. | Firestore with anonymous session ID — deferred |
| Client-side allergen filtering | Firestore `array-not-contains` not supported. 30 recipes = client filtering is negligible. | Firestore compound index workaround — overkill |
| Zustand over Redux | Simple state tree. Zustand = 1.5KB vs Redux 40KB+. No need for devtools at this scale. | Redux Toolkit — over-engineered for MVP |
| Vite over CRA | CRA deprecated. Vite 10× faster HMR, native ESM, actively maintained. | Next.js — SSR not needed for this SPA |

---

## Implementation Order (Critical Path)

```
Week 1:
  Day 1: BE-01 (Firebase setup) + FE-01 (scaffold) — PARALLEL
  Day 2: BE-02 (seed data — can continue in background) + FE-05 (schedule gen logic)
  Day 3: BE-03 (Firestore service) + FE-06 (shopping gen logic)

Week 2:
  Day 1-2: FE-02 (Onboarding) — needs design + BE-03
  Day 3-4: FE-03 (Schedule screen) — needs design + FE-05
  Day 5:   FE-04 (Shopping screen) — needs design + FE-06

Week 3:
  Day 1-2: FE-07 (SwapModal) — needs design + FE-03
  Day 3:   FE-08 (Analytics) — needs all screens
  Day 4-5: FE-09 (Polish + a11y + performance)

Week 4:
  QA Code + QA Design → Final Review
```

**Critical path:** BE-01 → BE-03 → FE-02/03/04 → FE-07 → FE-08 → FE-09

Design (Stage 03) runs concurrently with Sprint 0–1 development. Frontend screens (FE-02, FE-03, FE-04, FE-07) cannot finalize without Figma specs — designs must be ready by start of Week 2.

