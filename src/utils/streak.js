// Streak + progress math, derived from a completions map.
// Values per day: true | "done" | "skip" | "fail"  (absent = nothing logged).
//   - done  : counts toward streaks + completion rate
//   - skip  : neutral — bridges a streak without extending it
//   - fail  : breaks the current streak
import { formatDateKey, addDays, todayKey, parseKey } from "./date";

const isDone = (s) => s === true || s === "done";

// Current streak: consecutive "done" days counting back from today.
// "skip" days bridge the run; "fail" / empty ends it.
export const computeCurrentStreak = (completions = {}) => {
  let streak = 0;
  let cursor = new Date();
  const todayStatus = completions[todayKey()];
  if (!isDone(todayStatus) && todayStatus !== "skip") {
    cursor = addDays(cursor, -1); // today not settled yet — streak from yesterday still alive
  }
  let guard = 0;
  while (guard++ < 400) {
    const s = completions[formatDateKey(cursor)];
    if (isDone(s)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    } else if (s === "skip") {
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
};

// Longest run of "done" days ever, with "skip" days allowed to bridge gaps.
export const computeLongestStreak = (completions = {}) => {
  const entries = Object.keys(completions)
    .filter((k) => isDone(completions[k]) || completions[k] === "skip")
    .sort();
  if (entries.length === 0) return 0;
  let longest = 0;
  let current = 0;
  let prev = null;
  for (const key of entries) {
    if (prev !== null) {
      const diff = Math.round((parseKey(key) - parseKey(prev)) / 86400000);
      if (diff !== 1) current = 0;
    }
    if (isDone(completions[key])) current += 1;
    if (current > longest) longest = current;
    prev = key;
  }
  return longest;
};

// Percentage of the last `days` days marked done.
export const completionRate = (completions = {}, days = 30) => {
  let count = 0;
  for (let i = 0; i < days; i++) {
    if (isDone(completions[formatDateKey(addDays(new Date(), -i))])) count += 1;
  }
  return Math.round((count / days) * 100);
};

export const totalCompleted = (completions = {}) =>
  Object.values(completions).filter(isDone).length;