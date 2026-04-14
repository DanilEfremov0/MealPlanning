import type { Recipe } from '../../types';

const ACCENT: Record<Recipe['accentColor'], string> = {
  green:  'bg-green-light  border-green-primary',
  orange: 'bg-orange-light border-orange-primary',
  purple: 'bg-purple-light border-purple-primary',
};

const DOT: Record<Recipe['accentColor'], string> = {
  green:  'bg-green-primary',
  orange: 'bg-orange-primary',
  purple: 'bg-purple-primary',
};

interface Props {
  recipe: Recipe;
  onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: Props) {
  const accent = ACCENT[recipe.accentColor];
  const dot    = DOT[recipe.accentColor];

  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center gap-3 p-3 rounded-[16px] border text-left',
        'shadow-[var(--shadow-card)] transition-transform active:scale-[.98]',
        accent,
      ].join(' ')}
    >
      <span className="text-2xl leading-none">{recipe.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-800 text-sm truncate">{recipe.name}</p>
        <p className="text-xs text-neutral-600 mt-0.5">{recipe.calories} ккал · {recipe.prepTime} мин</p>
      </div>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
    </button>
  );
}
