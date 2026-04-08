import { Link } from 'react-router-dom'
import { AlertTriangle, CalendarRange, ChefHat, ShieldAlert, ShoppingBasket } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { DAYS } from '../lib/constants'
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
  const nextStep =
    recipes.length === 0
      ? { label: 'Add your first recipe', to: '/recipes' }
      : plannedMeals === 0
        ? { label: 'Build this week in the planner', to: '/planner' }
        : { label: 'Review your shopping list', to: '/shopping-list' }

  return (
    <div className="page-stack">
      <section className="hero-card glass-panel hero-grid">
        <div>
          <span className="eyebrow">Weekly flow</span>
          <h1>Plan meals, catch exclusions, and shop from one clean view.</h1>
          <p>
            The app already covers the full MVP loop. The biggest wins now are clearer status, faster planning,
            and lower friction on mobile.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/planner">
              Open planner
            </Link>
            <Link className="secondary-button" to={nextStep.to}>
              {nextStep.label}
            </Link>
          </div>
        </div>

        <div className="hero-sidecard">
          <span className="eyebrow">Right now</span>
          <strong>{completionRate}% of the week is mapped</strong>
          <p>{shoppingList.length} shopping items will update as soon as you change the planner.</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="card stat-card"><ChefHat size={20} /><strong>{recipes.length}</strong><span>Recipes saved</span></div>
        <div className="card stat-card"><CalendarRange size={20} /><strong>{plannedMeals}</strong><span>Meals planned</span></div>
        <div className="card stat-card"><ShoppingBasket size={20} /><strong>{shoppingList.length}</strong><span>Shopping items</span></div>
        <div className="card stat-card"><ShieldAlert size={20} /><strong>{exclusions.length}</strong><span>Exclusions tracked</span></div>
      </section>

      <section className="dashboard-grid dashboard-grid-wide">
        <div className="card">
          <SectionHeader
            eyebrow="Planner status"
            title="Weekly completion"
            description="Track how much of the week is already planned. A full grid means faster shopping and less last-minute stress."
          />
          <div className="progress-card">
            <div className="progress-row">
              <strong>{completionRate}% complete</strong>
              <span>{plannedMeals}/21 slots filled</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionRate}%` }} />
            </div>
            <div className="week-mini-grid">
              {DAYS.map((day) => {
                const filledSlots = Object.values(weekPlan[day] ?? {}).filter(Boolean).length
                return (
                  <div className="mini-day-card" key={day}>
                    <strong>{day.slice(0, 3)}</strong>
                    <span>{filledSlots}/3 meals</span>
                  </div>
                )
              })}
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
