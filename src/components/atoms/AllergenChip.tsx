import type { AllergenKey } from '../../types';

const LABELS: Record<AllergenKey, { label: string; emoji: string }> = {
  gluten:  { label: 'Глютен',  emoji: '🌾' },
  dairy:   { label: 'Молочное', emoji: '🥛' },
  nuts:    { label: 'Орехи',   emoji: '🥜' },
  eggs:    { label: 'Яйца',    emoji: '🥚' },
  seafood: { label: 'Морепродукты', emoji: '🦐' },
  soy:     { label: 'Соя',     emoji: '🫘' },
};

interface Props {
  allergen: AllergenKey;
  selected: boolean;
  onToggle: () => void;
}

export function AllergenChip({ allergen, selected, onToggle }: Props) {
  const { label, emoji } = LABELS[allergen];
  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      className={[
        'flex items-center gap-2 px-4 py-2 rounded-[20px] text-sm font-medium transition-all',
        'border focus:outline-none focus:ring-2 focus:ring-green-dark focus:ring-offset-2',
        selected
          ? 'bg-green-light border-green-dark text-green-dark'
          : 'bg-white border-neutral-200 text-neutral-600',
      ].join(' ')}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
