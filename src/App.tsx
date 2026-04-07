import { NavLink, Route, Routes } from 'react-router-dom'
import { CalendarDays, ClipboardList, LayoutDashboard, Salad, Settings2 } from 'lucide-react'
import { useMemo } from 'react'
import { useMealPlanningStore } from './store/useMealPlanningStore'
import { DashboardPage } from './pages/DashboardPage'
import { RecipesPage } from './pages/RecipesPage'
import { PlannerPage } from './pages/PlannerPage'
import { ShoppingListPage } from './pages/ShoppingListPage'
import { AccountPage } from './pages/AccountPage'
import { OnboardingModal } from './features/onboarding/OnboardingModal'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recipes', label: 'Recipes', icon: Salad },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/shopping-list', label: 'Shopping List', icon: ClipboardList },
  { to: '/account', label: 'Account', icon: Settings2 },
]

export default function App() {
  const hasCompletedOnboarding = useMealPlanningStore((state) => state.preferences.hasCompletedOnboarding)
  const exclusions = useMealPlanningStore((state) => state.preferences.excludedIngredients)
  const recipes = useMealPlanningStore((state) => state.recipes)
  const plan = useMealPlanningStore((state) => state.weekPlan)

  const plannedMeals = useMemo(
    () => Object.values(plan).flatMap((day) => Object.values(day)).filter(Boolean).length,
    [plan],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar glass-panel">
        <div>
          <div className="brand-mark">MP</div>
          <h1>MealPlanning</h1>
          <p>Weekly planning with recipes, exclusions, and one smart grocery list.</p>
        </div>

        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-summary card compact">
          <span className="eyebrow">Current snapshot</span>
          <strong>{recipes.length} recipes in library</strong>
          <span>{plannedMeals} meals planned this week</span>
          <span>{exclusions.length} ingredient exclusions saved</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar glass-panel">
          <div>
            <span className="eyebrow">MVP</span>
            <h2>Meal planning command center</h2>
          </div>
          <div className="topbar-badge">
            {hasCompletedOnboarding ? 'Preferences saved' : 'Onboarding required'}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>

      {!hasCompletedOnboarding && <OnboardingModal />}
    </div>
  )
}
