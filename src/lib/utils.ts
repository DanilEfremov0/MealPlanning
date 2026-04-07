import type { Recipe, ShoppingListItem } from '../types/domain'

export const cn = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ')

export const normalizeName = (value: string) => value.trim().toLowerCase()

export const recipeMatchesExclusions = (recipe: Recipe, exclusions: string[]) => {
  const normalized = exclusions.map(normalizeName)
  return recipe.ingredients.some((ingredient) => normalized.includes(normalizeName(ingredient.name)))
}

export const buildShoppingList = (
  recipes: Recipe[],
  recipeIds: string[],
  exclusions: string[],
  checkedState: Record<string, boolean>,
): ShoppingListItem[] => {
  const plannedRecipes = recipes.filter((recipe) => recipeIds.includes(recipe.id))
  const map = new Map<string, ShoppingListItem>()
  const normalizedExclusions = exclusions.map(normalizeName)

  plannedRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const key = `${normalizeName(ingredient.name)}__${ingredient.unit.trim().toLowerCase()}`
      const existing = map.get(key)
      const conflict = normalizedExclusions.includes(normalizeName(ingredient.name))

      if (existing) {
        existing.quantity += ingredient.quantity
        existing.recipeTitles = Array.from(new Set([...existing.recipeTitles, recipe.title]))
        existing.conflictsWithExclusions = existing.conflictsWithExclusions || conflict
      } else {
        map.set(key, {
          key,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          checked: checkedState[key] ?? false,
          recipeTitles: [recipe.title],
          conflictsWithExclusions: conflict,
        })
      }
    })
  })

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}
