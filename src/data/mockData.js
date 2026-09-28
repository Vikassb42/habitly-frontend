// Seed data + helpers for the mock layer. Only used the first time the app runs
// (or when localStorage is cleared). Edit freely — this is demo content.
import { addDays, formatDateKey } from "../utils/date";

// Build a realistic-looking completion history ending today.
export const seedCompletions = (days, probability = 0.7) => {
  const out = {};
  for (let i = days; i > 0; i--) {
    if (Math.random() < probability) {
      out[formatDateKey(addDays(new Date(), -i))] = true;
    }
  }
  return out;
};

export const HABIT_ICONS = [
  "🧘", "🏃", "📚", "💧", "🥗", "💪", "😴", "🧠",
  "✍️", "🎯", "🌱", "☀️", "🦷", "🚭", "💻", "🎨",
];

export const HABIT_CATEGORIES = [
  "Health",
  "Fitness",
  "Mindfulness",
  "Productivity",
  "Learning",
  "Social",
  "Finance",
];

export const TIME_OF_DAY = ["morning", "afternoon", "evening"];

let idc = 0;
const nid = () => `h_seed_${Date.now()}_${idc++}`;

export const defaultHabits = () => [
  {
    id: nid(),
    name: "Morning Meditation",
    description: "10 minutes of mindful breathing to start the day calm.",
    category: "Mindfulness",
    icon: "🧘",
    color: "#22D3EE",
    timeOfDay: "morning",
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    createdAt: addDays(new Date(), -40).toISOString(),
    completions: seedCompletions(30, 0.8),
  },
  {
    id: nid(),
    name: "Drink 2L Water",
    description: "Stay hydrated through the day.",
    category: "Health",
    icon: "💧",
    color: "#3B66F5",
    timeOfDay: "morning",
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    createdAt: addDays(new Date(), -35).toISOString(),
    completions: seedCompletions(30, 0.65),
  },
  {
    id: nid(),
    name: "Read 20 Pages",
    description: "Daily reading habit for continuous learning.",
    category: "Learning",
    icon: "📚",
    color: "#A78BFA",
    timeOfDay: "evening",
    targetDays: [1, 2, 3, 4, 5],
    createdAt: addDays(new Date(), -28).toISOString(),
    completions: seedCompletions(30, 0.6),
  },
  {
    id: nid(),
    name: "Evening Walk",
    description: "30 minute walk after dinner.",
    category: "Fitness",
    icon: "🏃",
    color: "#34D399",
    timeOfDay: "evening",
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    createdAt: addDays(new Date(), -22).toISOString(),
    completions: seedCompletions(30, 0.55),
  },
  {
    id: nid(),
    name: "Deep Work Session",
    description: "90 minutes of focused, distraction-free work.",
    category: "Productivity",
    icon: "🎯",
    color: "#FBBF24",
    timeOfDay: "afternoon",
    targetDays: [1, 2, 3, 4, 5],
    createdAt: addDays(new Date(), -18).toISOString(),
    completions: seedCompletions(30, 0.5),
  },
];