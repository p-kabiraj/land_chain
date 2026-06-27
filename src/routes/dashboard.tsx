import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Landmark, ArrowLeftRight, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lands, transfers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LandChain" }] }),
  component: Dashboard,
});

function Dashboard() {
  const total = lands.length;
  const verified = lands.filter((l) => l.status === "Verified").length;
  const pending = transfers.filter((t) => t.status === "Pending").length;

  return (
    <AppShell title="Dashboard" subtitle="Overview of your land portfolio">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Landmark} label="Total Lands Owned" value={total} hint="+2 this quarter" tone="primary" />
        <StatCard icon={ArrowLeftRight} label="Pending Transfers" value={pending} hint="Awaiting approval" tone="warning" />
        <StatCard icon={ShieldCheck} label="Blockchain Verified" value={verified} hint={`${Math.round((verified / total) * 100)}% of portfolio`} tone="success" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Recent Lands</h3>
                <p className="text-sm text-muted-foreground">Your most recently registered parcels</p>
              </div>
              <Link to="/lands"><Button variant="ghost" size="sm">View all <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            </div>
            <div className="mt-4 divide-y divide-border">
              {lands.slice(0, 4).map((l) => (
                <div key={l.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{l.location}</p>
                    <p className="truncate text-xs text-muted-foreground font-mono">{l.id} · {l.area}</p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-bold">Activity</h3>
            </div>
            <ul className="mt-4 space-y-4 text-sm">
              {transfers.slice(0, 3).map((t) => (
                <li key={t.id} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p className="truncate"><span className="font-medium">{t.id}</span> · {t.landId}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.status} · {t.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value, hint, tone }: { icon: any; label: string; value: number; hint: string; tone: "primary" | "success" | "warning" }) {
  const toneClass =
    tone === "success" ? "bg-success/10 text-success" :
    tone === "warning" ? "bg-warning/15 text-warning-foreground" :
    "bg-primary/10 text-primary";
  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-4xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Verified" || status === "Approved" ? "bg-success/15 text-success border-success/30" :
    status === "Pending" ? "bg-warning/20 text-warning-foreground border-warning/30" :
    "bg-destructive/15 text-destructive border-destructive/30";
  return <Badge variant="outline" className={cls}>{status}</Badge>;
}
