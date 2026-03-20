import { type Request, type Response, type NextFunction } from "express";
import { recordPayment, isTxUsed } from "../lib/storage.js";

const STACKS_API = "https://api.testnet.hiro.so";
const CONTRACT_ADDRESS = "ST1Q4E29HCNRQ5E24PW5E63CCTW63FGFP02SND6B";
const CONTRACT_NAME = "api-payments";

export interface X402Options {
  apiId: number;
  price: number;
  asset: string;
  description: string;
}

async function verifyStacksTx(txid: string): Promise<{
  valid: boolean;
  sender?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${STACKS_API}/extended/v1/tx/${txid}`);
    if (!res.ok) return { valid: false, error: "Transaction not found" };
    const tx = (await res.json()) as { tx_status: string; sender_address?: string };
    if (tx.tx_status === "success") {
      return { valid: true, sender: tx.sender_address };
    }
    return { valid: false, error: `Transaction not confirmed. Status: ${tx.tx_status}` };
  } catch {
    return { valid: false, error: "Failed to reach Stacks API" };
  }
}

export function x402Middleware(opts: X402Options) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const txid = req.headers["x-payment-tx"] as string | undefined;

    if (!txid) {
      res.status(402).json({
        x402Version: 1,
        error: "Payment Required",
        accepts: [
          {
            scheme: "stacks-contract",
            network: "stacks-testnet",
            asset: opts.asset,
            price: opts.price,
            resource: req.path,
            description: opts.description,
            payTo: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
            extra: {
              apiId: opts.apiId,
              contractAddress: CONTRACT_ADDRESS,
              contractName: CONTRACT_NAME,
              functionName: "record-payment",
            },
          },
        ],
      });
      return;
    }

    if (isTxUsed(txid)) {
      res.status(402).json({
        x402Version: 1,
        error: "Payment proof already used. Each request requires a fresh payment.",
      });
      return;
    }

    const { valid, sender, error } = await verifyStacksTx(txid);

    if (!valid) {
      res.status(402).json({
        x402Version: 1,
        error: error ?? "Payment verification failed",
      });
      return;
    }

    recordPayment({
      txid,
      address: sender ?? "unknown",
      apiId: opts.apiId,
      asset: opts.asset,
      amount: opts.price,
      verifiedAt: Date.now(),
    });

    next();
  };
}
