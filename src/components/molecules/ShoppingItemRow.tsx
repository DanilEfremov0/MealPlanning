import type { ShoppingItem } from '../../types';

interface Props {
  item: ShoppingItem;
  onToggle: () => void;
}

export function ShoppingItemRow({ item, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 py-2.5 text-left"
    >
      <span
        className={[
          'w-5 h-5 rounded flex-shrink-0 border-2 transition-colors flex items-center justify-center',
          item.checked ? 'bg-green-primary border-green-primary' : 'border-neutral-300',
        ].join(' ')}
      >
        {item.checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className={[
        'flex-1 text-sm',
        item.checked ? 'text-neutral-400 line-through' : 'text-neutral-800',
      ].join(' ')}>
        {item.name}
      </span>
      <span className="text-xs text-neutral-400">{item.amount}</span>
    </button>
  );
}
