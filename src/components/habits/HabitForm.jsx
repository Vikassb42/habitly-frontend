// Add / edit habit dialog. `habit` is null when creating.
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HABIT_ICONS, HABIT_CATEGORIES } from "../../data/mockData";

const COLORS = ["#3B66F5", "#22D3EE", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#F472B6", "#60A5FA"];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const empty = {
  name: "",
  description: "",
  category: "Health",
  icon: "🎯",
  color: "#3B66F5",
  timeOfDay: "morning",
  targetDays: [0, 1, 2, 3, 4, 5, 6],
};

export default function HabitForm({ open, onClose, onSubmit, habit }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(habit ? { ...empty, ...habit } : empty);
      setError("");
    }
  }, [open, habit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleDay = (d) =>
    setForm((f) => ({
      ...f,
      targetDays: f.targetDays.includes(d) ? f.targetDays.filter((x) => x !== d) : [...f.targetDays, d],
    }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Give your habit a name.");
    if (form.targetDays.length === 0) return setError("Pick at least one day.");
    onSubmit({ ...form, name: form.name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-ink-700 bg-ink-900 text-ink-200 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{habit ? "Edit habit" : "New habit"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          {/* Icon + color */}
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-ink-500">Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {HABIT_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => set("icon", ic)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors",
                    form.icon === ic ? "bg-brand-500/20 ring-2 ring-brand-500" : "bg-ink-800 hover:bg-ink-700"
                  )}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-ink-500">Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => set("color", c)}
                  className={cn("h-8 w-8 rounded-full transition-transform", form.color === c && "scale-110 ring-2 ring-white ring-offset-2 ring-offset-ink-900")}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-wide text-ink-500">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Morning Meditation"
              className="border-ink-700 bg-ink-800 text-white placeholder:text-ink-500 focus-visible:ring-brand-500"
            />
          </div>

          <div>
            <Label htmlFor="desc" className="mb-1.5 block text-xs uppercase tracking-wide text-ink-500">Description</Label>
            <textarea
              id="desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What does this habit involve?"
              rows={2}
              className="w-full resize-none rounded-md border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-500">Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="border-ink-700 bg-ink-800 text-white">{form.category}</SelectTrigger>
                <SelectContent className="border-ink-700 bg-ink-800 text-ink-200">
                  {HABIT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="hover:bg-ink-700">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-500">Time of day</Label>
              <Select value={form.timeOfDay} onValueChange={(v) => set("timeOfDay", v)}>
                <SelectTrigger className="border-ink-700 bg-ink-800 text-white capitalize">{form.timeOfDay}</SelectTrigger>
                <SelectContent className="border-ink-700 bg-ink-800 text-ink-200">
                  {["morning", "afternoon", "evening"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize hover:bg-ink-700">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-ink-500">Repeat on</Label>
            <div className="flex gap-1.5">
              {WEEKDAYS.map((d, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "h-9 w-9 rounded-lg text-sm font-medium transition-colors",
                    form.targetDays.includes(i)
                      ? "bg-brand-500 text-white"
                      : "bg-ink-800 text-ink-400 hover:bg-ink-700"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose">{error}</p>}
        </form>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-ink-300 hover:bg-ink-800 hover:text-white">
            Cancel
          </Button>
          <Button onClick={submit} className="bg-brand-500 text-white hover:bg-brand-600">
            {habit ? "Save changes" : "Create habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}