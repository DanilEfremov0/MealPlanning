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
  title: z.string().min(3, 'Use at least 3 characters for the recipe name.'),
  description: z.string().min(10, 'Add a short description so the recipe is easy to recognize.'),
  imageUrl: z.string().url('Paste a valid image URL.'),
  cookingTime: z.coerce.number<number>().min(5, 'Cooking time should be at least 5 minutes.'),
  servings: z.coerce.number<number>().min(1, 'Servings should be at least 1.'),
  cuisine: z.string().min(2, 'Cuisine should be at least 2 characters.'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  ingredientsText: z.string().min(5, 'Add at least one ingredient.'),
  stepsText: z.string().min(5, 'Add at least one cooking step.'),
})

type RecipeFormValues = z.output<typeof recipeSchema>
type FilterMode = 'all' | 'safe' | 'conflicts'

const defaultValues: RecipeFormValues = {
  title: '',
  description: '',
  imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  cookingTime: 30,
  servings: 2,
  cuisine: 'European',
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
          eyebrow="Recipe base"
          title="Catalog and maintain your weekly meal library"
          description={`You currently have ${recipes.length} recipes. ${conflictingCount} conflict with saved exclusions.`}
        />

        <div className="toolbar-row toolbar-card">
          <label className="search-box">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title, cuisine, or ingredient"
            />
          </label>
          <div className="filter-chips">
            {[
              { key: 'all', label: `All (${recipes.length})` },
              { key: 'safe', label: `Safe (${recipes.length - conflictingCount})` },
              { key: 'conflicts', label: `Conflicts (${conflictingCount})` },
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
                        <AlertTriangle size={14} /> exclusion match
                      </span>
                    )}
                  </div>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <div className="meta-row">
                    <span><Clock3 size={14} /> {recipe.cookingTime} min</span>
                    <span><Users size={14} /> {recipe.servings} servings</span>
                  </div>
                  <div className="ingredient-preview">
                    {recipe.ingredients.slice(0, 4).map((ingredient) => (
                      <span className="mini-chip" key={ingredient.id}>{ingredient.name}</span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <button className="secondary-button action-button" onClick={() => startEditing(recipe)} type="button">
                      <Pencil size={14} /> Edit
                    </button>
                    <button className="secondary-button action-button danger-button" onClick={() => deleteRecipe(recipe.id)} type="button">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {!filteredRecipes.length && <div className="empty-state">No recipes match your current search or filter.</div>}
      </section>

      <section className="card sticky-card">
        <SectionHeader
          eyebrow={editingRecipeId ? 'Edit recipe' : 'Add recipe'}
          title={editingRecipeId ? 'Update an existing recipe' : 'Create a recipe through the UI'}
          description="Use one ingredient per line in the format name | quantity | unit. This makes shopping aggregation much more reliable."
          action={<Plus size={18} />}
        />

        <form className="form-grid" onSubmit={form.handleSubmit(onSubmit)}>
          <label>
            <span>Title</span>
            <input {...form.register('title')} />
            {form.formState.errors.title && <span className="field-error">{form.formState.errors.title.message}</span>}
          </label>
          <label>
            <span>Description</span>
            <textarea rows={3} {...form.register('description')} />
            {form.formState.errors.description && <span className="field-error">{form.formState.errors.description.message}</span>}
          </label>
          <label>
            <span>Image URL</span>
            <input {...form.register('imageUrl')} />
            {form.formState.errors.imageUrl && <span className="field-error">{form.formState.errors.imageUrl.message}</span>}
          </label>
          <div className="inline-fields">
            <label>
              <span>Time</span>
              <input type="number" {...form.register('cookingTime')} />
              {form.formState.errors.cookingTime && <span className="field-error">{form.formState.errors.cookingTime.message}</span>}
            </label>
            <label>
              <span>Servings</span>
              <input type="number" {...form.register('servings')} />
              {form.formState.errors.servings && <span className="field-error">{form.formState.errors.servings.message}</span>}
            </label>
          </div>
          <div className="inline-fields">
            <label>
              <span>Cuisine</span>
              <input {...form.register('cuisine')} />
              {form.formState.errors.cuisine && <span className="field-error">{form.formState.errors.cuisine.message}</span>}
            </label>
            <label>
              <span>Meal type</span>
              <select {...form.register('mealType')}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </label>
          </div>
          <label>
            <span>Ingredients</span>
            <textarea rows={6} {...form.register('ingredientsText')} />
            <span className="field-hint">Example: tomatoes | 3 | pcs</span>
            {form.formState.errors.ingredientsText && <span className="field-error">{form.formState.errors.ingredientsText.message}</span>}
          </label>
          <label>
            <span>Steps</span>
            <textarea rows={5} {...form.register('stepsText')} />
            {form.formState.errors.stepsText && <span className="field-error">{form.formState.errors.stepsText.message}</span>}
          </label>
          <div className="card-actions">
            <button className="primary-button" type="submit">{editingRecipeId ? 'Update recipe' : 'Save recipe'}</button>
            {editingRecipeId && (
              <button className="secondary-button action-button" onClick={resetForm} type="button">Cancel editing</button>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
