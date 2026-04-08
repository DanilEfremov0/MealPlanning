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
          eyebrow="Объединённые ингредиенты"
          title="Один список покупок на всю неделю"
          description={`Повторяющиеся ингредиенты объединяются автоматически. Отмечено ${checkedCount} из ${shoppingList.length} позиций.`}
          action={
            <button className="secondary-button action-button" onClick={resetShoppingChecks} type="button">
              <Undo2 size={14} /> Сбросить отметки
            </button>
          }
        />
        {shoppingList.length === 0 ? (
          <div className="empty-state">Запланируй хотя бы одно блюдо, чтобы появился список покупок.</div>
        ) : (
          <>
            <div className="shopping-overview-grid">
              <div className="shopping-summary card subtle">
                <div>
                  <span className="eyebrow">Сводка</span>
                  <h3>Покупки на текущую неделю</h3>
                  <p>{shoppingList.length} объединённых ингредиентов по текущему плану.</p>
                </div>
                <ShoppingCart size={24} />
              </div>
              <div className="card subtle progress-card compact">
                <span className="eyebrow">Progress</span>
                <div className="progress-row">
                  <strong>{completionRate}% собрано</strong>
                  <span>{checkedCount} отмечено</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${completionRate}%` }} />
                </div>
                <span className="subtext">{riskyCount} позиций совпадают с сохранёнными исключениями.</span>
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
                    <p>Используется в: {item.recipeTitles.join(', ')}</p>
                    {item.conflictsWithExclusions && <span className="warning-badge">совпадает с исключением</span>}
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
