import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Clock3, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { recipeMatchesExclusions } from '../lib/utils'
import { useMealPlanningStore } from '../store/useMealPlanningStore'
import type { MealSlot, Recipe } from '../types/domain'

const recipeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  cookingTime: z.coerce.number<number>().min(5),
  servings: z.coerce.number<number>().min(1),
  cuisine: z.string().min(2),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  ingredientsText: z.string().min(5),
  stepsText: z.string().min(5),
})

type RecipeFormValues = z.output<typeof recipeSchema>

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

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues,
  })

  const conflictingCount = useMemo(
    () => recipes.filter((recipe) => recipeMatchesExclusions(recipe, exclusions)).length,
    [recipes, exclusions],
  )

  const startEditing = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id)
    form.reset(serializeRecipe(recipe))
  }

  const resetForm = () => {
    setEditingRecipeId(null)
    form.reset(defaultValues)
  }

  const onSubmit = (values: RecipeFormValues) => {
    const ingredients = values.ingredientsText.split('\n').map((line, index) => {
      const [name, quantity, unit] = line.split('|').map((part) => part.trim())
      return {
        id: `ingredient-${Date.now()}-${index}`,
        name,
        quantity: Number(quantity) || 1,
        unit: unit || 'pcs',
      }
    })

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
        <div className="recipe-grid">
          {recipes.map((recipe) => {
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
      </section>

      <section className="card sticky-card">
        <SectionHeader
          eyebrow={editingRecipeId ? 'Edit recipe' : 'Add recipe'}
          title={editingRecipeId ? 'Update an existing recipe' : 'Create a recipe through the UI'}
          description="Use name | quantity | unit on each ingredient line, similar to structured recipe content on eda.ru."
          action={<Plus size={18} />}
        />

        <form className="form-grid" onSubmit={form.handleSubmit(onSubmit)}>
          <label><span>Title</span><input {...form.register('title')} /></label>
          <label><span>Description</span><textarea rows={3} {...form.register('description')} /></label>
          <label><span>Image URL</span><input {...form.register('imageUrl')} /></label>
          <div className="inline-fields">
            <label><span>Time</span><input type="number" {...form.register('cookingTime')} /></label>
            <label><span>Servings</span><input type="number" {...form.register('servings')} /></label>
          </div>
          <div className="inline-fields">
            <label><span>Cuisine</span><input {...form.register('cuisine')} /></label>
            <label>
              <span>Meal type</span>
              <select {...form.register('mealType')}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </label>
          </div>
          <label><span>Ingredients</span><textarea rows={6} {...form.register('ingredientsText')} /></label>
          <label><span>Steps</span><textarea rows={5} {...form.register('stepsText')} /></label>
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
