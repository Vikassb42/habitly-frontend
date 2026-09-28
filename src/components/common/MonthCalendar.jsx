// Reusable month calendar used on the History + Habit Details pages.
// `getDayInfo(dateKey, date)` returns { done, total, ratio } per cell.
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONTH_NAMES, getMonthMatrix, formatDateKey, todayKey } from "../../utils/date";

const HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MonthCalendar({ year, month, getDayInfo, selectedKey, onSelectDate, onPrev, onNext }) {
  const weeks = getMonthMatrix(year, month);
  const today = todayKey();

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">
          {MONTH_NAMES[month]} <span className="text-ink-500">{year}</span>
        </h3>
        <div className="flex gap-1">
          <button onClick={onPrev} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-800 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <button onClick={onNext} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-800 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-ink-600">
        {HEADERS.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((date, di) => {
              if (!date) return <div key={di} />;
              const key = formatDateKey(date);
              const info = getDayInfo(key, date);
              const isToday = key === today;
              const isSelected = key === selectedKey;
              const hasHabits = info.total > 0;
              return (
                <button
                  key={di}
                  onClick={() => onSelectDate(key)}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-lg text-xs transition-all",
                    !hasHabits && "text-ink-600 hover:bg-ink-800",
                    hasHabits && "font-medium text-white",
                    isSelected && "ring-2 ring-brand-500 ring-offset-1 ring-offset-ink-900"
                  )}
                  style={hasHabits ? { backgroundColor: `rgba(59,102,245,${0.18 + info.ratio * 0.72})` } : undefined}
                >
                  <span className={cn(isToday && !hasHabits && "text-brand-300", isToday && hasHabits && "underline")}>
                    {date.getDate()}
                  </span>
                  {hasHabits && <span className="text-[8px] text-white/70">{info.done}/{info.total}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}