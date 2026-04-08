import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Clock3, Pencil, Plus, Search, Trash2, Users } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { recipeMatchesExclusions } from '../lib/utils'
import { useMealPlanningStore } from '../store/useMealPlanningStore'
import type { MealSlot, Recipe } from '../types/domain'

const recipeSchema = z.object({
  title: z.string().min(3, 'Название должно быть не короче 3 символов.'),
  description: z.string().min(10, 'Добавь короткое описание, чтобы блюдо было легко узнать.'),
  imageUrl: z.string().url('Вставь корректную ссылку на фото.'),
  cookingTime: z.coerce.number<number>().min(5, 'Время приготовления должно быть не меньше 5 минут.'),
  servings: z.coerce.number<number>().min(1, 'Порций должно быть не меньше 1.'),
  cuisine: z.string().min(2, 'Укажи кухню хотя бы в 2 символа.'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  ingredientsText: z.string().min(5, 'Добавь хотя бы один ингредиент.'),
  stepsText: z.string().min(5, 'Добавь хотя бы один шаг приготовления.'),
})

type RecipeFormValues = z.output<typeof recipeSchema>
type FilterMode = 'all' | 'safe' | 'conflicts'

const defaultValues: RecipeFormValues = {
  title: '',
  description: '',
  imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  cookingTime: 30,
  servings: 2,
  cuisine: 'Европейская',
  mealType: 'dinner',
  ingredientsText: 'tomatoes | 3 | pcs\nolive oil | 2 | tbsp',
  stepsText: 'Prepare ingredients\nCook everything\nServe warm',
}

const serializeRecipe = (recipe: Recipe): RecipeFormValues => ({
  title: recipe.title,
  description: recipe.description,
  imageUrl: recipe.imageUrl,
  cookingTime: recipe.cookingTime,
  servings: recipe.servings,
  cuisine: recipe.cuisine,
  mealType: recipe.mealType,
  ingredientsText: recipe.ingredients.map((item) => `${item.name} | ${item.quantity} | ${item.unit}`).join('\n'),
  stepsText: recipe.steps.join('\n'),
})

export function RecipesPage() {
  const recipes = useMealPlanningStore((state) => state.recipes)
  const exclusions = useMealPlanningStore((state) => state.preferences.excludedIngredients)
  const addRecipe = useMealPlanningStore((state) => state.addRecipe)
  const updateRecipe = useMealPlanningStore((state) => state.updateRecipe)
  const deleteRecipe = useMealPlanningStore((state) => state.deleteRecipe)
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues,
  })

  const conflictingCount = useMemo(
    () => recipes.filter((recipe) => recipeMatchesExclusions(recipe, exclusions)).length,
    [recipes, exclusions],
  )

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return recipes.filter((recipe) => {
      const hasConflict = recipeMatchesExclusions(recipe, exclusions)
      const matchesQuery =
        !query ||
        recipe.title.toLowerCase().includes(query) ||
        recipe.cuisine.toLowerCase().includes(query) ||
        recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(query))

      const matchesFilter =
        filterMode === 'all' ||
        (filterMode === 'safe' && !hasConflict) ||
        (filterMode === 'conflicts' && hasConflict)

      return matchesQuery && matchesFilter
    })
  }, [recipes, exclusions, searchQuery, filterMode])

  const startEditing = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id)
    form.reset(serializeRecipe(recipe))
  }

  const resetForm = () => {
    setEditingRecipeId(null)
    form.reset(defaultValues)
  }

  const onSubmit = (values: RecipeFormValues) => {
    const ingredients = values.ingredientsText
      .split('\n')
      .map((line, index) => {
        const [name, quantity, unit] = line.split('|').map((part) => part.trim())
        return {
          id: `ingredient-${Date.now()}-${index}`,
          name,
          quantity: Number(quantity) || 1,
          unit: unit || 'pcs',
        }
      })
      .filter((ingredient) => ingredient.name)

    const steps = values.stepsText.split('\n').map((line) => line.trim()).filter(Boolean)

    const recipe = {
      id: editingRecipeId ?? `recipe-${Date.now()}`,
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      cookingTime: values.cookingTime,
      servings: values.servings,
      cuisine: values.cuisine,
      mealType: values.mealType as MealSlot,
      ingredients,
      steps,
    }

    if (editingRecipeId) {
      updateRecipe(recipe)
    } else {
      addRecipe(recipe)
    }

    resetForm()
  }

  return (
    <div className="page-stack two-column-layout">
      <section className="card">
        <SectionHeader
          eyebrow="База рецептов"
          title="Каталог блюд для недельного плана"
          description={`Сейчас у тебя ${recipes.length} рецептов. ${conflictingCount} из них конфликтуют с сохранёнными исключениями.`}
        />

        <div className="toolbar-row toolbar-card">
          <label className="search-box">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск по названию, кухне или ингредиенту"
            />
          </label>
          <div className="filter-chips">
            {[
              { key: 'all', label: `Все (${recipes.length})` },
              { key: 'safe', label: `Без конфликтов (${recipes.length - conflictingCount})` },
              { key: 'conflicts', label: `Конфликты (${conflictingCount})` },
            ].map((item) => (
              <button
                key={item.key}
                className={`chip ${filterMode === item.key ? 'chip-active' : ''}`}
                onClick={() => setFilterMode(item.key as FilterMode)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => {
            const hasConflict = recipeMatchesExclusions(recipe, exclusions)
            return (
              <article className="recipe-card" key={recipe.id}>
                <img alt={recipe.title} src={recipe.imageUrl} />
                <div className="recipe-card-body">
                  <div className="recipe-card-topline">
                    <span className="eyebrow">{recipe.cuisine}</span>
                    {hasConflict && (
                      <span className="warning-badge">
                        <AlertTriangle size={14} /> конфликт с исключениями
                      </span>
                    )}
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <div className="meta-row">
                    <span><Clock3 size={14} /> {recipe.cookingTime} мин</span>
                    <span><Users size={14} /> {recipe.servings} порц.</span>
                  </div>
                  <div className="ingredient-preview">
                    {recipe.ingredients.slice(0, 4).map((ingredient) => (
                      <span className="mini-chip" key={ingredient.id}>{ingredient.name}</span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <button className="secondary-button action-button" onClick={() => startEditing(recipe)} type="button">
                      <Pencil size={14} /> Изменить
                    </button>
                    <button className="secondary-button action-button danger-button" onClick={() => deleteRecipe(recipe.id)} type="button">
                      <Trash2 size={14} /> Удалить
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {!filteredRecipes.length && <div className="empty-state">По текущему поиску и фильтрам ничего не найдено.</div>}
      </section>

      <section className="card sticky-card">
        <SectionHeader
          eyebrow={editingRecipeId ? 'Редактирование' : 'Новый рецепт'}
          title={editingRecipeId ? 'Обнови существующий рецепт' : 'Добавь рецепт через интерфейс'}
          description="Указывай по одному ингредиенту на строку в формате название | количество | единица. Так список покупок собирается заметно точнее."
          action={<Plus size={18} />}
        />

        <form className="form-grid" onSubmit={form.handleSubmit(onSubmit)}>
          <label>
            <span>Название</span>
            <input {...form.register('title')} />
            {form.formState.errors.title && <span className="field-error">{form.formState.errors.title.message}</span>}
          </label>
          <label>
            <span>Описание</span>
            <textarea rows={3} {...form.register('description')} />
            {form.formState.errors.description && <span className="field-error">{form.formState.errors.description.message}</span>}
          </label>
          <label>
            <span>Ссылка на фото</span>
            <input {...form.register('imageUrl')} />
            {form.formState.errors.imageUrl && <span className="field-error">{form.formState.errors.imageUrl.message}</span>}
          </label>
          <div className="inline-fields">
            <label>
              <span>Время</span>
              <input type="number" {...form.register('cookingTime')} />
              {form.formState.errors.cookingTime && <span className="field-error">{form.formState.errors.cookingTime.message}</span>}
            </label>
            <label>
              <span>Порции</span>
              <input type="number" {...form.register('servings')} />
              {form.formState.errors.servings && <span className="field-error">{form.formState.errors.servings.message}</span>}
            </label>
          </div>
          <div className="inline-fields">
            <label>
              <span>Кухня</span>
              <input {...form.register('cuisine')} />
              {form.formState.errors.cuisine && <span className="field-error">{form.formState.errors.cuisine.message}</span>}
            </label>
            <label>
              <span>Тип приёма пищи</span>
              <select {...form.register('mealType')}>
                <option value="breakfast">Завтрак</option>
                <option value="lunch">Обед</option>
                <option value="dinner">Ужин</option>
              </select>
            </label>
          </div>
          <label>
            <span>Ингредиенты</span>
            <textarea rows={6} {...form.register('ingredientsText')} />
            <span className="field-hint">Пример: помидоры | 3 | шт</span>
            {form.formState.errors.ingredientsText && <span className="field-error">{form.formState.errors.ingredientsText.message}</span>}
          </label>
          <label>
            <span>Шаги приготовления</span>
            <textarea rows={5} {...form.register('stepsText')} />
            {form.formState.errors.stepsText && <span className="field-error">{form.formState.errors.stepsText.message}</span>}
          </label>
          <div className="card-actions">
            <button className="primary-button" type="submit">{editingRecipeId ? 'Обновить рецепт' : 'Сохранить рецепт'}</button>
            {editingRecipeId && (
              <button className="secondary-button action-button" onClick={resetForm} type="button">Отменить редактирование</button>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
