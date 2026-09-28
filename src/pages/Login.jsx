import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/layout/AuthShell";
import SocialButtons from "../components/layout/SocialButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      toast({ title: "Welcome back!", description: "You're signed in." });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthShell title="Welcome to Habitly" subtitle="Your journey to better habits starts here">
      <SocialButtons label="Sign in with" />

      <div className="my-5 flex items-center gap-3 text-xs text-ink-500">
        <div className="h-px flex-1 bg-ink-700" />
        or continue with email
        <div className="h-px flex-1 bg-ink-700" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose/10 px-3 py-2 text-sm text-rose">{error}</div>
        )}
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-400">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="border-ink-700 bg-ink-800 text-white placeholder:text-ink-500 focus-visible:ring-brand-500"
            required
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-wide text-ink-400">Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border-ink-700 bg-ink-800 text-white placeholder:text-ink-500 focus-visible:ring-brand-500"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-brand-500 text-white hover:bg-brand-600">
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <div className="mt-5 space-y-2 text-center text-sm">
        <p className="text-ink-400">
          No account?{" "}
          <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300">Create an account</Link>
        </p>
        <p className="text-ink-400">
          Forgot password?{" "}
          <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">Reset here</Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-ink-500">
        By continuing, you agree to our{" "}
        <span className="text-brand-400">Terms of Service</span> and{" "}
        <span className="text-brand-400">Privacy Policy</span>
      </p>
    </AuthShell>
  );
}