import { Clock3, RotateCcw, Sparkles, TriangleAlert, Users } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { DAYS, DAY_LABELS, MEAL_SLOTS, MEAL_SLOT_LABELS } from '../lib/constants'
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
          eyebrow="Планировщик недели"
          title="Собери меню по дням"
          description={`Главный сценарий теперь здесь: день → приём пищи → блюдо. Сейчас заполнено ${plannedMeals} из 21 слота.`}
          action={
            <button className="secondary-button action-button" onClick={clearWeekPlan} type="button">
              <RotateCcw size={14} /> Очистить неделю
            </button>
          }
        />

        <div className="planner-summary-grid">
          <div className="card subtle planner-summary-card">
            <span className="eyebrow">Заполнение</span>
            <strong>{plannedMeals}/21</strong>
            <span>приёмов пищи уже запланировано на неделю</span>
          </div>
          <div className="card subtle planner-summary-card">
            <span className="eyebrow">Безопасные блюда</span>
            <strong>{safeRecipes.length}</strong>
            <span>подходят без конфликта с исключениями</span>
          </div>
          <div className="card subtle planner-summary-card">
            <span className="eyebrow">Нужна проверка</span>
            <strong>{conflictRecipes.length}</strong>
            <span>рецептов содержат потенциальные конфликты</span>
          </div>
        </div>

        <div className="planner-grid planner-grid-wide">
          {DAYS.map((day) => {
            const filledSlots = Object.values(weekPlan[day] ?? {}).filter(Boolean).length
            const dayConflictCount = MEAL_SLOTS.filter((slot) => {
              const recipeId = weekPlan[day]?.[slot]
              const selectedRecipe = recipes.find((recipe) => recipe.id === recipeId)
              return selectedRecipe ? recipeMatchesExclusions(selectedRecipe, exclusions) : false
            }).length

            return (
              <div className="planner-day card subtle planner-day-rich" key={day}>
                <div className="planner-day-header planner-day-header-rich">
                  <div>
                    <h3>{DAY_LABELS[day]}</h3>
                    <span className="subtext">{filledSlots} из 3 приёмов пищи выбрано</span>
                  </div>
                  <div className="planner-day-meta">
                    <span className="mini-chip">{filledSlots}/3 готово</span>
                    {dayConflictCount > 0 && (
                      <span className="warning-badge">
                        <TriangleAlert size={14} /> {dayConflictCount} конфликт
                      </span>
                    )}
                  </div>
                </div>

                <div className="planner-slot-list">
                  {MEAL_SLOTS.map((slot) => {
                    const recipeId = weekPlan[day]?.[slot]
                    const selectedRecipe = recipes.find((recipe) => recipe.id === recipeId)
                    const conflict = selectedRecipe ? recipeMatchesExclusions(selectedRecipe, exclusions) : false

                    return (
                      <div className={`meal-card ${selectedRecipe ? '' : 'meal-card-empty'}`} key={`${day}-${slot}`}>
                        <div className="meal-card-header">
                          <strong>{MEAL_SLOT_LABELS[slot]}</strong>
                          {selectedRecipe && conflict && <span className="warning-badge">содержит аллерген</span>}
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
                          <option value="">Добавить блюдо</option>
                          {safeRecipes.length > 0 && (
                            <optgroup label="Без конфликтов">
                              {safeRecipes.map((recipe) => (
                                <option key={recipe.id} value={recipe.id}>
                                  {recipe.title}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {conflictRecipes.length > 0 && (
                            <optgroup label="С конфликтами по исключениям">
                              {conflictRecipes.map((recipe) => (
                                <option key={recipe.id} value={recipe.id}>
                                  {recipe.title}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>

                        {selectedRecipe ? (
                          <div className="meal-card-body">
                            <img alt={selectedRecipe.title} className="meal-card-image" src={selectedRecipe.imageUrl} />
                            <div className="meal-card-content">
                              <div className="meal-card-title-row">
                                <h4>{selectedRecipe.title}</h4>
                                <span className="mini-chip">{selectedRecipe.cuisine}</span>
                              </div>
                              <p className="slot-caption">{selectedRecipe.description}</p>
                              <div className="meta-row meal-card-meta">
                                <span><Clock3 size={14} /> {selectedRecipe.cookingTime} мин</span>
                                <span><Users size={14} /> {selectedRecipe.servings} порц.</span>
                              </div>
                              <div className="ingredient-preview">
                                {selectedRecipe.ingredients.slice(0, 3).map((ingredient) => (
                                  <span className="mini-chip" key={ingredient.id}>{ingredient.name}</span>
                                ))}
                              </div>
                              <div className="meal-card-actions">
                                <button className="secondary-button action-button" type="button">
                                  <Sparkles size={14} /> Заменить
                                </button>
                                <button
                                  className="secondary-button action-button danger-button"
                                  onClick={() => removeRecipeFromSlot(day, slot)}
                                  type="button"
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="meal-card-empty-state">
                            <p className="slot-caption">{MEAL_SLOT_LABELS[slot]} пока не выбран.</p>
                            <span className="subtext">Добавь блюдо с фото, чтобы неделя читалась быстрее.</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
