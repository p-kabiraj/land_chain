import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Blocks, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth, type UserProfile } from "../lib/auth";

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validateWalletAddress = (value: string) =>
  /^0x[a-fA-F0-9]{40}$/.test(value.trim()) || /^G[A-Z2-7]{55}$/.test(value.trim());

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — LandChain" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const identifier = email.trim();

    if (!identifier) {
      toast.error("Please enter your email or wallet address.");
      return;
    }

    if (!validateEmail(identifier) && !validateWalletAddress(identifier)) {
      toast.error("Please enter a valid email or wallet address.");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("landchain_current_user") : null;
      if (stored) {
        try {
          const profile = JSON.parse(stored) as UserProfile;
          const matchesEmail = validateEmail(identifier) && profile.email.toLowerCase() === identifier.toLowerCase();
          const matchesWallet = validateWalletAddress(identifier) && profile.wallet.trim() === identifier;
          if (matchesEmail || matchesWallet) {
            setUser(profile);
            toast.success("Welcome back to LandChain");
            navigate({ to: "/dashboard" });
            return;
          }
        } catch {
          // ignore
        }
      }

      toast.error("No matching account found. Please register first.");
      setLoading(false);
    }, 500);
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to manage your land portfolio">
    <form onSubmit={onSubmit} className="space-y-4">
      <Field id="email" value={email} onChange={(e) => setEmail(e.target.value)} label="Email or Wallet address" icon={Mail} placeholder="you@example.com or G..." />
      <Field id="password" value={password} onChange={(e) => setPassword(e.target.value)} label="Password" icon={Lock} type="password" placeholder="••••••••" />
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input type="checkbox" className="rounded border-border" /> Remember me
        </label>
        <a className="text-primary hover:underline" href="#">Forgot password?</a>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-elegant">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to LandChain? <Link to="/register" className="font-medium text-primary hover:underline">Create account</Link>
      </p>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-primary p-12 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur">
            <Blocks className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold">LandChain</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">Land records that can't be forged.</h2>
          <p className="mt-4 max-w-md text-primary-foreground/85">
            Every title, every transfer, written to an immutable blockchain. Transparent, instant, irrefutable.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div><p className="font-display text-2xl font-bold">48k+</p><p className="opacity-80">Parcels</p></div>
            <div><p className="font-display text-2xl font-bold">12k+</p><p className="opacity-80">Transfers</p></div>
            <div><p className="font-display text-2xl font-bold">99%</p><p className="opacity-80">Verified</p></div>
          </div>
        </div>
        <p className="text-xs text-primary-foreground/70">© 2026 LandChain. Secured on chain.</p>
      </div>
      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary">
              <Blocks className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">LandChain</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ id, label, icon: Icon, ...props }: { id: string; label: string; icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} className="pl-9" {...props} />
      </div>
    </div>
  );
}
