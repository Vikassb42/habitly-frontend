// Centered dark card wrapper shared by the Login + Register pages.
import { Link } from "react-router-dom";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-bold text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-105">
            h
          </Link>
        </div>
        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-ink-400">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}