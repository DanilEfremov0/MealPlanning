import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { CalendarDays, ClipboardList, Salad, Settings2, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useMealPlanningStore } from './store/useMealPlanningStore'
import { RecipesPage } from './pages/RecipesPage'
import { PlannerPage } from './pages/PlannerPage'
import { ShoppingListPage } from './pages/ShoppingListPage'
import { AccountPage } from './pages/AccountPage'
import { OnboardingModal } from './features/onboarding/OnboardingModal'

const navItems = [
  { to: '/', label: 'Планер', icon: CalendarDays },
  { to: '/recipes', label: 'Рецепты', icon: Salad },
  { to: '/shopping-list', label: 'Покупки', icon: ClipboardList },
  { to: '/account', label: 'Профиль', icon: Settings2 },
]

const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/': {
    eyebrow: 'План недели',
    title: 'Планер питания',
    description: 'Собирай меню на неделю, быстро замечай конфликты и переходи к покупкам.',
  },
  '/recipes': {
    eyebrow: 'Библиотека',
    title: 'Рецепты',
    description: 'Храни любимые блюда, фото и состав, чтобы быстро добавлять их в план.',
  },
  '/shopping-list': {
    eyebrow: 'Покупки',
    title: 'Список покупок',
    description: 'Все ингредиенты недели в одном месте, уже объединённые по позициям.',
  },
  '/account': {
    eyebrow: 'Настройки',
    title: 'Профиль и ограничения',
    description: 'Проверь исключения, наполнение недели и базовые настройки приложения.',
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
            <p>План питания на неделю, рецепты под рукой и один понятный список покупок.</p>
          </div>

          <div className="sidebar-highlight">
            <span className="eyebrow">Эта неделя</span>
            <strong>{plannedMeals}/21 приёмов пищи заполнено</strong>
            <span>{recipes.length} рецептов готово к использованию</span>
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
          <span className="eyebrow">Кратко</span>
          <strong>{recipes.length} рецептов в библиотеке</strong>
          <span>{plannedMeals} приёмов пищи запланировано</span>
          <span>{exclusions.length} исключений сохранено</span>
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
              <Sparkles size={14} /> Локальный MVP
            </div>
            <div className="topbar-badge">
              {hasCompletedOnboarding ? 'Предпочтения сохранены' : 'Нужна первичная настройка'}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<PlannerPage />} />
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
