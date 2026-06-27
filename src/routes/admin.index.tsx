import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Landmark, Inbox, CheckCircle2, Users } from "lucide-react";
import { lands, transfers } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — LandChain" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const pending = transfers.filter((t) => t.status === "Pending").length;
  const verified = lands.filter((l) => l.status === "Verified").length;

  return (
    <AppShell variant="admin" title="Admin Dashboard" subtitle="Manage the LandChain registry">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Landmark} label="Total Lands" value={lands.length} tone="primary" />
        <StatCard icon={CheckCircle2} label="Verified" value={verified} tone="success" />
        <StatCard icon={Inbox} label="Pending Requests" value={pending} tone="warning" />
        <StatCard icon={Users} label="Registered Owners" value={128} tone="primary" />
      </div>

      <Card className="mt-6 shadow-card">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-display text-lg font-bold">All Lands</h3>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Land ID</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lands.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{l.id}</TableCell>
                    <TableCell>{l.owner}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{l.location}</TableCell>
                    <TableCell>{l.area}</TableCell>
                    <TableCell><StatusBadge status={l.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "primary" | "success" | "warning" }) {
  const toneClass =
    tone === "success" ? "bg-success/10 text-success" :
    tone === "warning" ? "bg-warning/20 text-warning-foreground" :
    "bg-primary/10 text-primary";
  return (
    <Card className="shadow-card">
      <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl font-bold">{value}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
