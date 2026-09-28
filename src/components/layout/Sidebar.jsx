// Persistent left navigation for the authenticated app shell.

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  TrendingUp,
  Repeat,
  Bell,
  Settings,
  HelpCircle,
  Sunrise,
  Sun,
  Sunset,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useFilters } from "../../context/FilterContext";

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-ink-400"
      >
        {title}

        <ChevronDown
          size={14}
          className={cn(
            "transition-transform",
            !open && "-rotate-90"
          )}
        />
      </button>

      {open && <div className="px-1.5">{children}</div>}
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  to,
  active,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-brand-500/15 text-slate-900 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
      )}
    >
      <Icon
        size={16}
        className={
          active
            ? "text-brand-500 dark:text-brand-400"
            : "text-slate-500 dark:text-ink-400"
        }
      />

      {label}
    </Link>
  );
}

function FilterItem({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-aqua-500/15 text-slate-900 dark:bg-aqua-500/20 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
      )}
    >
      <Icon
        size={16}
        className={
          active
            ? "text-aqua-500 dark:text-aqua-300"
            : "text-slate-500 dark:text-ink-400"
        }
      />

      <span className="flex-1 text-left">
        {label}
      </span>

      {badge && (
        <span className="rounded-full bg-brand-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-brand-500 dark:bg-brand-500/20 dark:text-brand-300">
          NOW
        </span>
      )}
    </button>
  );
}

// Determine the current time-of-day.
function getCurrentTimeOfDay() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  return "evening";
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const { timeOfDay, setTimeOfDay } = useFilters();

  const location = useLocation();
  const navigate = useNavigate();

  const [currentTimeOfDay, setCurrentTimeOfDay] = useState(
    getCurrentTimeOfDay()
  );

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTimeOfDay(getCurrentTimeOfDay());
    };

    updateCurrentTime();

    const interval = setInterval(
      updateCurrentTime,
      60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAllHabits = () => {
    setTimeOfDay("all");
    navigate("/dashboard");

    if (onNavigate) {
      onNavigate();
    }
  };

  const handleTimeOfDay = (value) => {
    if (timeOfDay === value) {
      setTimeOfDay("all");
    } else {
      setTimeOfDay(value);
    }

    navigate("/dashboard");

    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white text-slate-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-200">

      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-lg font-bold text-white">
          h
        </div>

        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Habitly
        </span>
      </div>

      {/* User */}
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-ink-850">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-aqua-500 text-sm font-bold text-white">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {user?.name || "Guest"}
          </p>

          <p className="truncate text-xs text-slate-500 dark:text-ink-400">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="px-3">
        <NavItem
          to="/dashboard"
          icon={LayoutGrid}
          label="All Habits"
          active={
            location.pathname === "/dashboard" &&
            timeOfDay === "all"
          }
          onClick={handleAllHabits}
        />

        <NavItem
          to="/history"
          icon={TrendingUp}
          label="Progress"
          active={location.pathname === "/history"}
          onClick={onNavigate}
        />
      </nav>

      <div className="mt-4 flex-1 overflow-y-auto">

        {/* Time of Day */}
        <Section title="Time of Day">

          <FilterItem
            icon={Sunrise}
            label="Morning"
            active={timeOfDay === "morning"}
            badge={currentTimeOfDay === "morning"}
            onClick={() => handleTimeOfDay("morning")}
          />

          <FilterItem
            icon={Sun}
            label="Afternoon"
            active={timeOfDay === "afternoon"}
            badge={currentTimeOfDay === "afternoon"}
            onClick={() => handleTimeOfDay("afternoon")}
          />

          <FilterItem
            icon={Sunset}
            label="Evening"
            active={timeOfDay === "evening"}
            badge={currentTimeOfDay === "evening"}
            onClick={() => handleTimeOfDay("evening")}
          />

        </Section>

        {/* Preferences */}
        <Section title="Preferences" defaultOpen>

          <NavItem
            to="/dashboard"
            icon={Repeat}
            label="Habits"
            active={false}
            onClick={handleAllHabits}
          />

          <NavItem
            to="/reminders"
            icon={Bell}
            label="Reminders"
            active={false}
            onClick={onNavigate}
          />

          <NavItem
            to="/profile"
            icon={Settings}
            label="App Settings"
            active={location.pathname === "/profile"}
            onClick={onNavigate}
          />

          <NavItem
            to="/resources"
            icon={HelpCircle}
            label="Resources"
            active={location.pathname === "/resources"}
            onClick={onNavigate}
          />

        </Section>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-200 p-3 dark:border-ink-800">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-rose"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>

    </div>
  );
}