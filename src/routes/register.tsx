import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Phone, User, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";
import { useAuth } from "../lib/auth";

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validateWalletAddress = (value: string) =>
  /^0x[a-fA-F0-9]{40}$/.test(value.trim()) || /^G[A-Z2-7]{55}$/.test(value.trim());
const normalizePhone = (value: string) => value.trim().replace(/[\s()-]/g, "");
const validatePhone = (value: string) => {
  const normalized = normalizePhone(value);
  return /^\+?[0-9]{9,15}$/.test(normalized);
};

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — LandChain" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validateWalletAddress(wallet)) {
      toast.error("Please enter a valid Ethereum or Stellar wallet address.");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const profile = { fullName: name.trim(), email: email.trim(), wallet: wallet.trim(), phone: phone.trim() };
      setUser(profile);
      toast.success("Account created. Welcome to LandChain!");
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <AuthShell title="Create your account" subtitle="Start registering and verifying land titles on-chain">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="name" label="Full name" icon={User} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        <Field id="email" label="Email" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Field id="wallet" label="Wallet address (Ethereum or Stellar)" icon={Wallet} value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="0x... or G..." />
        <Field id="phone" label="Phone" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" />
        <Field id="password" label="Password" icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-elegant">
          {loading ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
