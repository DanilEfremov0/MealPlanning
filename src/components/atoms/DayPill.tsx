const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface Props {
  dayIndex: number;
  active?: boolean;
}

export function DayPill({ dayIndex, active }: Props) {
  return (
    <div
      className={[
        'w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold',
        active
          ? 'bg-green-primary text-white'
          : 'bg-neutral-100 text-neutral-600',
      ].join(' ')}
    >
      {DAYS[dayIndex]}
    </div>
  );
}
