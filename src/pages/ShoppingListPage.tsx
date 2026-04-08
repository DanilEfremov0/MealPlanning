import { ShoppingCart, Undo2 } from 'lucide-react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useMealPlanningStore, useShoppingList } from '../store/useMealPlanningStore'

export function ShoppingListPage() {
  const shoppingList = useShoppingList()
  const toggleShoppingItem = useMealPlanningStore((state) => state.toggleShoppingItem)
  const resetShoppingChecks = useMealPlanningStore((state) => state.resetShoppingChecks)

  const checkedCount = shoppingList.filter((item) => item.checked).length
  const riskyCount = shoppingList.filter((item) => item.conflictsWithExclusions).length
  const completionRate = shoppingList.length ? Math.round((checkedCount / shoppingList.length) * 100) : 0

  return (
    <div className="page-stack">
      <section className="card">
        <SectionHeader
          eyebrow="Merged ingredients"
          title="One shopping list for the whole week"
          description={`Repeated ingredients are merged when name and unit align. ${checkedCount}/${shoppingList.length} items checked.`}
          action={
            <button className="secondary-button action-button" onClick={resetShoppingChecks} type="button">
              <Undo2 size={14} /> Reset checks
            </button>
          }
        />
        {shoppingList.length === 0 ? (
          <div className="empty-state">Plan at least one recipe to generate a shopping list.</div>
        ) : (
          <>
            <div className="shopping-overview-grid">
              <div className="shopping-summary card subtle">
                <div>
                  <span className="eyebrow">Summary</span>
                  <h3>Weekly shopping workload</h3>
                  <p>{shoppingList.length} aggregated ingredients across the current weekly plan.</p>
                </div>
                <ShoppingCart size={24} />
              </div>
              <div className="card subtle progress-card compact">
                <span className="eyebrow">Progress</span>
                <div className="progress-row">
                  <strong>{completionRate}% complete</strong>
                  <span>{checkedCount} checked</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${completionRate}%` }} />
                </div>
                <span className="subtext">{riskyCount} items match saved exclusions.</span>
              </div>
            </div>
            <div className="shopping-list">
              {shoppingList.map((item) => (
                <label className={`shopping-item ${item.checked ? 'checked' : ''}`} key={item.key}>
                  <input checked={item.checked} onChange={() => toggleShoppingItem(item.key)} type="checkbox" />
                  <div>
                    <div className="shopping-item-header">
                      <strong>{item.name}</strong>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                    <p>Used in: {item.recipeTitles.join(', ')}</p>
                    {item.conflictsWithExclusions && <span className="warning-badge">matches exclusion</span>}
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
