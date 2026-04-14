import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

function log(event: string, params?: Record<string, unknown>) {
  if (analytics) logEvent(analytics, event, params ?? {});
}

export const track = {
  onboardingStart:      ()                              => log('onboarding_start'),
  allergenToggled:      (allergen: string, on: boolean) => log('allergen_toggled', { allergen, on }),
  scheduleGenerated:    (allergenCount: number)          => log('schedule_generated', { allergen_count: allergenCount }),
  mealSwapOpened:       (day: number, meal: string)      => log('meal_swap_opened', { day, meal_type: meal }),
  mealSwapped:          (recipeId: string)               => log('meal_swapped', { recipe_id: recipeId }),
  shoppingListOpened:   ()                              => log('shopping_list_opened'),
  shoppingItemToggled:  (itemName: string)               => log('shopping_item_toggled', { item: itemName }),
  scheduleRegenerated:  ()                              => log('schedule_regenerated'),
};
