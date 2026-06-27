import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Wallet, MapPin, Maximize, ShieldCheck } from "lucide-react";
import { findLand, type Land } from "@/lib/mock-data";
import { StatusBadge } from "./dashboard";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify Land — LandChain" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Land | null | undefined>(undefined);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(findLand(query.trim()) ?? null);
  };

  return (
    <AppShell title="Verify Land" subtitle="Cross-reference any land title against the blockchain">
      <Card className="shadow-card">
        <CardContent className="p-6">
          <form onSubmit={onSearch} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter Land ID e.g. LND-001A" className="pl-9 font-mono" />
            </div>
            <Button type="submit" className="bg-gradient-primary shadow-elegant">Verify on chain</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">Try: LND-001A, LND-003C, LND-005E</p>
        </CardContent>
      </Card>

      {result === null && (
        <Card className="mt-6 border-destructive/30 shadow-card">
          <CardContent className="p-6 text-center text-sm text-destructive">
            No land found with that ID on the blockchain.
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6 shadow-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Verified record</p>
                <h3 className="mt-1 truncate font-display text-xl font-bold">{result.id}</h3>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                <ShieldCheck className="h-3.5 w-3.5" /> On-chain
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Row icon={User} label="Owner Name" value={result.owner} />
              <Row icon={Wallet} label="Wallet Address" value={result.wallet} mono />
              <Row icon={MapPin} label="Location" value={result.location} />
              <Row icon={Maximize} label="Area" value={result.area} />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <span className="text-muted-foreground">Verification Status</span>
              <StatusBadge status={result.status} />
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

function Row({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`truncate font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
