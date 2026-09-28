// Horizontal 10-day timeline used at the top of the dashboard.
import { cn } from "@/lib/utils";

export default function DateStrip({ strip, selectedKey, onSelect }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {strip.map((d) => {
        const selected = d.key === selectedKey;

        return (
          <button
            key={d.key}
            onClick={() => onSelect(d.key)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",

              // Today
              d.isToday
                ? "bg-brand-500/10 ring-1 ring-brand-500/40"
                : "hover:bg-slate-100 dark:hover:bg-ink-800",

              // Selected date
              selected &&
                !d.isToday &&
                "bg-slate-200 ring-1 ring-slate-300 dark:bg-ink-700 dark:ring-ink-600"
            )}
          >
            {/* Day */}
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                d.isToday
                  ? "text-brand-500 dark:text-brand-300"
                  : "text-slate-500 dark:text-ink-400"
              )}
            >
              {d.initial}
            </span>

            {/* Date */}
            <span
              className={cn(
                "text-sm font-semibold",
                d.isToday
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-800 dark:text-ink-200"
              )}
            >
              {d.day}
            </span>

            {/* Today */}
            {d.isToday && (
              <span className="text-[9px] font-bold uppercase text-brand-500 dark:text-brand-300">
                Today
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}