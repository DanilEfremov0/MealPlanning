import type { Recipe } from '../../types';
import { AlternativeRow } from '../molecules/AlternativeRow';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Завтрак',
  lunch:     'Обед',
  dinner:    'Ужин',
};

interface Props {
  dayIndex: number;
  mealType: string;
  alternatives: Recipe[];
  onSelect: (r: Recipe) => void;
  onClose: () => void;
}

export function SwapBottomSheet({ dayIndex, mealType, alternatives, onSelect, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px]
                   shadow-[var(--shadow-sheet)] max-w-md mx-auto
                   animate-[slideUp_0.3s_ease]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-200" />
        </div>

        <div className="px-4 pb-6">
          <p className="text-xs text-neutral-400 mb-1">{DAYS[dayIndex]} · {MEAL_LABELS[mealType]}</p>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Заменить блюдо</h2>

          {alternatives.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-6">Нет альтернатив с вашими ограничениями</p>
          ) : (
            <div className="flex flex-col gap-2">
              {alternatives.map(r => (
                <AlternativeRow key={r.id} recipe={r} onSelect={() => onSelect(r)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
