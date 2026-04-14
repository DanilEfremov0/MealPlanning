interface Props {
  activeTab: 'schedule' | 'shopping';
  onSchedule: () => void;
  onShopping: () => void;
}

export function BottomNav({ activeTab, onSchedule, onShopping }: Props) {
  const tab = (id: 'schedule' | 'shopping', icon: string, label: string, handler: () => void) => (
    <button
      onClick={handler}
      className={[
        'flex flex-col items-center gap-1 flex-1 py-2 text-xs font-medium transition-colors',
        activeTab === id ? 'text-green-dark' : 'text-neutral-400',
      ].join(' ')}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200
                    flex max-w-md mx-auto safe-bottom">
      {tab('schedule', '📅', 'Расписание', onSchedule)}
      {tab('shopping', '🛒', 'Покупки',   onShopping)}
    </nav>
  );
}
