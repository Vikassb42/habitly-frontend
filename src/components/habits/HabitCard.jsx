// A single habit card for the dashboard. Works in both grid and list layouts.
import { Link } from "react-router-dom";
import { Flame, Check, Minus, X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { computeCurrentStreak } from "../../utils/streak";
import { formatDateKey, parseKey, weekdayName } from "../../utils/date";

const isDone = (s) => s === true || s === "done";

export default function HabitCard({ habit, dateKey, view = "grid", onToggle, onEdit, onDelete, onSelect, selected }) {
  const status = habit.completions?.[dateKey];
  const done = isDone(status);
  const skipped = status === "skip";
  const failed = status === "fail";
  const streak = computeCurrentStreak(habit.completions);
  const isToday = dateKey === formatDateKey(new Date());
  const viewDate = parseKey(dateKey);

  const statusStyle = done
    ? "border-mint bg-mint text-ink-950"
    : skipped
    ? "border-amber bg-amber/20 text-amber"
    : failed
    ? "border-rose bg-rose/20 text-rose"
    : "border-ink-600 text-transparent hover:border-brand-400 hover:bg-brand-500/10";

  return (
    <div
      onClick={() => onSelect?.(habit)}
      className={cn(
        "group relative cursor-pointer rounded-2xl border bg-ink-850 p-4 transition-all hover:border-ink-600 hover:bg-ink-800",
        view === "list" && "flex items-center gap-4",
        done ? "border-mint/30" : "border-ink-700/70",
        selected && "ring-2 ring-brand-500"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl text-2xl",
          view === "grid" ? "mb-3 h-12 w-12" : "h-11 w-11"
        )}
        style={{ backgroundColor: `${habit.color}1A`, boxShadow: `inset 0 0 0 1px ${habit.color}33` }}
      >
        <span>{habit.icon}</span>
      </div>

      <div className={cn("min-w-0 flex-1", view === "grid" && "mt-1")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/habits/${habit.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block truncate text-sm font-semibold text-white hover:text-brand-300"
            >
              {habit.name}
            </Link>
            <p className="mt-0.5 truncate text-xs text-ink-500">
              {habit.category} · {habit.timeOfDay}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <button className="rounded-md p-1 text-ink-500 opacity-0 transition-opacity hover:bg-ink-700 hover:text-ink-300 group-hover:opacity-100 data-[state=open]:opacity-100">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-ink-700 bg-ink-800 text-ink-200">
              <DropdownMenuItem
                className="hover:bg-ink-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(habit);
                }}
              >
                <Pencil size={14} className="mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-rose hover:bg-ink-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(habit);
                }}
              >
                <Trash2 size={14} className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {view === "grid" && habit.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-500">{habit.description}</p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber">
            <Flame size={13} className="fill-amber" /> {streak} day{streak === 1 ? "" : "s"}
          </span>
          {!isToday && <span className="text-xs text-ink-500">{weekdayName(viewDate)}</span>}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(habit, dateKey);
        }}
        aria-label={done ? "Mark as not done" : "Mark as done"}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-2 transition-all",
          view === "grid" ? "absolute right-4 top-4 h-7 w-7" : "h-9 w-9",
          statusStyle
        )}
      >
        {done && <Check size={view === "grid" ? 14 : 18} strokeWidth={3} />}
        {skipped && <Minus size={view === "grid" ? 14 : 18} strokeWidth={3} />}
        {failed && <X size={view === "grid" ? 14 : 18} strokeWidth={3} />}
      </button>
    </div>
  );
}