import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/layout/AuthShell";
import SocialButtons from "../components/layout/SocialButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Register() {
const { register, loading } = useAuth();  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

const handleGoogleRegister = async (credential) => {
  try {
    setError("");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/google/register-info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Google registration failed");
    }

    setForm((f) => ({
      ...f,
      name: data.name || "",
      email: data.email || "",
    }));

    toast({
      title: "Google account connected",
      description: "Now create a password to finish your Habitly account.",
    });
  } catch (err) {
    setError(err.message);
  }
};


  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    try {
      await register(form.name, form.email, form.password);
      toast({ title: "Account created", description: "Welcome to Habitly!" });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start building better habits today">
      <SocialButtons
  label="Sign up with"
  mode="register"
  onGoogleRegister={handleGoogleRegister}
/>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-500">
        <div className="h-px flex-1 bg-ink-700" />
        or sign up with email
        <div className="h-px flex-1 bg-ink-700" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose/10 px-3 py-2 text-sm text-rose">{error}</div>
        )}
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-400">Name</Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
            className="border-ink-700 bg-ink-800 text-white placeholder:text-ink-500 focus-visible:ring-brand-500"
            required
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-400">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="your-email@example.com"
            className="border-ink-700 bg-ink-800 text-white placeholder:text-ink-500 focus-visible:ring-brand-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-400">Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              className="border-ink-700 bg-ink-800 text-white placeholder:text-ink-500 focus-visible:ring-brand-500"
              required
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-400">Confirm</Label>
            <Input
              type="password"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              placeholder="•••••••••"
              className="border-ink-700 bg-ink-800 text-white placeholder:text-ink-500 focus-visible:ring-brand-500"
              required
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-brand-500 text-white hover:bg-brand-600">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">Sign in</Link>
      </p>

      <p className="mt-6 text-center text-xs text-ink-500">
        By continuing, you agree to our{" "}
        <span className="text-brand-400">Terms of Service</span> and{" "}
        <span className="text-brand-400">Privacy Policy</span>
      </p>
    </AuthShell>
  );
}