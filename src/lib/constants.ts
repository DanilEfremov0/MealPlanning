import type { MealSlot, Recipe, WeekPlan } from '../types/domain'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner']

export const DAY_LABELS: Record<string, string> = {
  Monday: 'Понедельник',
  Tuesday: 'Вторник',
  Wednesday: 'Среда',
  Thursday: 'Четверг',
  Friday: 'Пятница',
  Saturday: 'Суббота',
  Sunday: 'Воскресенье',
}

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Завтрак',
  lunch: 'Обед',
  dinner: 'Ужин',
}

export const ALLERGEN_OPTIONS = [
  'арахис',
  'орехи',
  'молоко',
  'яйца',
  'соя',
  'глютен',
  'рыба',
  'морепродукты',
  'кунжут',
  'грибы',
]

export const seedRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'Green shakshuka with spinach and feta',
    description: 'A bright skillet breakfast with eggs, herbs, spinach, and feta.',
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    cookingTime: 25,
    servings: 2,
    cuisine: 'Mediterranean',
    mealType: 'breakfast',
    ingredients: [
      { id: 'i-1', name: 'eggs', quantity: 4, unit: 'pcs' },
      { id: 'i-2', name: 'spinach', quantity: 150, unit: 'g' },
      { id: 'i-3', name: 'feta', quantity: 80, unit: 'g' },
      { id: 'i-4', name: 'green onion', quantity: 2, unit: 'stalks' },
    ],
    steps: ['Saute greens and onion.', 'Make wells and cook eggs.', 'Top with feta and serve.'],
  },
  {
    id: 'recipe-2',
    title: 'Chicken quinoa bowl',
    description: 'Balanced lunch bowl with roasted chicken, quinoa, and crunchy vegetables.',
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    cookingTime: 35,
    servings: 3,
    cuisine: 'Modern',
    mealType: 'lunch',
    ingredients: [
      { id: 'i-5', name: 'chicken breast', quantity: 400, unit: 'g' },
      { id: 'i-6', name: 'quinoa', quantity: 200, unit: 'g' },
      { id: 'i-7', name: 'cucumber', quantity: 1, unit: 'pcs' },
      { id: 'i-8', name: 'tomatoes', quantity: 250, unit: 'g' },
    ],
    steps: ['Cook quinoa.', 'Roast chicken.', 'Assemble bowl with chopped vegetables.'],
  },
  {
    id: 'recipe-3',
    title: 'Salmon with roasted vegetables',
    description: 'Weeknight dinner tray bake with salmon, potatoes, and broccoli.',
    imageUrl:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    cookingTime: 40,
    servings: 2,
    cuisine: 'European',
    mealType: 'dinner',
    ingredients: [
      { id: 'i-9', name: 'salmon fillet', quantity: 2, unit: 'pcs' },
      { id: 'i-10', name: 'potatoes', quantity: 400, unit: 'g' },
      { id: 'i-11', name: 'broccoli', quantity: 1, unit: 'head' },
      { id: 'i-12', name: 'lemon', quantity: 1, unit: 'pcs' },
    ],
    steps: ['Roast vegetables.', 'Bake salmon.', 'Serve with lemon.'],
  },
]

export const seedWeekPlan: WeekPlan = {
  Monday: { breakfast: 'recipe-1', lunch: 'recipe-2' },
  Tuesday: { dinner: 'recipe-3' },
  Wednesday: {},
  Thursday: {},
  Friday: {},
  Saturday: {},
  Sunday: {},
}
