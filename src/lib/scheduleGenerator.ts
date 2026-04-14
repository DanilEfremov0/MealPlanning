import type { Recipe, DaySchedule, MealType, ShoppingItem } from '../types';

const DAYS = 7;
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnique<T extends { id: string }>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generateSchedule(recipes: Recipe[]): DaySchedule[] {
  const byType = (t: MealType) => recipes.filter(r => r.mealType === t);
  const breakfasts = byType('breakfast');
  const lunches    = byType('lunch');
  const dinners    = byType('dinner');

  return Array.from({ length: DAYS }, (_, i) => ({
    dayIndex: i,
    breakfast: { recipe: pickRandom(breakfasts) ?? null, isLoading: false },
    lunch:     { recipe: pickRandom(lunches)     ?? null, isLoading: false },
    dinner:    { recipe: pickRandom(dinners)      ?? null, isLoading: false },
  }));
}

export function getAlternatives(
  recipes: Recipe[],
  mealType: MealType,
  currentId: string | null,
  count = 3
): Recipe[] {
  const pool = recipes.filter(r => r.mealType === mealType && r.id !== currentId);
  return pickUnique(pool, count);
}

export function generateShoppingList(schedule: DaySchedule[]): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();

  for (const day of schedule) {
    for (const mt of MEAL_TYPES) {
      const slot = day[mt];
      const recipe = slot.recipe;
      if (!recipe) continue;
      for (const ing of recipe.ingredients) {
        const key = ing.name.toLowerCase();
        if (map.has(key)) {
          // Just mark duplicate; real app would sum amounts
        } else {
          map.set(key, {
            id: `${recipe.id}-${key}`,
            name: ing.name,
            amount: ing.amount,
            category: ing.category,
            checked: false,
          });
        }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
}
