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
          eyebrow="Account"
          title="Future personal cabinet"
          description="Authentication comes later, but this area already holds user-specific preferences and future profile space."
        />
        <div className="stats-grid stats-grid-compact">
          <div className="card stat-card subtle"><strong>{preferences.excludedIngredients.length}</strong><span>Saved exclusions</span></div>
          <div className="card stat-card subtle"><strong>{recipes.length}</strong><span>Recipes in library</span></div>
          <div className="card stat-card subtle"><strong>{plannedMeals}</strong><span>Planned meal slots</span></div>
        </div>
        <div className="account-summary">
          <div className="account-box">
            <span className="eyebrow">Saved exclusions</span>
            <div className="chip-grid">
              {preferences.excludedIngredients.length ? (
                preferences.excludedIngredients.map((item) => <span className="chip chip-static" key={item}>{item}</span>)
              ) : (
                <span>No exclusions selected yet.</span>
              )}
            </div>
          </div>
          <div className="account-box">
            <span className="eyebrow">Current usage</span>
            <ul>
              <li>{recipes.length} recipes in your library</li>
              <li>{plannedMeals} meal slots planned this week</li>
              <li>Local-first persistence ready for future account sync</li>
            </ul>
          </div>
          <div className="account-box full-span">
            <span className="eyebrow">Planned future additions</span>
            <ul>
              <li>Authentication and account sync</li>
              <li>Saved favorite plans</li>
              <li>Household profiles</li>
              <li>Shared shopping and recurring meal templates</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
