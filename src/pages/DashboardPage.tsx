import { Link } from 'react-router-dom'
import { CalendarRange, ChefHat, ShieldAlert, ShoppingBasket } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useShoppingList, useMealPlanningStore } from '../store/useMealPlanningStore'

export function DashboardPage() {
  const recipes = useMealPlanningStore((state) => state.recipes)
  const exclusions = useMealPlanningStore((state) => state.preferences.excludedIngredients)
  const weekPlan = useMealPlanningStore((state) => state.weekPlan)
  const shoppingList = useShoppingList()

  const plannedMeals = Object.values(weekPlan).flatMap((day) => Object.values(day)).filter(Boolean).length

  return (
    <div className="page-stack">
      <section className="hero-card glass-panel">
        <div>
          <span className="eyebrow">Weekly flow</span>
          <h1>Plan meals, catch exclusions, and shop from one clean view.</h1>
          <p>
            This MVP is optimized for one user who wants a beautiful but practical weekly meal planning
            workflow.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/planner">
              Open planner
            </Link>
            <Link className="secondary-button" to="/recipes">
              Add recipes
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
