export type MealSlot = 'breakfast' | 'lunch' | 'dinner'

export type Ingredient = {
  id: string
  name: string
  quantity: number
  unit: string
}

export type Recipe = {
  id: string
  title: string
  description: string
  imageUrl: string
  cookingTime: number
  servings: number
  cuisine: string
  mealType: MealSlot
  ingredients: Ingredient[]
  steps: string[]
}

export type Preferences = {
  hasCompletedOnboarding: boolean
  excludedIngredients: string[]
}

export type WeekPlan = Record<string, Partial<Record<MealSlot, string>>>

export type ShoppingListItem = {
  key: string
  name: string
  quantity: number
  unit: string
  checked: boolean
  recipeTitles: string[]
  conflictsWithExclusions: boolean
}
