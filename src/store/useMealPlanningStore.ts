import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DAYS, seedRecipes, seedWeekPlan } from '../lib/constants'
import { buildShoppingList } from '../lib/utils'
import type { Preferences, Recipe, WeekPlan } from '../types/domain'

type State = {
  preferences: Preferences
  recipes: Recipe[]
  weekPlan: WeekPlan
  shoppingItemChecks: Record<string, boolean>
  completeOnboarding: (excludedIngredients: string[]) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (recipe: Recipe) => void
  deleteRecipe: (recipeId: string) => void
  assignRecipeToSlot: (day: string, slot: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => void
  removeRecipeFromSlot: (day: string, slot: 'breakfast' | 'lunch' | 'dinner') => void
  clearWeekPlan: () => void
  toggleShoppingItem: (key: string) => void
  resetShoppingChecks: () => void
}

const createEmptyWeekPlan = (): WeekPlan =>
  DAYS.reduce<WeekPlan>((acc, day) => {
    acc[day] = {}
    return acc
  }, {} as WeekPlan)

export const useMealPlanningStore = create<State>()(
  persist(
    (set) => ({
      preferences: {
        hasCompletedOnboarding: false,
        excludedIngredients: [],
      },
      recipes: seedRecipes,
      weekPlan: { ...createEmptyWeekPlan(), ...seedWeekPlan },
      shoppingItemChecks: {},
      completeOnboarding: (excludedIngredients) =>
        set({
          preferences: {
            hasCompletedOnboarding: true,
            excludedIngredients,
          },
        }),
      addRecipe: (recipe) => set((state) => ({ recipes: [recipe, ...state.recipes] })),
      updateRecipe: (recipe) =>
        set((state) => ({
          recipes: state.recipes.map((item) => (item.id === recipe.id ? recipe : item)),
        })),
      deleteRecipe: (recipeId) =>
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
          weekPlan: Object.fromEntries(
            Object.entries(state.weekPlan).map(([day, slots]) => [
              day,
              Object.fromEntries(
                Object.entries(slots).filter(([, assignedRecipeId]) => assignedRecipeId !== recipeId),
              ),
            ]),
          ) as WeekPlan,
        })),
      assignRecipeToSlot: (day, slot, recipeId) =>
        set((state) => ({
          weekPlan: {
            ...state.weekPlan,
            [day]: {
              ...state.weekPlan[day],
              [slot]: recipeId,
            },
          },
        })),
      removeRecipeFromSlot: (day, slot) =>
        set((state) => ({
          weekPlan: {
            ...state.weekPlan,
            [day]: {
              ...state.weekPlan[day],
              [slot]: undefined,
            },
          },
        })),
      clearWeekPlan: () => set({ weekPlan: createEmptyWeekPlan() }),
      toggleShoppingItem: (key) =>
        set((state) => ({
          shoppingItemChecks: {
            ...state.shoppingItemChecks,
            [key]: !state.shoppingItemChecks[key],
          },
        })),
      resetShoppingChecks: () => set({ shoppingItemChecks: {} }),
    }),
    {
      name: 'mealplanning-storage',
      version: 1,
    },
  ),
)

export const useShoppingList = () => {
  const recipes = useMealPlanningStore((state) => state.recipes)
  const weekPlan = useMealPlanningStore((state) => state.weekPlan)
  const exclusions = useMealPlanningStore((state) => state.preferences.excludedIngredients)
  const checkedState = useMealPlanningStore((state) => state.shoppingItemChecks)

  const recipeIds = Object.values(weekPlan).flatMap((day) => Object.values(day).filter(Boolean)) as string[]
  return buildShoppingList(recipes, recipeIds, exclusions, checkedState)
}
