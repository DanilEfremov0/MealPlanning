import { useStore } from '../store/useStore';
import { WeekGrid } from '../components/organisms/WeekGrid';
import { SwapBottomSheet } from '../components/organisms/SwapBottomSheet';
import { BottomNav } from '../components/molecules/BottomNav';
import { track } from '../lib/analytics';
import type { SelectedSlot } from '../types';

interface Props {
  onNavigateShopping: () => void;
}

export function SchedulePage({ onNavigateShopping }: Props) {
  const schedule    = useStore(s => s.schedule);
  const selectedSlot = useStore(s => s.selectedSlot);
  const alternatives = useStore(s => s.alternatives);
  const openSwap    = useStore(s => s.openSwap);
  const closeSwap   = useStore(s => s.closeSwap);
  const confirmSwap = useStore(s => s.confirmSwap);
  const generateNewSchedule = useStore(s => s.generateNewSchedule);

  const handleSlotClick = (slot: SelectedSlot) => {
    track.mealSwapOpened(slot.dayIndex, slot.mealType);
    openSwap(slot);
  };

  const handleRegen = () => {
    track.scheduleRegenerated();
    generateNewSchedule();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-neutral-200 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-neutral-800">Меню на неделю</h1>
            <p className="text-xs text-neutral-400">Нажмите на блюдо, чтобы заменить</p>
          </div>
          <button
            onClick={handleRegen}
            className="text-xs text-green-dark font-medium px-3 py-1.5 border border-green-dark
                       rounded-full hover:bg-green-bg transition-colors"
          >
            🔄 Пересоздать
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 pt-4 pb-24">
        <WeekGrid schedule={schedule} onSlotClick={handleSlotClick} />
      </main>

      {/* Swap Sheet */}
      {selectedSlot && (
        <SwapBottomSheet
          dayIndex={selectedSlot.dayIndex}
          mealType={selectedSlot.mealType}
          alternatives={alternatives}
          onSelect={(r) => {
            track.mealSwapped(r.id);
            confirmSwap(r);
          }}
          onClose={closeSwap}
        />
      )}

      <BottomNav
        activeTab="schedule"
        onSchedule={() => {}}
        onShopping={() => {
          track.shoppingListOpened();
          onNavigateShopping();
        }}
      />
    </div>
  );
}
