import { useState } from "react";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { useStacks } from "./use-stacks";
import { useToast } from "./use-toast";
import { API_BASE } from "@/lib/api";

export interface X402Response {
  x402Version: number;
  error: string;
  accepts: Array<{
    asset: string;
    price: number;
    description: string;
    payTo: string;
    extra: {
      apiId: number;
      contractAddress: string;
      contractName: string;
      functionName: string;
    };
  }>;
}

export type X402Stage =
  | { type: "idle" }
  | { type: "calling" }
  | { type: "requires_payment"; details: X402Response }
  | { type: "waiting_wallet" }
  | { type: "verifying"; txid: string }
  | { type: "success"; data: unknown; txid: string }
  | { type: "error"; message: string };

export function useX402(endpoint: string) {
  const { address, isConnected, connect } = useStacks();
  const { toast } = useToast();
  const [stage, setStage] = useState<X402Stage>({ type: "idle" });

  async function callEndpoint(txid?: string): Promise<void> {
    setStage({ type: "calling" });
    const headers: Record<string, string> = {};
    if (txid) headers["x-payment-tx"] = txid;

    const res = await fetch(`${API_BASE}${endpoint}`, { headers });

    if (res.status === 402) {
      const body = (await res.json()) as X402Response;
      setStage({ type: "requires_payment", details: body });
      return;
    }

    if (!res.ok) {
      const err = await res.text();
      setStage({ type: "error", message: err });
      return;
    }

    const data = await res.json();
    setStage({ type: "success", data, txid: txid ?? "" });
  }

  function pay(details: X402Response) {
    if (!isConnected || !address) {
      connect();
      return;
    }
    const accept = details.accepts[0];
    if (!accept) return;

    setStage({ type: "waiting_wallet" });

    openContractCall({
      network: STACKS_TESTNET,
      contractAddress: accept.extra.contractAddress,
      contractName: accept.extra.contractName,
      functionName: accept.extra.functionName,
      functionArgs: [
        uintCV(accept.extra.apiId),
        uintCV(accept.price),
        stringAsciiCV(accept.asset),
      ],
      onFinish: (data) => {
        toast({
          title: "Payment sent",
          description: "Verifying transaction on Stacks…",
        });
        const txid = data.txId;
        setStage({ type: "verifying", txid });
        callEndpoint(txid);
      },
      onCancel: () => {
        setStage({ type: "idle" });
        toast({ title: "Payment cancelled" });
      },
    });
  }

  function reset() {
    setStage({ type: "idle" });
  }

  return { stage, callEndpoint, pay, reset };
}
