// ---------------------------------------------------------------------------
// API service layer for the Habit Tracker.
//
// Uses the Node.js + Express + MongoDB backend when VITE_USE_MOCK=false.
// ---------------------------------------------------------------------------

import { getItem, setItem } from "../utils/storage";
import { defaultHabits } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") !== "false";

const HABITS_KEY = "ht_habits";
const USERS_KEY = "ht_users";

const delay = (ms = 240) => new Promise((r) => setTimeout(r, ms));

const ok = async (data, ms = 240) => {
  await delay(ms);
  return data;
};

// ---------------------------------------------------------------------------
// AUTH HEADERS
// ---------------------------------------------------------------------------

const authHeaders = () => {
  const token = localStorage.getItem("ht_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------

export const authApi = {
  // REGISTER
  async register({ name, email, password }) {
    if (USE_MOCK) {
      const users = getItem(USERS_KEY, []);

      if (users.some((u) => u.email === email)) {
        throw new Error("An account with this email already exists.");
      }

      const user = {
        id: `u_${Date.now()}`,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(user);
      setItem(USERS_KEY, users);

      const { password: _omit, ...safe } = user;

      return ok(safe);
    }

    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return {
      id: data.user?.id,
      name: data.user?.name || data.user?.username || name,
      email: data.user?.email || email,
    };
  },

  // LOGIN
  async login({ email, password }) {
    if (USE_MOCK) {
      const users = getItem(USERS_KEY, []);

      const user = users.find((u) => u.email === email);

      if (!user || user.password !== password) {
        throw new Error("Invalid email or password.");
      }

      const { password: _omit, ...safe } = user;

      return ok(safe);
    }

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save JWT token for protected APIs
      localStorage.setItem("ht_token", data.token);

    return {
      id: data.user.id,
      name: data.user.name || data.user.username,
      email: data.user.email,
    };
  },

  // GOOGLE LOGIN
  async googleLogin(email) {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Google login failed");
    }

    localStorage.setItem("ht_token", data.token);

    return {
      id: data.user.id,
      name: data.user.name || data.user.username,
      email: data.user.email,
    };
  },
};

// ---------------------------------------------------------------------------
// HABITS
// ---------------------------------------------------------------------------

export const habitsApi = {
  // -------------------------------------------------------------------------
  // GET ALL HABITS
  // -------------------------------------------------------------------------
  async list() {
    if (USE_MOCK) {
      let habits = getItem(HABITS_KEY, null);

      if (!habits) {
        habits = defaultHabits();
        setItem(HABITS_KEY, habits);
      }

      return ok(habits, 200);
    }

    const res = await fetch(`${API_BASE_URL}/habits`, {
      headers: authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not load habits");
    }

    return data.habits;
  },

  // -------------------------------------------------------------------------
  // CREATE HABIT
  // -------------------------------------------------------------------------
  async create(habit) {
    if (USE_MOCK) {
      const habits = getItem(HABITS_KEY, []);

      const newHabit = {
        id: `h_${Date.now()}`,
        completions: {},
        createdAt: new Date().toISOString(),
        targetDays: [0, 1, 2, 3, 4, 5, 6],
        ...habit,
      };

      habits.push(newHabit);
      setItem(HABITS_KEY, habits);

      return ok(newHabit);
    }

    const res = await fetch(`${API_BASE_URL}/habits`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(habit),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not create habit");
    }

    return data.habit;
  },

  // -------------------------------------------------------------------------
  // UPDATE HABIT
  // -------------------------------------------------------------------------
  async update(id, data) {
    if (USE_MOCK) {
      const habits = getItem(HABITS_KEY, []);

      const idx = habits.findIndex((h) => h.id === id);

      if (idx === -1) {
        throw new Error("Habit not found");
      }

      const updated = {
        ...habits[idx],
        ...data,
        id,
      };

      habits[idx] = updated;
      setItem(HABITS_KEY, habits);

      return ok(updated);
    }

    const res = await fetch(`${API_BASE_URL}/habits/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Could not update habit");
    }

    return result.habit;
  },

  // -------------------------------------------------------------------------
  // DELETE HABIT
  // -------------------------------------------------------------------------
  async remove(id) {
    if (USE_MOCK) {
      const habits = getItem(HABITS_KEY, []).filter((h) => h.id !== id);

      setItem(HABITS_KEY, habits);

      return ok({
        success: true,
      });
    }

    const res = await fetch(`${API_BASE_URL}/habits/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not delete habit");
    }

    return data;
  },

  // -------------------------------------------------------------------------
  // COMPLETE / TOGGLE HABIT
  // -------------------------------------------------------------------------
  async toggleComplete(id, dateKey) {
    if (USE_MOCK) {
      const habits = getItem(HABITS_KEY, []);

      const idx = habits.findIndex((h) => h.id === id);

      if (idx === -1) {
        throw new Error("Habit not found");
      }

      const completions = {
        ...habits[idx].completions,
      };

      if (completions[dateKey] === "done" || completions[dateKey] === true) {
        delete completions[dateKey];
      } else {
        completions[dateKey] = "done";
      }

      const updated = {
        ...habits[idx],
        completions,
      };

      habits[idx] = updated;
      setItem(HABITS_KEY, habits);

      return ok(updated);
    }

    // Use POST because backend supports:
    // date + status + undo
    const res = await fetch(`${API_BASE_URL}/habits/${id}/complete`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        date: dateKey,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not update completion");
    }

    return data.habit;
  },

  // -------------------------------------------------------------------------
  // SET DAY STATUS
  // status = "done" | "skip" | "fail" | null
  // -------------------------------------------------------------------------
  async setDayStatus(id, dateKey, status) {
    if (USE_MOCK) {
      const habits = getItem(HABITS_KEY, []);

      const idx = habits.findIndex((h) => h.id === id);

      if (idx === -1) {
        throw new Error("Habit not found");
      }

      const completions = {
        ...habits[idx].completions,
      };

      if (status === null) {
        delete completions[dateKey];
      } else {
        completions[dateKey] = status;
      }

      const updated = {
        ...habits[idx],
        completions,
      };

      habits[idx] = updated;
      setItem(HABITS_KEY, habits);

      return ok(updated);
    }

    const res = await fetch(`${API_BASE_URL}/habits/${id}/complete`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        date: dateKey,
        status: status,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not update day status");
    }

    return data.habit;
  },

  // -------------------------------------------------------------------------
  // HISTORY
  // -------------------------------------------------------------------------
  async history(id) {
    if (USE_MOCK) {
      const habit = getItem(HABITS_KEY, []).find((h) => h.id === id);

      return ok(habit ? habit.completions : {});
    }

    // Backend has a dedicated history endpoint.
    const res = await fetch(`${API_BASE_URL}/habits/${id}/history`, {
      headers: authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not load history");
    }

    return data.history || {};
  },
};