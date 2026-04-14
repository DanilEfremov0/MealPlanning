import type { Recipe } from '../../types';

interface Props {
  recipe: Recipe;
  onSelect: () => void;
}

export function AlternativeRow({ recipe, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200
                 hover:border-green-primary hover:bg-green-bg transition-colors text-left"
    >
      <span className="text-2xl">{recipe.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-800 truncate">{recipe.name}</p>
        <p className="text-xs text-neutral-400">{recipe.calories} ккал</p>
      </div>
      <span className="text-green-dark text-sm font-medium">Выбрать</span>
    </button>
  );
}
