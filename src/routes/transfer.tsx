import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, ArrowLeftRight } from "lucide-react";
import { lands } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/transfer")({
  head: () => ({ meta: [{ title: "Transfer Land — LandChain" }] }),
  component: TransferPage,
});

function TransferPage() {
  const [land, setLand] = useState("");
  const [wallet, setWallet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!land || !wallet || !file) {
      toast.error("Please complete all fields");
      return;
    }
    toast.success("Transfer request submitted to blockchain");
    setLand(""); setWallet(""); setFile(null);
  };

  return (
    <AppShell title="Transfer Land" subtitle="Initiate a secure on-chain ownership transfer">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label>Select Land</Label>
                <Select value={land} onValueChange={setLand}>
                  <SelectTrigger><SelectValue placeholder="Choose a parcel" /></SelectTrigger>
                  <SelectContent>
                    {lands.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.id} — {l.location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wallet">New Owner Wallet Address</Label>
                <Input id="wallet" placeholder="0x..." value={wallet} onChange={(e) => setWallet(e.target.value)} className="font-mono" />
              </div>

              <div className="space-y-1.5">
                <Label>Sale Agreement</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center hover:border-primary/50 hover:bg-primary/5">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">{file ? file.name : "Click to upload sale agreement"}</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full bg-gradient-primary shadow-elegant">
                <ArrowLeftRight className="mr-2 h-4 w-4" /> Submit Transfer Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-4 p-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold">How transfers work</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <Step n={1} text="Submit the request with the new owner's wallet and a signed sale agreement." />
              <Step n={2} text="An admin verifies the documents against on-chain records." />
              <Step n={3} text="Once approved, ownership is transferred on the blockchain — irreversibly." />
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{n}</span>
      <span>{text}</span>
    </li>
  );
}
