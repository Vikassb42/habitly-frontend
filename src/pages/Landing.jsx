// Public landing page — light theme, original design inspired by the reference.
import { Link } from "react-router-dom";
import { Star, Flame, TrendingUp, CalendarCheck, Sparkles, ArrowRight, Check } from "lucide-react";
import StarRating from "../components/common/StarRating";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 35.5 27 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.5 40.6 16.2 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.1-3.8 5.5l6.5 5.5C41.9 36.5 45 30.8 45 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.6 2.1-3.9 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.6.9 1.3 2 2.7 3.4 2.7 1.4-.1 1.9-.9 3.5-.9s2.1.9 3.5.9c1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.4-3 1.4-3.1-.1 0-2.9-1.1-2.9-4.3zM14 4.6c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.5 3-1.5z"/></svg>
  );
}

const FEATURES = [
  { icon: CalendarCheck, title: "Track every habit", desc: "Log daily habits across morning, afternoon and evening routines in a clean, focused dashboard." },
  { icon: Flame, title: "Build streaks", desc: "Stay motivated with live streaks, skip days that don't break your run, and watch progress compound." },
  { icon: TrendingUp, title: "See your progress", desc: "Beautiful calendars and completion rates reveal exactly how consistent you've been over time." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-ink-950">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink-950/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-lg font-bold text-white">h</div>
            <span className="text-lg font-bold tracking-tight">Habitly</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-500 md:flex">
            <a href="#features" className="hover:text-ink-950">Features</a>
            <a href="#how" className="hover:text-ink-950">How it works</a>
            <a href="#pricing" className="hover:text-ink-950">Pricing</a>
            <a href="#story" className="hover:text-ink-950">Blog</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-lg bg-ink-950/[0.04] px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-ink-950/[0.08]">
              Sign In
            </Link>
            <Link to="/register" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-3 py-1 text-xs font-medium text-ink-500 shadow-sm">
            <Sparkles size={13} className="text-brand-500" /> Your daily habit companion
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-6xl">
            Build better habits,<br />build a better life.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-500">
            Harness the power of a personalized habit tracker to streamline your everyday
            routines, stay consistent, and actually achieve your goals.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-brand-500/40">
              Try Habitly Free <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-ink-950/10 px-6 py-3 text-base font-semibold text-ink-950 transition-colors hover:bg-ink-950/[0.03]">
              See how it works
            </a>
          </div>

          {/* Mock preview */}
          <div className="mx-auto mt-14 max-w-md text-left">
            <div className="rounded-2xl bg-ink-950 p-5 text-left shadow-2xl shadow-ink-950/20">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Today · Morning</span>
                <span className="text-xs text-mint">2 of 3 done</span>
              </div>
              {[
                { i: "🧘", n: "Morning Meditation", c: "#22D3EE", done: true },
                { i: "💧", n: "Drink 2L Water", c: "#3B66F5", done: true },
                { i: "🏃", n: "Evening Walk", c: "#34D399", done: false },
              ].map((h) => (
                <div key={h.n} className="mb-2 flex items-center gap-3 rounded-xl bg-ink-850 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: `${h.c}1A` }}>{h.i}</div>
                  <span className="flex-1 text-sm font-medium text-white">{h.n}</span>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${h.done ? "border-mint bg-mint text-ink-950" : "border-ink-600"}`}>
                    {h.done && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Everything you need to stay consistent</h2>
          <p className="mt-3 text-ink-500">Simple by design, powerful where it counts.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-ink-950/5 bg-ink-950/[0.02] p-6 transition-colors hover:bg-ink-950/[0.04]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                <f.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-ink-950">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Final CTA */}
      <section id="pricing" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Start building today</h2>
        <p className="mt-3 text-ink-500">It's free to start. No credit card required.</p>
        <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600">
          Get started free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-950/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-ink-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500 text-sm font-bold text-white">h</div>
            <span className="font-semibold text-ink-950">Habitly</span>
          </div>
          <p>© {new Date().getFullYear()} Habitly. Built for better habits.</p>
        </div>
      </footer>
    </div>
  );
}