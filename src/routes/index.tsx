import { createFileRoute, Link } from "@tanstack/react-router";
import { Blocks, ShieldCheck, ArrowRight, Landmark, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LandChain — Blockchain Land Ownership" },
      { name: "description", content: "Verify, transfer and protect land titles on a tamper-proof blockchain ledger." },
      { property: "og:title", content: "LandChain" },
      { property: "og:description", content: "Blockchain-powered land ownership verification." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-elegant">
            <Blocks className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">LandChain</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
          <Link to="/register"><Button size="sm" className="bg-gradient-primary shadow-elegant">Get started</Button></Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Blockchain-secured titles
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Own your land. <span className="bg-gradient-primary bg-clip-text text-transparent">Prove it forever.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
            LandChain registers every parcel, owner and transfer on an immutable ledger — eliminating fraud, disputes and paperwork.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary shadow-elegant">
                Create free account <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/verify"><Button size="lg" variant="outline">Verify a land title</Button></Link>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
            <Stat label="Lands secured" value="48k+" />
            <Stat label="Transfers" value="12k+" />
            <Stat label="Disputes solved" value="99%" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-primary opacity-20 blur-3xl" />
          <div className="relative grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <FeatureRow icon={Landmark} title="Tokenized land titles" desc="Every parcel minted as a unique on-chain asset." />
            <FeatureRow icon={Network} title="Peer-verified network" desc="Government, surveyors and owners share one ledger." />
            <FeatureRow icon={ShieldCheck} title="Fraud-proof transfers" desc="Multi-signature approvals replace forged deeds." />
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureRow({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-background p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
