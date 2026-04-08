import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { ALLERGEN_OPTIONS } from '../../lib/constants'
import { useMealPlanningStore } from '../../store/useMealPlanningStore'

export function OnboardingModal() {
  const completeOnboarding = useMealPlanningStore((state) => state.completeOnboarding)
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (item: string) => {
    setSelected((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    )
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <div className="modal-header">
          <div className="brand-mark brand-mark-small">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="eyebrow">Добро пожаловать</span>
            <h2>Сначала выбери исключения по ингредиентам</h2>
          </div>
        </div>
        <p>
          Этот список нужен, чтобы заранее подсвечивать конфликты в рецептах и делать список покупок безопаснее.
        </p>

        <div className="chip-grid">
          {ALLERGEN_OPTIONS.map((item) => (
            <button
              key={item}
              className={`chip ${selected.includes(item) ? 'chip-active' : ''}`}
              onClick={() => toggle(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <span className="subtext">{selected.length ? `Выбрано исключений: ${selected.length}` : 'Можно продолжить и без исключений.'}</span>
          <button className="primary-button" onClick={() => completeOnboarding(selected)} type="button">
            Сохранить и продолжить
          </button>
        </div>
      </div>
    </div>
  )
}
