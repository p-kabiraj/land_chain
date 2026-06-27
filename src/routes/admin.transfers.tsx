import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { transfers as initial, type TransferRequest } from "@/lib/mock-data";
import { StatusBadge } from "./dashboard";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/transfers")({
  head: () => ({ meta: [{ title: "Transfer Requests — Admin LandChain" }] }),
  component: AdminTransfers,
});

function AdminTransfers() {
  const [rows, setRows] = useState<TransferRequest[]>(initial);

  const decide = (id: string, status: "Approved" | "Rejected") => {
    setRows((r) => r.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success(`Transfer ${id} ${status.toLowerCase()}`);
  };

  return (
    <AppShell variant="admin" title="Transfer Requests" subtitle="Approve or reject pending ownership transfers">
      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Request</TableHead>
                  <TableHead>Land ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To Wallet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="font-mono text-xs">{t.landId}</TableCell>
                    <TableCell>{t.from}</TableCell>
                    <TableCell className="max-w-[160px] truncate font-mono text-xs">{t.toWallet}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-right">
                      {t.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => decide(t.id, "Approved")} className="bg-success text-success-foreground hover:opacity-90">
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => decide(t.id, "Rejected")} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Decided</span>
                      )}
                    </TableCell>
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
