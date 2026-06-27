import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { useEffect, useState } from "react";
import {
  isStellarAddress,
  getAccountExplorerUrl,
  getTransactionExplorerUrl,
  loadStellarAccount,
  fetchRecentTransactions,
  fundTestnetAddress,
  connectFreighterPublicKey,
  getFreighterNetwork,
} from "../lib/stellar";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — LandChain" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    wallet: user?.wallet ?? "",
  });
  const [network, setNetwork] = useState<"public" | "testnet">("public");
  const [walletStatus, setWalletStatus] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletChecking, setWalletChecking] = useState(false);
  const [transactions, setTransactions] = useState<Array<{ hash: string; memo: string | null; createdAt: string; successful: boolean }>>([]);
  const [freighterAvailable, setFreighterAvailable] = useState(false);
  const [freighterNetwork, setFreighterNetwork] = useState<string | null>(null);
  const [funding, setFunding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFreighterAvailable(!!window.freighterApi);
      getFreighterNetwork().then((networkName) => {
        if (networkName) setFreighterNetwork(networkName);
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        wallet: user.wallet,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!profile.wallet || !isStellarAddress(profile.wallet)) {
      setWalletStatus(null);
      setWalletError(profile.wallet ? "Enter a valid Stellar wallet address to verify account status." : null);
      setWalletChecking(false);
      setTransactions([]);
      return;
    }

    setWalletChecking(true);
    setWalletStatus(null);
    setWalletError(null);
    setTransactions([]);

    loadStellarAccount(profile.wallet, network)
      .then((account) => {
        setWalletStatus(`Account exists on Stellar ${network} network with ${account.balances.length} balance entries.`);
        return fetchRecentTransactions(profile.wallet, network);
      })
      .then((recent) => setTransactions(recent))
      .catch((error) => {
        setWalletError(error instanceof Error ? error.message : "Unable to verify wallet status.");
      })
      .finally(() => setWalletChecking(false));
  }, [profile.wallet, network]);

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(profile);
    toast.success("Profile updated");
  };

  const handleConnectFreighter = async () => {
    try {
      const publicKey = await connectFreighterPublicKey();
      const updatedProfile = { ...profile, wallet: publicKey };
      setProfile(updatedProfile);
      setUser(updatedProfile);
      toast.success("Freighter wallet connected.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to connect Freighter wallet.");
    }
  };

  const handleFundTestnet = async () => {
    if (!profile.wallet || !isStellarAddress(profile.wallet)) {
      toast.error("Enter a valid Stellar address before funding.");
      return;
    }

    setFunding(true);
    try {
      await fundTestnetAddress(profile.wallet);
      toast.success("Testnet wallet funded successfully.");
      setNetwork("testnet");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Testnet funding failed.");
    } finally {
      setFunding(false);
    }
  };

  const accountUrl = profile.wallet && isStellarAddress(profile.wallet) ? getAccountExplorerUrl(profile.wallet, network) : null;
  const canUseStellar = Boolean(profile.wallet && isStellarAddress(profile.wallet));

  return (
    <AppShell title="Profile" subtitle="Manage your account and wallet">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-primary text-3xl font-bold text-primary-foreground shadow-elegant">
              {profile.fullName ? profile.fullName.split(" ").map((part) => part[0]).join("") : "LU"}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{profile.fullName || "LandChain User"}</h3>
            <p className="text-sm text-muted-foreground">{profile.email || "No email provided"}</p>
            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-xs">
              <p className="text-muted-foreground">Wallet</p>
              <p className="mt-1 font-mono break-all">{profile.wallet || "Not set"}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-left">
                <Button
                  type="button"
                  size="sm"
                  variant={network === "public" ? "default" : "secondary"}
                  onClick={() => setNetwork("public")}
                >
                  Public
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={network === "testnet" ? "default" : "secondary"}
                  onClick={() => setNetwork("testnet")}
                >
                  Testnet
                </Button>
              </div>
              {accountUrl ? (
                <a
                  href={accountUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  View on Stellar Expert ({network})
                </a>
              ) : null}
              {freighterAvailable ? (
                <Button type="button" size="sm" className="mt-3 w-full" onClick={handleConnectFreighter}>
                  Connect Freighter Wallet
                </Button>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Install Freighter to connect your Stellar wallet.</p>
              )}
              {freighterNetwork ? <p className="mt-2 text-xs text-muted-foreground">Freighter network: {freighterNetwork}</p> : null}
              {network === "testnet" ? (
                <Button
                  type="button"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={handleFundTestnet}
                  disabled={funding}
                >
                  {funding ? "Funding…" : "Fund Testnet Wallet"}
                </Button>
              ) : null}
              {freighterNetwork ? <p className="mt-2 text-xs text-muted-foreground">Freighter network: {freighterNetwork}</p> : null}
              <div className="mt-3 text-left text-xs">
                {walletChecking ? (
                  <p className="text-muted-foreground">Checking Stellar account status…</p>
                ) : walletStatus ? (
                  <p className="text-success">{walletStatus}</p>
                ) : walletError ? (
                  <p className="text-destructive">{walletError}</p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold">Account information</h3>
              <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
                <Group label="Full name" value={profile.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                <Group label="Email" type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} />
                <Group label="Phone" value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                <div className="sm:col-span-2">
                  <Group label="Wallet address" value={profile.wallet} onChange={(e) => handleChange("wallet", e.target.value)} mono />
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <Button type="submit" className="bg-gradient-primary shadow-elegant">Save changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold">Recent Stellar Transactions</h3>
                <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">{network}</span>
              </div>
              {canUseStellar ? (
                transactions.length ? (
                  <div className="mt-4 space-y-3 text-sm">
                    {transactions.map((tx) => (
                      <div key={tx.hash} className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-medium">Txn Hash</p>
                            <p className="font-mono text-xs truncate">{tx.hash}</p>
                          </div>
                          <a
                            href={getTransactionExplorerUrl(tx.hash, network)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            View on Stellar Expert
                          </a>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>Memo: {tx.memo || "None"}</p>
                          <p>Created: {new Date(tx.createdAt).toLocaleString()}</p>
                          <p>Status: {tx.successful ? "Successful" : "Failed"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : walletChecking ? (
                  <p className="mt-4 text-sm text-muted-foreground">Loading transactions…</p>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No recent Stellar transaction history available yet.</p>
                )
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Enter a valid Stellar wallet address to load transactions.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold">Soroban (Stellar Smart Contracts)</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Soroban is Stellar's smart contract platform for building on-chain logic. It supports custom assets, token transfers, escrow, and business workflows.
                In this app, Soroban can be used later to automate land ownership rules, escrow payments, and transaction-based ownership proofs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Group({ label, mono, ...props }: { label: string; mono?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input className={mono ? "font-mono text-xs" : ""} {...props} />
    </div>
  );
}
