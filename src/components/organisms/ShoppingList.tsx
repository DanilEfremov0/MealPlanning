import type { ShoppingItem } from '../../types';
import { ShoppingItemRow } from '../molecules/ShoppingItemRow';

const CATEGORY_LABELS: Record<ShoppingItem['category'], { label: string; emoji: string }> = {
  produce:  { label: 'Овощи и фрукты', emoji: '🥦' },
  protein:  { label: 'Мясо и рыба',    emoji: '🥩' },
  dairy:    { label: 'Молочное',        emoji: '🥛' },
  grains:   { label: 'Крупы и хлеб',   emoji: '🌾' },
  pantry:   { label: 'Бакалея',         emoji: '🫙' },
};

interface Props {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
}

export function ShoppingList({ items, onToggle }: Props) {
  const byCategory = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.checked).length;
  const total = items.length;

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
          <span>Куплено {checkedCount} из {total}</span>
          <span>{Math.round((checkedCount / Math.max(total, 1)) * 100)}%</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-primary rounded-full transition-all duration-300"
            style={{ width: `${(checkedCount / Math.max(total, 1)) * 100}%` }}
          />
        </div>
      </div>

      {(Object.keys(CATEGORY_LABELS) as ShoppingItem['category'][])
        .filter(cat => byCategory[cat]?.length)
        .map(cat => (
          <section key={cat}>
            <h3 className="text-sm font-semibold text-neutral-800 mb-2 flex items-center gap-2">
              <span>{CATEGORY_LABELS[cat].emoji}</span>
              <span>{CATEGORY_LABELS[cat].label}</span>
            </h3>
            <div className="bg-white rounded-[16px] border border-neutral-200 px-4 divide-y divide-neutral-100">
              {byCategory[cat].map(item => (
                <ShoppingItemRow key={item.id} item={item} onToggle={() => onToggle(item.id)} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
