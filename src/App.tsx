import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { fetchRecipes } from './lib/firestore';
import { track } from './lib/analytics';
import { OnboardingPage } from './pages/OnboardingPage';
import { SchedulePage } from './pages/SchedulePage';
import { ShoppingPage } from './pages/ShoppingPage';

type Tab = 'schedule' | 'shopping';

export default function App() {
  const onboardingComplete = useStore(s => s.onboardingComplete);
  const setRecipes         = useStore(s => s.setRecipes);
  const allergens          = useStore(s => s.allergens);
  const [tab, setTab]      = useState<Tab>('schedule');
  const [loaded, setLoaded] = useState(false);
  const [error, setError]  = useState<string | null>(null);

  useEffect(() => {
    track.onboardingStart();
    fetchRecipes()
      .then(r => {
        setRecipes(r);
        setLoaded(true);
      })
      .catch(err => {
        console.error(err);
        setError('Не удалось загрузить рецепты. Проверьте соединение.');
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-dark">
        <div className="flex flex-col items-center gap-3 text-white/60">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <p className="text-sm">Загрузка рецептов…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
        <div className="text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-sm text-neutral-600 mt-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-green-dark font-medium underline"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!onboardingComplete) return <OnboardingPage />;

  return (
    <>
      {tab === 'schedule'
        ? <SchedulePage onNavigateShopping={() => setTab('shopping')} />
        : <ShoppingPage onNavigateSchedule={() => setTab('schedule')} />
      }
    </>
  );
}
