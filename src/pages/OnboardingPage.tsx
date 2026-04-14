import { useStore } from '../store/useStore';
import { AllergenChip } from '../components/atoms/AllergenChip';
import { track } from '../lib/analytics';
import type { AllergenKey } from '../types';

const ALL_ALLERGENS: AllergenKey[] = ['gluten', 'dairy', 'nuts', 'eggs', 'seafood', 'soy'];

export function OnboardingPage() {
  const allergens     = useStore(s => s.allergens);
  const toggleAllergen = useStore(s => s.toggleAllergen);
  const completeOnboarding = useStore(s => s.completeOnboarding);

  const handleToggle = (a: AllergenKey) => {
    track.allergenToggled(a, !allergens.includes(a));
    toggleAllergen(a);
  };

  const handleGenerate = () => {
    track.scheduleGenerated(allergens.length);
    completeOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div
        className="flex flex-col items-center justify-center px-6 pt-16 pb-10 text-center"
        style={{ background: 'var(--color-hero-dark)' }}
      >
        <div className="text-5xl mb-4">🥗</div>
        <h1 className="text-2xl font-bold text-white mb-2">Ваш план питания</h1>
        <p className="text-sm text-white/60 max-w-xs">
          Персональное меню на неделю с учётом ваших пищевых ограничений
        </p>
      </div>

      {/* Allergen picker */}
      <div className="flex-1 bg-white rounded-t-[20px] -mt-4 px-4 pt-6 pb-8">
        <h2 className="text-base font-semibold text-neutral-800 mb-1">
          Что исключить из меню?
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          Выберите продукты, которых нужно избегать
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_ALLERGENS.map(a => (
            <AllergenChip
              key={a}
              allergen={a}
              selected={allergens.includes(a)}
              onToggle={() => handleToggle(a)}
            />
          ))}
        </div>

        {allergens.length > 0 && (
          <div className="mb-4 p-3 bg-green-bg border border-green-light rounded-xl">
            <p className="text-sm text-green-dark font-medium">
              ✅ Исключено: {allergens.length} позиц.
            </p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="w-full py-4 bg-green-dark text-white font-semibold rounded-[16px]
                     hover:bg-green-primary transition-colors active:scale-[.98]
                     focus:outline-none focus:ring-2 focus:ring-green-dark focus:ring-offset-2"
        >
          Составить меню
        </button>

        <p className="text-xs text-neutral-400 text-center mt-3">
          Вы всегда можете изменить настройки позже
        </p>
      </div>
    </div>
  );
}
