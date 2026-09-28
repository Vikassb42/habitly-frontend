import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { habitsApi } from "../services/api";
import { useAuth } from "./AuthContext";

const HabitContext = createContext(null);

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await habitsApi.list();
      setHabits(data);
    } catch (error) {
      console.error("Failed to load habits:", error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load habits whenever the logged-in user changes.
  useEffect(() => {
    if (user?.id) {
      refresh();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user?.id, refresh]);

  const addHabit = useCallback(async (habit) => {
    const created = await habitsApi.create(habit);

    setHabits((prev) => [...prev, created]);

    return created;
  }, []);

  const updateHabit = useCallback(async (id, data) => {
    const updated = await habitsApi.update(id, data);

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? updated : h))
    );

    return updated;
  }, []);

  const removeHabit = useCallback(async (id) => {
    await habitsApi.remove(id);

    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleComplete = useCallback(async (id, dateKey) => {
    const updated = await habitsApi.toggleComplete(id, dateKey);

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? updated : h))
    );

    return updated;
  }, []);

  const setDayStatus = useCallback(async (id, dateKey, status) => {
    const updated = await habitsApi.setDayStatus(
      id,
      dateKey,
      status
    );

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? updated : h))
    );

    return updated;
  }, []);

  const getHabit = useCallback(
    (id) => habits.find((h) => h.id === id),
    [habits]
  );

  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        refresh,
        addHabit,
        updateHabit,
        removeHabit,
        toggleComplete,
        setDayStatus,
        getHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};