import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import { AppAuthProvider } from "@/context/AuthContext";
import { HabitProvider } from "@/context/HabitContext";
import { FilterProvider } from "@/context/FilterContext";
import RequireAuth from "@/components/RequireAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import Profile from "@/pages/Profile";
import HabitDetails from "@/pages/HabitDetails";
import PageNotFound from "./lib/PageNotFound";
import Resources from "@/pages/Resources";
import Reminders from "@/pages/Reminders";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AppAuthProvider>
        <HabitProvider>
          <Router>
            <ScrollToTop />

            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated app shell */}
              <Route
                element={
                  <RequireAuth>
                    <FilterProvider>
                      <DashboardLayout />
                    </FilterProvider>
                  </RequireAuth>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/habits/:id" element={<HabitDetails />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>

            <Toaster />
          </Router>
        </HabitProvider>
      </AppAuthProvider>
    </QueryClientProvider>
  );
}

export default App;