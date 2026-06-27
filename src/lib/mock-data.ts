export type LandStatus = "Verified" | "Pending" | "Disputed";

export interface Land {
  id: string;
  location: string;
  area: string;
  status: LandStatus;
  owner: string;
  wallet: string;
  registered: string;
}

export interface TransferRequest {
  id: string;
  landId: string;
  from: string;
  toWallet: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

export const lands: Land[] = [
  { id: "LND-001A", location: "Greenfield Estate, Nairobi", area: "2.4 acres", status: "Verified", owner: "Amani Otieno", wallet: "0x9F2c...A41b", registered: "2024-03-12" },
  { id: "LND-002B", location: "Riverside Park, Kisumu", area: "1.1 acres", status: "Pending", owner: "Amani Otieno", wallet: "0x9F2c...A41b", registered: "2024-07-04" },
  { id: "LND-003C", location: "Highland Ridge, Eldoret", area: "5.0 acres", status: "Verified", owner: "Amani Otieno", wallet: "0x9F2c...A41b", registered: "2023-11-22" },
  { id: "LND-004D", location: "Coastal Plot, Mombasa", area: "0.75 acres", status: "Disputed", owner: "Amani Otieno", wallet: "0x9F2c...A41b", registered: "2024-01-09" },
  { id: "LND-005E", location: "Savanna Block, Nakuru", area: "3.2 acres", status: "Verified", owner: "Amani Otieno", wallet: "0x9F2c...A41b", registered: "2024-05-30" },
];

export const transfers: TransferRequest[] = [
  { id: "TRF-1001", landId: "LND-002B", from: "Amani Otieno", toWallet: "0x44eA...B129", date: "2026-06-20", status: "Pending" },
  { id: "TRF-1002", landId: "LND-005E", from: "Joseph Mwangi", toWallet: "0x9F2c...A41b", date: "2026-06-18", status: "Pending" },
  { id: "TRF-1003", landId: "LND-003C", from: "Amani Otieno", toWallet: "0x77Ba...01Ff", date: "2026-06-10", status: "Approved" },
];

export function findLand(id: string) {
  return lands.find((l) => l.id.toLowerCase() === id.toLowerCase());
}
