import { Router, type IRouter } from "express";
import { v4 as uuidv4 } from "uuid";
import { saveKey, getKey } from "../lib/storage.js";

const router: IRouter = Router();

const STACKS_API = "https://api.testnet.hiro.so";

router.post("/payment/verify", async (req, res) => {
  const { txid, userAddress, apiId } = req.body as {
    txid: string;
    userAddress: string;
    apiId: number;
  };

  if (!txid || !userAddress) {
    res.status(400).json({ error: "txid and userAddress are required" });
    return;
  }

  try {
    const response = await fetch(`${STACKS_API}/extended/v1/tx/${txid}`);

    if (!response.ok) {
      res.status(400).json({ error: "Transaction not found on blockchain" });
      return;
    }

    const tx = (await response.json()) as { tx_status: string };

    if (tx.tx_status !== "success") {
      res.status(400).json({
        error: `Transaction not confirmed yet. Status: ${tx.tx_status}`,
      });
      return;
    }

    const apiKey = uuidv4();
    saveKey(userAddress, apiKey, apiId ?? 1);

    res.json({ success: true, apiKey, message: "Payment verified. API key issued." });
  } catch {
    res.status(500).json({ error: "Failed to verify transaction" });
  }
});

router.get("/payment/key", (req, res) => {
  const address = req.query["address"] as string;
  if (!address) {
    res.status(400).json({ error: "address query param required" });
    return;
  }

  const record = getKey(address);
  if (!record) {
    res.status(404).json({ error: "No API key found for this address" });
    return;
  }

  res.json({ success: true, apiKey: record.key });
});

export default router;
