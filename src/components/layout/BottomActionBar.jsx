// Contextual action bar shown when a habit is selected on the dashboard.
import { Check, SkipForward, X, RotateCcw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomActionBar({
  habit,
  dateKey,
  onComplete,
  onSkip,
  onFail,
  onUndo,
  onAdd,
}) {
  const done =
    habit?.completions?.[dateKey] === true ||
    habit?.completions?.[dateKey] === "done";

  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-4 py-3 backdrop-blur dark:border-ink-800 dark:bg-ink-900/95 md:px-6">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        
        {/* Add habit */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add habit</span>
        </button>

        <div className="hidden h-6 w-px bg-slate-200 dark:bg-ink-700 sm:block" />

        {/* Selected habit */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {habit ? (
            <span className="truncate text-sm text-slate-600 dark:text-ink-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                {habit.name}
              </span>

              <span className="ml-2 text-slate-500 dark:text-ink-500">
                {done ? "completed" : "selected"}
              </span>
            </span>
          ) : (
            <span className="text-sm text-slate-500 dark:text-ink-500">
              Nothing selected
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {done ? (
            <button
              onClick={onUndo}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">Undo</span>
            </button>
          ) : (
            <button
              onClick={onComplete}
              disabled={!habit}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                habit
                  ? "bg-mint text-ink-950 hover:brightness-110"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-ink-600"
              )}
            >
              <Check size={15} />
              <span className="hidden sm:inline">Complete</span>
            </button>
          )}

          <button
            onClick={onSkip}
            disabled={!habit}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              habit
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-ink-800 dark:text-ink-200 dark:hover:bg-ink-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-ink-600"
            )}
          >
            <SkipForward size={15} />
            <span className="hidden sm:inline">Skip</span>
          </button>

          <button
            onClick={onFail}
            disabled={!habit}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              habit
                ? "bg-slate-100 text-rose hover:bg-slate-200 dark:bg-ink-800 dark:text-rose dark:hover:bg-ink-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-ink-600"
            )}
          >
            <X size={15} />
            <span className="hidden sm:inline">Fail</span>
          </button>
        </div>
      </div>
    </div>
  );
}