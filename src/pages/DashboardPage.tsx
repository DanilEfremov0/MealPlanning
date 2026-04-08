import { Link } from 'react-router-dom'
import { AlertTriangle, CalendarRange, ChefHat, ShieldAlert, ShoppingBasket } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useShoppingList, useMealPlanningStore } from '../store/useMealPlanningStore'
import { recipeMatchesExclusions } from '../lib/utils'

export function DashboardPage() {
  const recipes = useMealPlanningStore((state) => state.recipes)
  const exclusions = useMealPlanningStore((state) => state.preferences.excludedIngredients)
  const weekPlan = useMealPlanningStore((state) => state.weekPlan)
  const shoppingList = useShoppingList()

  const plannedMeals = Object.values(weekPlan).flatMap((day) => Object.values(day)).filter(Boolean).length
  const conflictingRecipes = recipes.filter((recipe) => recipeMatchesExclusions(recipe, exclusions))
  const completionRate = Math.round((plannedMeals / 21) * 100)

  return (
    <div className="page-stack">
      <section className="hero-card glass-panel">
        <div>
          <span className="eyebrow">Weekly flow</span>
          <h1>Plan meals, catch exclusions, and shop from one clean view.</h1>
          <p>
            The product is already usable as a meal planning MVP and is now shifting into deeper quality and UX iterations.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/planner">
              Open planner
            </Link>
            <Link className="secondary-button" to="/recipes">
              Manage recipes
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="card stat-card"><ChefHat size={20} /><strong>{recipes.length}</strong><span>Recipes saved</span></div>
        <div className="card stat-card"><CalendarRange size={20} /><strong>{plannedMeals}</strong><span>Meals planned</span></div>
        <div className="card stat-card"><ShoppingBasket size={20} /><strong>{shoppingList.length}</strong><span>Shopping items</span></div>
        <div className="card stat-card"><ShieldAlert size={20} /><strong>{exclusions.length}</strong><span>Exclusions tracked</span></div>
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <SectionHeader
            eyebrow="Planner status"
            title="Weekly completion"
            description="Track how much of the week is already planned."
          />
          <div className="progress-card">
            <div className="progress-row">
              <strong>{completionRate}% complete</strong>
              <span>{plannedMeals}/21 slots filled</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>

        <div className="card">
          <SectionHeader
            eyebrow="Attention"
            title="Recipes with conflicts"
            description="Saved exclusions surface recipes that may need substitution."
          />
          {conflictingRecipes.length ? (
            <div className="stack-list">
              {conflictingRecipes.slice(0, 4).map((recipe) => (
                <div className="list-item" key={recipe.id}>
                  <div>
                    <strong>{recipe.title}</strong>
                    <p>{recipe.cuisine}</p>
                  </div>
                  <span className="warning-badge"><AlertTriangle size={14} /> review</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No recipe conflicts with current exclusions.</div>
          )}
        </div>
      </section>

      <section className="card">
        <SectionHeader
          eyebrow="Recommended order"
          title="Use the product flow"
          description="Start with recipes, map the week, then review the merged shopping list."
        />
        <div className="journey-grid">
          <Link className="journey-step" to="/recipes">1. Build your recipe base</Link>
          <Link className="journey-step" to="/planner">2. Fill the weekly planner</Link>
          <Link className="journey-step" to="/shopping-list">3. Review shopping list</Link>
        </div>
      </section>
    </div>
  )
}
