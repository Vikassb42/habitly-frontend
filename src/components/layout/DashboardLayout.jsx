// Authenticated app shell: responsive sidebar + scrolling content area.
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, User } from "lucide-react";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 border-r border-ink-800 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full border-r border-ink-800">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-ink-800 px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="text-ink-300">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-white">Habitly</span>
          <Link to="/profile" className="text-ink-300">
            <User size={20} />
          </Link>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}