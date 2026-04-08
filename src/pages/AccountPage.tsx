import { SectionHeader } from '../components/ui/SectionHeader'
import { useMealPlanningStore } from '../store/useMealPlanningStore'

export function AccountPage() {
  const preferences = useMealPlanningStore((state) => state.preferences)
  const recipes = useMealPlanningStore((state) => state.recipes)
  const weekPlan = useMealPlanningStore((state) => state.weekPlan)

  const plannedMeals = Object.values(weekPlan).flatMap((day) => Object.values(day)).filter(Boolean).length

  return (
    <div className="page-stack">
      <section className="card account-card">
        <SectionHeader
          eyebrow="Профиль"
          title="Настройки и ограничения"
          description="Авторизация появится позже, но уже сейчас здесь живут персональные исключения и состояние текущего плана."
        />
        <div className="stats-grid stats-grid-compact">
          <div className="card stat-card subtle"><strong>{preferences.excludedIngredients.length}</strong><span>Сохранённых исключений</span></div>
          <div className="card stat-card subtle"><strong>{recipes.length}</strong><span>Рецептов в библиотеке</span></div>
          <div className="card stat-card subtle"><strong>{plannedMeals}</strong><span>Запланированных слотов</span></div>
        </div>
        <div className="account-summary">
          <div className="account-box">
            <span className="eyebrow">Сохранённые исключения</span>
            <div className="chip-grid">
              {preferences.excludedIngredients.length ? (
                preferences.excludedIngredients.map((item) => <span className="chip chip-static" key={item}>{item}</span>)
              ) : (
                <span>Пока исключения не выбраны.</span>
              )}
            </div>
          </div>
          <div className="account-box">
            <span className="eyebrow">Текущее использование</span>
            <ul>
              <li>{recipes.length} рецептов в библиотеке</li>
              <li>{plannedMeals} слотов запланировано на неделю</li>
              <li>Локальное хранение уже готово к будущей синхронизации</li>
            </ul>
          </div>
          <div className="account-box full-span">
            <span className="eyebrow">Что можно добавить позже</span>
            <ul>
              <li>Авторизация и синхронизация аккаунта</li>
              <li>Сохранённые любимые планы</li>
              <li>Профили семьи или домохозяйства</li>
              <li>Общий список покупок и повторяющиеся шаблоны недели</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
