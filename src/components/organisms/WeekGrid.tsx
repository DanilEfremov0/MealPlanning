import type { DaySchedule, MealType, SelectedSlot } from '../../types';
import { DayPill } from '../atoms/DayPill';
import { RecipeCard } from '../atoms/RecipeCard';

const MEAL_TYPES: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: '☀️ Завтрак' },
  { key: 'lunch',     label: '🌤️ Обед' },
  { key: 'dinner',    label: '🌙 Ужин' },
];

interface Props {
  schedule: DaySchedule[];
  onSlotClick: (slot: SelectedSlot) => void;
}

export function WeekGrid({ schedule, onSlotClick }: Props) {
  return (
    <div className="flex flex-col gap-6 pb-4">
      {schedule.map(day => (
        <div key={day.dayIndex}>
          <div className="flex items-center gap-3 mb-3">
            <DayPill dayIndex={day.dayIndex} />
          </div>
          <div className="flex flex-col gap-2">
            {MEAL_TYPES.map(({ key, label }) => {
              const slot = day[key];
              return (
                <div key={key}>
                  <p className="text-xs text-neutral-400 mb-1 font-medium">{label}</p>
                  {slot.recipe ? (
                    <RecipeCard
                      recipe={slot.recipe}
                      onClick={() => onSlotClick({ dayIndex: day.dayIndex, mealType: key })}
                    />
                  ) : (
                    <div className="h-14 rounded-[16px] bg-neutral-100 border border-dashed border-neutral-200 
                                    flex items-center justify-center text-sm text-neutral-400">
                      Нет блюда
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
