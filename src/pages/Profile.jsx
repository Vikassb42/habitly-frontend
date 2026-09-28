import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useHabits } from "../hooks/useHabits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  User,
  Bell,
  Palette,
  Calendar,
  Flame,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  computeCurrentStreak,
  computeLongestStreak,
  totalCompleted,
} from "../utils/streak";

function Row({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-ink-300">
          <Icon size={16} />
        </div>

        <div>
          <p className="text-sm font-medium text-white">{title}</p>

          {desc && (
            <p className="text-xs text-ink-500">
              {desc}
            </p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900 p-4">
      <div
        className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `${accent}1A`,
          color: accent,
        }}
      >
        <Icon size={16} />
      </div>

      <p className="text-2xl font-bold text-white">
        {value}
      </p>

      <p className="text-xs text-ink-500">
        {label}
      </p>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { habits } = useHabits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [notifications, setNotifications] = useState(true);

  const [weekStart, setWeekStart] = useState("Sunday");

  // Dark theme state
  const [darkTheme, setDarkTheme] = useState(() => {
    return localStorage.getItem("ht_theme") !== "light";
  });

  // Apply theme whenever darkTheme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkTheme);

    localStorage.setItem(
      "ht_theme",
      darkTheme ? "dark" : "light"
    );
  }, [darkTheme]);

  const totalDone = habits.reduce(
    (s, h) => s + totalCompleted(h.completions),
    0
  );

  const bestCurrent = habits.reduce(
    (m, h) =>
      Math.max(
        m,
        computeCurrentStreak(h.completions)
      ),
    0
  );

  const bestLongest = habits.reduce(
    (m, h) =>
      Math.max(
        m,
        computeLongestStreak(h.completions)
      ),
    0
  );

  const save = () => {
    updateProfile({
      name,
      email,
    });

    toast({
      title: "Profile saved",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-8">

      {/* Page title */}
      <h1 className="mb-6 font-display text-2xl font-bold text-white">
        Profile & Settings
      </h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

        <StatCard
          icon={CheckCircle2}
          label="Completions"
          value={totalDone}
          accent="#34D399"
        />

        <StatCard
          icon={Flame}
          label="Current streak"
          value={`${bestCurrent}d`}
          accent="#FBBF24"
        />

        <StatCard
          icon={Trophy}
          label="Longest streak"
          value={`${bestLongest}d`}
          accent="#3B66F5"
        />

        <StatCard
          icon={User}
          label="Active habits"
          value={habits.length}
          accent="#22D3EE"
        />

      </div>

      {/* Account */}
      <div className="mb-6 rounded-2xl border border-ink-800 bg-ink-900 p-5">

        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-400">
          Account
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">

          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-500">
              Name
            </Label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-ink-700 bg-ink-800 text-white focus-visible:ring-brand-500"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-500">
              Email
            </Label>

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-ink-700 bg-ink-800 text-white focus-visible:ring-brand-500"
            />
          </div>

        </div>

        <div className="mt-4 flex justify-end">

          <Button
            onClick={save}
            className="bg-brand-500 text-white hover:bg-brand-600"
          >
            Save changes
          </Button>

        </div>
      </div>

      {/* Preferences */}
      <div className="mb-6 divide-y divide-ink-800 rounded-2xl border border-ink-800 bg-ink-900 px-5">

        {/* Notifications */}
        <Row
          icon={Bell}
          title="Notifications"
          desc="Daily reminders to keep your streaks alive"
        >
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </Row>

        {/* Dark Theme */}
        <Row
          icon={Palette}
          title="Dark theme"
          desc="Use the dark interface"
        >
          <Switch
            checked={darkTheme}
            onCheckedChange={setDarkTheme}
          />
        </Row>

        {/* Week starts on */}
        <Row
          icon={Calendar}
          title="Week starts on"
          desc="Used by the calendar views"
        >
          <Select
            value={weekStart}
            onValueChange={setWeekStart}
          >
            <SelectTrigger className="w-32 border-ink-700 bg-ink-800 text-white">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="border-ink-700 bg-ink-800 text-ink-200">

              <SelectItem value="Sunday">
                Sunday
              </SelectItem>

              <SelectItem value="Monday">
                Monday
              </SelectItem>

            </SelectContent>
          </Select>
        </Row>

      </div>

      {/* Danger / Session */}
      <div className="rounded-2xl border border-ink-800 bg-ink-900 p-5">

        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-ink-400">
          Session
        </h2>

        <p className="mb-4 text-sm text-ink-500">
          You're signed in as {user?.email || "guest"}.
        </p>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-rose/40 text-rose hover:bg-rose/10 hover:text-rose"
        >
          <LogOut size={16} className="mr-1.5" />
          Log out
        </Button>

      </div>

    </div>
  );
}