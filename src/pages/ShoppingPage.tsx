import { useStore } from '../store/useStore';
import { ShoppingList } from '../components/organisms/ShoppingList';
import { BottomNav } from '../components/molecules/BottomNav';
import { track } from '../lib/analytics';

interface Props {
  onNavigateSchedule: () => void;
}

export function ShoppingPage({ onNavigateSchedule }: Props) {
  const shoppingItems    = useStore(s => s.shoppingItems);
  const toggleShoppingItem = useStore(s => s.toggleShoppingItem);

  const handleToggle = (id: string) => {
    const item = shoppingItems.find(i => i.id === id);
    if (item) track.shoppingItemToggled(item.name);
    toggleShoppingItem(id);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 bg-white border-b border-neutral-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-base font-semibold text-neutral-800">Список покупок</h1>
          <p className="text-xs text-neutral-400">{shoppingItems.length} позиций на неделю</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        {shoppingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3">🛒</span>
            <p className="text-sm text-neutral-400">Список пуст.<br/>Сначала составьте меню.</p>
          </div>
        ) : (
          <ShoppingList items={shoppingItems} onToggle={handleToggle} />
        )}
      </main>

      <BottomNav
        activeTab="shopping"
        onSchedule={onNavigateSchedule}
        onShopping={() => {}}
      />
    </div>
  );
}
