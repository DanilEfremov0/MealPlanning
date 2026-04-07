# UX Flow

## Main Navigation
- Dashboard
- Recipes
- Planner
- Shopping List
- Account

## First Run
1. User lands on onboarding.
2. User selects excluded ingredients or allergens.
3. User enters app dashboard.

## Recipes Flow
1. User opens Recipes.
2. User sees searchable recipe cards.
3. User opens add recipe drawer or page.
4. User fills metadata, ingredients, and steps.
5. Recipe appears in catalog.

## Planner Flow
1. User opens Planner.
2. User sees week grid.
3. User picks a day and meal slot.
4. User assigns a recipe.
5. Planned recipe appears in slot and updates summary.

## Shopping List Flow
1. User opens Shopping List.
2. App aggregates ingredients from all planned recipes.
3. Repeated ingredients merge by normalized name and unit when possible.
4. User can mark items checked.

## Important States
- empty recipes state
- empty planner state
- empty shopping list state
- recipe conflict badge when exclusions overlap ingredients
- success feedback after recipe creation
- validation errors on malformed recipe input

## Responsive Notes
- mobile uses stacked planner cards instead of dense grid
- add recipe form should be sectioned and scroll-friendly
- shopping list should remain readable with sticky summary/actions where possible
