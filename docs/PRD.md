# MealPlanning MVP PRD

## Product
A web application for weekly meal planning with a recipe catalog, allergy-aware onboarding, weekly plan composition, and an aggregated shopping list.

## Problem
Planning meals for a week is fragmented. Users collect recipes in one place, mentally adapt them to dietary exclusions, and manually compile grocery lists. This creates friction and increases the chance of forgetting ingredients.

## Target User
A person or household planner who wants to organize meals for the upcoming week and generate a single shopping list.

## MVP Goal
Allow a user to:
- define product exclusions during onboarding
- browse and add recipes
- create a weekly meal plan
- automatically generate a combined shopping list from planned recipes

## In Scope
- onboarding with allergen or ingredient exclusions
- recipe catalog with add recipe flow
- recipe details inspired by eda.ru style metadata
- week planner by day and meal slot
- aggregated shopping list with merged ingredients
- placeholder personal account area in UI architecture
- responsive polished web UI

## Out of Scope
- authentication and authorization
- multi-user collaboration
- payments
- nutritional analytics beyond light recipe metadata
- AI recipe generation

## Functional Requirements
1. User can complete onboarding and save excluded ingredients.
2. User can create recipes through UI.
3. Recipe supports title, description, image URL, cooking time, servings, cuisine, meal type, ingredients, and steps.
4. User can browse recipes and quickly identify conflicts with exclusions.
5. User can assign recipes to a weekly plan by day and meal slot.
6. Shopping list is generated from all planned recipes and merges repeated ingredients.
7. Shopping list visually marks ingredients that conflict with exclusions if such data exists in plan.
8. User can revisit a personal account page placeholder with preferences summary.

## Success Criteria
- app starts locally without errors
- user can add at least one recipe and plan it for a week
- shopping list updates from the weekly plan
- exclusions affect recipe conflict visibility
- core flows are understandable on desktop and mobile

## Risks
- ingredient normalization can become messy if overbuilt
- recipes may use inconsistent units
- beautiful UI can slow down MVP if not scoped carefully

## Product Decisions
- MVP is single-user first
- data persistence uses browser local storage for fast delivery
- auth comes later, but app structure should allow future account integration
