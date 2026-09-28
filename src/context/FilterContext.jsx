// Filter context shared between the sidebar and the dashboard content area
// (time-of-day filter, grid/list view, the selected day on the date strip).
import { createContext, useContext, useState } from "react";
import { todayKey } from "../utils/date";

const FilterContext = createContext(null);
export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [timeOfDay, setTimeOfDay] = useState("all");
  const [view, setView] = useState("grid");
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey());

  return (
    <FilterContext.Provider
      value={{ timeOfDay, setTimeOfDay, view, setView, selectedDateKey, setSelectedDateKey }}
    >
      {children}
    </FilterContext.Provider>
  );
};