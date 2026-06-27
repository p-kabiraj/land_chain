import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/add-land")({
  head: () => ({ meta: [{ title: "Add Land — Admin LandChain" }] }),
  component: AddLand,
});

function AddLand() {
  return (
    <AppShell variant="admin" title="Add New Land" subtitle="Register a new parcel onto the blockchain">
      <Card className="shadow-card">
        <CardContent className="p-6">
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Land minted on blockchain"); }}>
            <Field label="Land ID" placeholder="LND-006F" />
            <Field label="Owner Name" placeholder="Jane Doe" />
            <Field label="Owner Wallet" placeholder="0x..." mono />
            <Field label="Area" placeholder="2.5 acres" />
            <div className="sm:col-span-2">
              <Field label="Location" placeholder="Greenfield Estate, Nairobi" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Description / Notes</Label>
              <Textarea placeholder="Boundary description, survey reference, etc." rows={4} />
            </div>
            <div className="sm:col-span-2 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline">Save draft</Button>
              <Button type="submit" className="bg-gradient-primary shadow-elegant">
                <PlusSquare className="mr-2 h-4 w-4" /> Mint Land Title
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Field({ label, mono, ...props }: { label: string; mono?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input className={mono ? "font-mono text-xs" : ""} {...props} />
    </div>
  );
}
