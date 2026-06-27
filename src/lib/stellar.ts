import { Server } from "stellar-sdk";

export type StellarNetwork = "public" | "testnet";

const HORIZON_URL: Record<StellarNetwork, string> = {
  public: "https://horizon.stellar.org",
  testnet: "https://horizon-testnet.stellar.org",
};

declare global {
  interface Window {
    freighterApi?: {
      isConnected?: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
      getNetwork?: () => Promise<string>;
    };
  }
}

export const isStellarAddress = (value: string) => /^G[A-Z2-7]{55}$/.test(value.trim());

export const getServer = (network: StellarNetwork) => new Server(HORIZON_URL[network]);

export async function loadStellarAccount(address: string, network: StellarNetwork) {
  return getServer(network).loadAccount(address);
}

export async function fetchRecentTransactions(address: string, network: StellarNetwork) {
  const response = await getServer(network)
    .transactions()
    .forAccount(address)
    .order("desc")
    .limit(5)
    .call();

  return response.records.map((record: any) => ({
    hash: record.hash,
    memo: record.memo || null,
    createdAt: record.created_at,
    successful: record.successful,
  }));
}

export async function fundTestnetAddress(address: string) {
  const response = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`);

  if (!response.ok) {
    throw new Error(`Friendbot funding failed: ${response.statusText}`);
  }

  return response.json();
}

export function getAccountExplorerUrl(address: string, network: StellarNetwork) {
  if (network === "public") {
    return `https://stellar.expert/explorer/public/account/${address}`;
  }
  return `https://stellar.expert/explorer/testnet/account/${address}`;
}

export function getTransactionExplorerUrl(hash: string, network: StellarNetwork) {
  if (network === "public") {
    return `https://stellar.expert/explorer/public/tx/${hash}`;
  }
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export async function connectFreighterPublicKey() {
  if (typeof window === "undefined" || !window.freighterApi) {
    throw new Error("Freighter wallet is not installed.");
  }

  return window.freighterApi.getPublicKey();
}

export async function getFreighterNetwork() {
  if (typeof window === "undefined" || !window.freighterApi || !window.freighterApi.getNetwork) {
    return null;
  }

  return window.freighterApi.getNetwork();
}
