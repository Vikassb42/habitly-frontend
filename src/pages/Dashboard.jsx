import { useMemo, useState } from "react";
import { useHabits } from "../hooks/useHabits";
import { useFilters } from "../context/FilterContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { LayoutGrid, List, Search, Plus, SlidersHorizontal, Flame, Target, CheckCircle2 } from "lucide-react";
import HabitCard from "../components/habits/HabitCard";
import HabitForm from "../components/habits/HabitForm";
import DateStrip from "../components/habits/DateStrip";
import BottomActionBar from "../components/layout/BottomActionBar";
import ProgressRing from "../components/common/ProgressRing";
import { useToast } from "@/components/ui/use-toast";
import { getDayStrip, parseKey, formatLongDate, todayKey } from "../utils/date";
import { computeCurrentStreak } from "../utils/streak";
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

export default function Dashboard() {
  const { habits, loading, addHabit, updateHabit, removeHabit, toggleComplete, setDayStatus } = useHabits();
  const { user } = useAuth();
  const { timeOfDay, setTimeOfDay, view, setView, selectedDateKey, setSelectedDateKey } = useFilters();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const strip = useMemo(() => getDayStrip(10), []);
  const selectedDate = parseKey(selectedDateKey);
  const weekday = selectedDate.getDay();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "there";

  // Habits scheduled for the selected day, filtered by time-of-day + search.
  const visibleHabits = useMemo(() => {
    let list = habits.filter((h) => h.targetDays.includes(weekday));
    if (timeOfDay !== "all") list = list.filter((h) => h.timeOfDay === timeOfDay);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((h) => h.name.toLowerCase().includes(q) || h.category.toLowerCase().includes(q));
    }
    return list;
  }, [habits, weekday, timeOfDay, search]);

  const completedCount = visibleHabits.filter((h) => isDone(h.completions?.[selectedDateKey])).length;
  const completionPct = visibleHabits.length ? Math.round((completedCount / visibleHabits.length) * 100) : 0;
  const bestStreak = habits.reduce((max, h) => Math.max(max, computeCurrentStreak(h.completions)), 0);

  const selectedHabit = habits.find((h) => h.id === selectedId) || null;
  const selectedDone = isDone(selectedHabit?.completions?.[selectedDateKey]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (habit) => { setEditing(habit); setFormOpen(true); };

  const handleSubmit = async (data) => {
    if (editing) {
      await updateHabit(editing.id, data);
      toast({ title: "Habit updated" });
    } else {
      await addHabit(data);
      toast({ title: "Habit created", description: data.name });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleToggle = async (habit, dateKey) => {
    await toggleComplete(habit.id, dateKey);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await removeHabit(toDelete.id);
    toast({ title: "Habit deleted", description: toDelete.name });
    if (selectedId === toDelete.id) setSelectedId(null);
    setToDelete(null);
  };

  const handleComplete = async () => {
    if (!selectedHabit) return;
    await setDayStatus(selectedHabit.id, selectedDateKey, "done");
    toast({ title: "Nice work!", description: `${selectedHabit.name} marked complete.` });
  };
  const handleSkip = async () => {
    if (!selectedHabit) return;
    await setDayStatus(selectedHabit.id, selectedDateKey, "skip");
    toast({ title: "Skipped for today", description: "Your streak is preserved." });
  };
  const handleFail = async () => {
    if (!selectedHabit) return;
    await setDayStatus(selectedHabit.id, selectedDateKey, "fail");
    toast({ title: "Marked as missed", variant: "destructive" });
  };
  const handleUndo = async () => {
    if (!selectedHabit) return;
    await setDayStatus(selectedHabit.id, selectedDateKey, null);
    toast({ title: "Completion undone" });
  };

  const todLabel = timeOfDay === "all" ? "All habits" : timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              {greeting}, {firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-ink-500">{formatLongDate(new Date())}</p>
          </div>
          <Button onClick={openAdd} className="self-start bg-brand-500 text-white hover:bg-brand-600">
            <Plus size={16} className="mr-1.5" /> Add habit
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="col-span-2 flex items-center gap-4 rounded-2xl border border-ink-800 bg-ink-900 p-4 sm:col-span-1">
            <ProgressRing value={completionPct} size={84} stroke={8} color="#3B66F5">
              <span className="text-lg font-bold text-white">{completionPct}%</span>
            </ProgressRing>
            <div>
              <p className="text-xs text-ink-500">Today's progress</p>
              <p className="text-sm font-medium text-white">{completedCount}/{visibleHabits.length} done</p>
            </div>
          </div>
          <StatCard icon={Target} label="Total habits" value={visibleHabits.length} accent="#22D3EE" />
          <StatCard icon={CheckCircle2} label="Completed" value={completedCount} accent="#34D399" />
          <StatCard icon={Flame} label="Best streak" value={`${bestStreak}d`} accent="#FBBF24" />
        </div>

        {/* Date strip */}
        <div className="mb-6 rounded-2xl border border-ink-800 bg-ink-900 p-3">
          <DateStrip strip={strip} selectedKey={selectedDateKey} onSelect={setSelectedDateKey} />
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-ink-500" />
            <h2 className="text-lg font-semibold text-white">{todLabel}</h2>
            <span className="rounded-full bg-ink-800 px-2 py-0.5 text-xs text-ink-400">{visibleHabits.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search habits"
                className="h-9 w-44 border-ink-700 bg-ink-800 pl-9 text-sm text-white placeholder:text-ink-300 focus-visible:ring-brand-500"
              />
            </div>
            <div className="flex items-center rounded-lg border border-ink-700 bg-ink-800 p-0.5">
              <button
                onClick={() => setView("grid")}
                className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "grid" ? "bg-ink-700 text-white" : "text-ink-500")}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "list" ? "bg-ink-700 text-white" : "text-ink-500")}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Habits */}
        {loading ? (
          <div className="flex h-40 items-center justify-center text-ink-500">Loading your habits…</div>
        ) : visibleHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-700 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 text-2xl">🌱</div>
            <p className="font-medium text-white">No habits here yet</p>
            <p className="mt-1 text-sm text-ink-500">Add your first habit to start building consistency.</p>
            <Button onClick={openAdd} className="mt-4 bg-brand-500 text-white hover:bg-brand-600">
              <Plus size={16} className="mr-1.5" /> Add habit
            </Button>
          </div>
        ) : (
          <div className={cn("grid gap-3", view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
            {visibleHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                dateKey={selectedDateKey}
                view={view}
                selected={selectedId === habit.id}
                onSelect={(h) => setSelectedId((cur) => (cur === h.id ? null : h.id))}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={setToDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BottomActionBar
        habit={selectedHabit}
        dateKey={selectedDateKey}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onFail={handleFail}
        onUndo={handleUndo}
        onAdd={openAdd}
      />

      <HabitForm open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} onSubmit={handleSubmit} habit={editing} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-ink-700 bg-ink-900 text-ink-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete "{toDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-400">
              This will permanently remove the habit and its full history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-ink-700 bg-ink-800 text-ink-200 hover:bg-ink-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose text-white hover:bg-rose/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
