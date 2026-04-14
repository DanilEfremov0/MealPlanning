export type AllergenKey = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'seafood' | 'soy';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Ingredient {
  name: string;
  amount: string;
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'pantry';
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  mealType: MealType;
  allergens: AllergenKey[];
  ingredients: Ingredient[];
  calories: number;
  prepTime: number;
  accentColor: 'green' | 'orange' | 'purple';
}

export interface MealSlot {
  recipe: Recipe | null;
  isLoading: boolean;
}

export interface DaySchedule {
  dayIndex: number; // 0 = Mon
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: Ingredient['category'];
  checked: boolean;
}

export interface SelectedSlot {
  dayIndex: number;
  mealType: MealType;
}
