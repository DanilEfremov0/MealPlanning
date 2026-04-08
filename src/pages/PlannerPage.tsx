import { RotateCcw } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { DAYS, MEAL_SLOTS } from '../lib/constants'
import { recipeMatchesExclusions } from '../lib/utils'
import { useMealPlanningStore } from '../store/useMealPlanningStore'

export function PlannerPage() {
  const recipes = useMealPlanningStore((state) => state.recipes)
  const weekPlan = useMealPlanningStore((state) => state.weekPlan)
  const exclusions = useMealPlanningStore((state) => state.preferences.excludedIngredients)
  const assignRecipeToSlot = useMealPlanningStore((state) => state.assignRecipeToSlot)
  const removeRecipeFromSlot = useMealPlanningStore((state) => state.removeRecipeFromSlot)
  const clearWeekPlan = useMealPlanningStore((state) => state.clearWeekPlan)

  const plannedMeals = Object.values(weekPlan).flatMap((day) => Object.values(day)).filter(Boolean).length
  const safeRecipes = recipes.filter((recipe) => !recipeMatchesExclusions(recipe, exclusions))
  const conflictRecipes = recipes.filter((recipe) => recipeMatchesExclusions(recipe, exclusions))

  return (
    <div className="page-stack">
      <section className="card">
        <SectionHeader
          eyebrow="Weekly planner"
          title="Map meals by day and slot"
          description={`Each change updates the downstream shopping list automatically. ${plannedMeals} slots are currently filled.`}
          action={
            <button className="secondary-button action-button" onClick={clearWeekPlan} type="button">
              <RotateCcw size={14} /> Clear week
            </button>
          }
        />
        <div className="planner-grid">
          {DAYS.map((day) => {
            const filledSlots = Object.values(weekPlan[day] ?? {}).filter(Boolean).length

            return (
              <div className="planner-day card subtle" key={day}>
                <div className="planner-day-header">
                  <h3>{day}</h3>
                  <span className="mini-chip">{filledSlots}/3 planned</span>
                </div>
                {MEAL_SLOTS.map((slot) => {
                  const recipeId = weekPlan[day]?.[slot]
                  const selectedRecipe = recipes.find((recipe) => recipe.id === recipeId)
                  const conflict = selectedRecipe ? recipeMatchesExclusions(selectedRecipe, exclusions) : false

                  return (
                    <div className="slot-block" key={`${day}-${slot}`}>
                      <div className="slot-topline">
                        <strong>{slot}</strong>
                        {selectedRecipe && conflict && <span className="warning-badge">exclusion conflict</span>}
                      </div>
                      <select
                        value={recipeId ?? ''}
                        onChange={(event) => {
                          const value = event.target.value
                          if (!value) {
                            removeRecipeFromSlot(day, slot)
                            return
                          }
                          assignRecipeToSlot(day, slot, value)
                        }}
                      >
                        <option value="">No recipe selected</option>
                        {safeRecipes.length > 0 && (
                          <optgroup label="Safe recipes">
                            {safeRecipes.map((recipe) => (
                              <option key={recipe.id} value={recipe.id}>
                                {recipe.title}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {conflictRecipes.length > 0 && (
                          <optgroup label="Recipes with exclusion conflicts">
                            {conflictRecipes.map((recipe) => (
                              <option key={recipe.id} value={recipe.id}>
                                {recipe.title}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      {selectedRecipe ? (
                        <>
                          <p className="slot-caption">{selectedRecipe.description}</p>
                          <div className="ingredient-preview">
                            {selectedRecipe.ingredients.slice(0, 3).map((ingredient) => (
                              <span className="mini-chip" key={ingredient.id}>{ingredient.name}</span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="slot-caption">Choose a recipe for this slot.</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
