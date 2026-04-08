import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Salad,
  Settings2,
  Sparkles,
} from 'lucide-react'
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

const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/': {
    eyebrow: 'Overview',
    title: 'Meal planning command center',
    description: 'Track recipes, weekly coverage, and shopping progress from one place.',
  },
  '/recipes': {
    eyebrow: 'Library',
    title: 'Recipe workspace',
    description: 'Curate recipes, spot conflicts early, and keep the catalog tidy.',
  },
  '/planner': {
    eyebrow: 'Weekly plan',
    title: 'Planner',
    description: 'Assign meals by day and keep exclusions visible while planning.',
  },
  '/shopping-list': {
    eyebrow: 'Groceries',
    title: 'Shopping list',
    description: 'Use the merged weekly list and mark items as you shop.',
  },
  '/account': {
    eyebrow: 'Preferences',
    title: 'Account snapshot',
    description: 'Review exclusions, current usage, and future account features.',
  },
}

export default function App() {
  const location = useLocation()
  const hasCompletedOnboarding = useMealPlanningStore((state) => state.preferences.hasCompletedOnboarding)
  const exclusions = useMealPlanningStore((state) => state.preferences.excludedIngredients)
  const recipes = useMealPlanningStore((state) => state.recipes)
  const plan = useMealPlanningStore((state) => state.weekPlan)

  const plannedMeals = useMemo(
    () => Object.values(plan).flatMap((day) => Object.values(day)).filter(Boolean).length,
    [plan],
  )

  const currentPage = pageMeta[location.pathname] ?? pageMeta['/']

  return (
    <div className="app-shell">
      <aside className="sidebar glass-panel">
        <div className="sidebar-main">
          <div>
            <div className="brand-mark">MP</div>
            <h1>MealPlanning</h1>
            <p>Weekly planning with recipes, exclusions, and one smart grocery list.</p>
          </div>

          <div className="sidebar-highlight">
            <span className="eyebrow">This week</span>
            <strong>{plannedMeals}/21 slots filled</strong>
            <span>{recipes.length} recipes ready to use</span>
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
        </div>

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
            <span className="eyebrow">{currentPage.eyebrow}</span>
            <h2>{currentPage.title}</h2>
            <p>{currentPage.description}</p>
          </div>
          <div className="topbar-status-group">
            <div className="topbar-badge topbar-badge-neutral">
              <Sparkles size={14} /> Local-first MVP
            </div>
            <div className="topbar-badge">
              {hasCompletedOnboarding ? 'Preferences saved' : 'Onboarding required'}
            </div>
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
