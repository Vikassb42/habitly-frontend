// Date helpers used across the habit tracker UI.

export const pad = (n) => String(n).padStart(2, "0");

// "YYYY-MM-DD" in local time (stable key for the completions map).
export const formatDateKey = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const todayKey = () => formatDateKey(new Date());

// Parse a "YYYY-MM-DD" key into a local Date (avoids UTC off-by-one).
export const parseKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

export const isSameDay = (a, b) => formatDateKey(a) === formatDateKey(b);

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_INITIAL = ["S", "M", "T", "W", "T", "F", "S"];

export const weekdayName = (date) => WEEKDAYS[date.getDay()];
export const weekdayInitial = (date) => WEEKDAY_INITIAL[date.getDay()];

// A horizontal strip of `count` days centered around today, used on the dashboard.
export const getDayStrip = (count = 10, anchor = new Date()) => {
  const startOffset = -6; // 6 days before today, then today, then 3 ahead
  const today = todayKey();
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(anchor, startOffset + i);
    return {
      key: formatDateKey(date),
      date,
      initial: weekdayInitial(date),
      day: date.getDate(),
      isToday: formatDateKey(date) === today,
    };
  });
};

// "Friday, 11 September 2026"
export const formatLongDate = (date = new Date()) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// "September 2026"
export const formatMonthYear = (date = new Date()) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

// Matrix of weeks for a calendar month (leading/trailing blanks for alignment).
export const getMonthMatrix = (year, month) => {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];