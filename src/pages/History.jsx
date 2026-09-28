import { useMemo, useState } from "react";
import { useHabits } from "../hooks/useHabits";
import MonthCalendar from "../components/common/MonthCalendar";
import { Flame, Trophy, TrendingUp, CalendarDays } from "lucide-react";
import {
  getMonthMatrix,
  formatDateKey,
  parseKey,
  todayKey,
  MONTH_NAMES,
  addDays,
} from "../utils/date";
import { computeCurrentStreak, computeLongestStreak, completionRate } from "../utils/streak";
import { cn } from "@/lib/utils";

const isDone = (s) => s === true || s === "done";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900 p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}1A`, color: accent }}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}

export default function History() {
  const { habits, loading } = useHabits();
  const [cursor, setCursor] = useState(new Date());
  const [selectedKey, setSelectedKey] = useState(todayKey());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const getDayInfo = (key, date) => {
    const wd = date.getDay();
    const scheduled = habits.filter((h) => h.targetDays.includes(wd));
    const done = scheduled.filter((h) => isDone(h.completions?.[key])).length;
    return { done, total: scheduled.length, ratio: scheduled.length ? done / scheduled.length : 0 };
  };

  // Aggregate stats across all habits.
  const bestCurrent = habits.reduce((m, h) => Math.max(m, computeCurrentStreak(h.completions)), 0);
  const bestLongest = habits.reduce((m, h) => Math.max(m, computeLongestStreak(h.completions)), 0);

  // 30-day completion rate: total done / total scheduled.
  const rate30 = useMemo(() => {
    let done = 0;
    let scheduled = 0;
    for (let i = 0; i < 30; i++) {
      const d = addDays(new Date(), -i);
      const wd = d.getDay();
      const key = formatDateKey(d);
      const sched = habits.filter((h) => h.targetDays.includes(wd));
      scheduled += sched.length;
      done += sched.filter((h) => isDone(h.completions?.[key])).length;
    }
    return scheduled ? Math.round((done / scheduled) * 100) : 0;
  }, [habits]);

  // Selected day breakdown.
  const selectedDate = parseKey(selectedKey);
  const selectedWd = selectedDate.getDay();
  const dayHabits = habits.filter((h) => h.targetDays.includes(selectedWd));
  const dayDone = dayHabits.filter((h) => isDone(h.completions?.[selectedKey]));
  const dayMissed = dayHabits.filter((h) => !isDone(h.completions?.[selectedKey]));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Progress & History</h1>
        <p className="mt-1 text-sm text-ink-500">Your consistency over time, all habits combined.</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={TrendingUp} label="30-day rate" value={`${rate30}%`} accent="#3B66F5" />
        <StatCard icon={Flame} label="Current streak" value={`${bestCurrent}d`} accent="#FBBF24" />
        <StatCard icon={Trophy} label="Longest streak" value={`${bestLongest}d`} accent="#34D399" />
        <StatCard icon={CalendarDays} label="Active habits" value={habits.length} accent="#22D3EE" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Calendar */}
        <MonthCalendar
          year={year}
          month={month}
          getDayInfo={getDayInfo}
          selectedKey={selectedKey}
          onSelectDate={setSelectedKey}
          onPrev={() => setCursor(new Date(year, month - 1, 1))}
          onNext={() => setCursor(new Date(year, month + 1, 1))}
        />

        {/* Selected day detail */}
        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-5">
          <h3 className="mb-1 font-semibold text-white">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          <p className="mb-4 text-sm text-ink-500">
            {dayDone.length} of {dayHabits.length} habits completed
          </p>

          {loading ? (
            <p className="text-sm text-ink-500">Loading…</p>
          ) : dayHabits.length === 0 ? (
            <p className="text-sm text-ink-500">No habits scheduled for this day.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mint">Completed · {dayDone.length}</p>
                {dayDone.length === 0 ? (
                  <p className="text-sm text-ink-600">Nothing completed.</p>
                ) : (
                  <div className="space-y-1.5">
                    {dayDone.map((h) => (
                      <div key={h.id} className="flex items-center gap-2.5 text-sm text-ink-200">
                        <span className="text-base">{h.icon}</span> {h.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose">Missed · {dayMissed.length}</p>
                {dayMissed.length === 0 ? (
                  <p className="text-sm text-ink-600">Nothing missed. 🎉</p>
                ) : (
                  <div className="space-y-1.5">
                    {dayMissed.map((h) => (
                      <div key={h.id} className="flex items-center gap-2.5 text-sm text-ink-400">
                        <span className="text-base opacity-60">{h.icon}</span> {h.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}