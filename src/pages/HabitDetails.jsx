import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHabits } from "../hooks/useHabits";
import MonthCalendar from "../components/common/MonthCalendar";
import HabitForm from "../components/habits/HabitForm";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Flame,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Check,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parseKey, todayKey, addDays, formatDateKey } from "../utils/date";
import { computeCurrentStreak, computeLongestStreak, completionRate, totalCompleted } from "../utils/streak";

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

export default function HabitDetails() {
  const { id } = useParams();
  const { getHabit, toggleComplete, updateHabit, removeHabit, loading } = useHabits();
  const navigate = useNavigate();
  const { toast } = useToast();
  const habit = getHabit(id);

  const [cursor, setCursor] = useState(new Date());
  const [selectedKey, setSelectedKey] = useState(todayKey());
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const stats = useMemo(() => {
    if (!habit) return { current: 0, longest: 0, rate: 0, total: 0 };
    return {
      current: computeCurrentStreak(habit.completions),
      longest: computeLongestStreak(habit.completions),
      rate: completionRate(habit.completions, 30),
      total: totalCompleted(habit.completions),
    };
  }, [habit]);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-ink-500">Loading…</div>;
  }

  if (!habit) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-lg font-semibold text-white">Habit not found</p>
        <p className="mt-1 text-sm text-ink-500">It may have been deleted.</p>
        <Link to="/dashboard">
          <Button className="mt-4 bg-brand-500 text-white hover:bg-brand-600">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const getDayInfo = (key, date) => {
    const scheduled = habit.targetDays.includes(date.getDay());
    if (!scheduled) return { done: 0, total: 0, ratio: 0 };
    const done = isDone(habit.completions?.[key]);
    return { done: done ? 1 : 0, total: 1, ratio: done ? 1 : 0 };
  };

  const todayDone = isDone(habit.completions?.[todayKey()]);

  const handleSubmit = async (data) => {
    await updateHabit(habit.id, data);
    toast({ title: "Habit updated" });
    setFormOpen(false);
  };

  const handleDelete = async () => {
    await removeHabit(habit.id);
    toast({ title: "Habit deleted" });
    navigate("/dashboard");
  };

  const toggleToday = async () => {
    await toggleComplete(habit.id, todayKey());
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 md:py-8">
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-white">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: `${habit.color}1A`, boxShadow: `inset 0 0 0 1px ${habit.color}33` }}
          >
            {habit.icon}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{habit.name}</h1>
            <p className="mt-0.5 text-sm text-ink-500">
              {habit.category} · {habit.timeOfDay} · {habit.targetDays.length} days/week
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setFormOpen(true)} variant="outline" className="border-ink-700 bg-ink-800 text-white hover:bg-ink-700">
            <Pencil size={15} className="mr-1.5" /> Edit
          </Button>
          <Button onClick={() => setConfirmDelete(true)} variant="outline" className="border-rose/40 text-rose hover:bg-rose/10">
            <Trash2 size={15} className="mr-1.5" /> Delete
          </Button>
        </div>
      </div>

      {habit.description && (
        <p className="mb-6 rounded-2xl border border-ink-800 bg-ink-900 p-4 text-sm leading-relaxed text-ink-300">
          {habit.description}
        </p>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Current streak" value={`${stats.current}d`} accent="#FBBF24" />
        <StatCard icon={Trophy} label="Longest streak" value={`${stats.longest}d`} accent="#34D399" />
        <StatCard icon={TrendingUp} label="30-day rate" value={`${stats.rate}%`} accent="#3B66F5" />
        <StatCard icon={CheckCircle2} label="Total done" value={stats.total} accent="#22D3EE" />
      </div>

      {/* Today action */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-ink-800 bg-ink-900 p-4">
        <div>
          <p className="text-sm font-medium text-white">Today's status</p>
          <p className="text-xs text-ink-500">{todayDone ? "Completed — great job!" : "Not completed yet."}</p>
        </div>
        <Button
          onClick={toggleToday}
          className={todayDone ? "border border-ink-700 bg-ink-800 text-ink-200 hover:bg-ink-700" : "bg-mint text-ink-950 hover:brightness-110"}
        >
          {todayDone ? (
            <>
              <Check size={15} className="mr-1.5" /> Undo
            </>
          ) : (
            "Mark done"
          )}
        </Button>
      </div>

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

      <HabitForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} habit={habit} />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="border-ink-700 bg-ink-900 text-ink-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete "{habit.name}"?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-400">
              This will permanently remove the habit and its full history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-ink-700 bg-ink-800 text-ink-200 hover:bg-ink-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose text-white hover:bg-rose/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}