import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Recipe, DaySchedule, ShoppingItem,
  AllergenKey, SelectedSlot
} from '../types';
import { generateSchedule, getAlternatives, generateShoppingList } from '../lib/scheduleGenerator';

interface StoreState {
  // Onboarding
  onboardingComplete: boolean;
  allergens: AllergenKey[];

  // Recipes (loaded from Firestore)
  recipes: Recipe[];

  // Schedule
  schedule: DaySchedule[];

  // Swap
  selectedSlot: SelectedSlot | null;
  alternatives: Recipe[];

  // Shopping
  shoppingItems: ShoppingItem[];
  shoppingOpen: boolean;

  // Actions
  setRecipes: (r: Recipe[]) => void;
  toggleAllergen: (a: AllergenKey) => void;
  completeOnboarding: () => void;
  generateNewSchedule: () => void;
  openSwap: (slot: SelectedSlot) => void;
  closeSwap: () => void;
  confirmSwap: (recipe: Recipe) => void;
  toggleShoppingItem: (id: string) => void;
  openShopping: () => void;
  closeShopping: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      allergens: [],
      recipes: [],
      schedule: [],
      selectedSlot: null,
      alternatives: [],
      shoppingItems: [],
      shoppingOpen: false,

      setRecipes: (recipes) => set({ recipes }),

      toggleAllergen: (allergen) => set(s => ({
        allergens: s.allergens.includes(allergen)
          ? s.allergens.filter(a => a !== allergen)
          : [...s.allergens, allergen],
      })),

      completeOnboarding: () => {
        const { recipes, allergens } = get();
        const filtered = recipes.filter(r =>
          !r.allergens.some(a => allergens.includes(a))
        );
        const schedule = generateSchedule(filtered);
        const shoppingItems = generateShoppingList(schedule);
        set({ onboardingComplete: true, schedule, shoppingItems });
      },

      generateNewSchedule: () => {
        const { recipes, allergens } = get();
        const filtered = recipes.filter(r =>
          !r.allergens.some(a => allergens.includes(a))
        );
        const schedule = generateSchedule(filtered);
        const shoppingItems = generateShoppingList(schedule);
        set({ schedule, shoppingItems });
      },

      openSwap: (slot) => {
        const { recipes, allergens, schedule } = get();
        const filtered = recipes.filter(r =>
          !r.allergens.some(a => allergens.includes(a))
        );
        const day = schedule.find(d => d.dayIndex === slot.dayIndex);
        const currentId = day?.[slot.mealType]?.recipe?.id ?? null;
        const alternatives = getAlternatives(filtered, slot.mealType, currentId);
        set({ selectedSlot: slot, alternatives });
      },

      closeSwap: () => set({ selectedSlot: null, alternatives: [] }),

      confirmSwap: (recipe) => {
        const { selectedSlot, schedule } = get();
        if (!selectedSlot) return;
        const newSchedule = schedule.map(d =>
          d.dayIndex === selectedSlot.dayIndex
            ? { ...d, [selectedSlot.mealType]: { recipe, isLoading: false } }
            : d
        );
        const shoppingItems = generateShoppingList(newSchedule);
        set({ schedule: newSchedule, shoppingItems, selectedSlot: null, alternatives: [] });
      },

      toggleShoppingItem: (id) => set(s => ({
        shoppingItems: s.shoppingItems.map(i =>
          i.id === id ? { ...i, checked: !i.checked } : i
        ),
      })),

      openShopping: () => set({ shoppingOpen: true }),
      closeShopping: () => set({ shoppingOpen: false }),
    }),
    {
      name: 'mealplan-store',
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        allergens: s.allergens,
        schedule: s.schedule,
        shoppingItems: s.shoppingItems,
      }),
    }
  )
);
