import {
  recordPayment,
  isTxUsed,
} from "../../core/storage/memory.store.js";

import { verifyStacksPayment } from "../services/stacks.service.js";

export function x402Middleware(opts) {
  return async (req, res, next) => {
    const txid = req.headers["x-payment-tx"];

    if (!txid) {
      return res.status(402).json({
        error: "Payment Required",
        accepts: [
          {
            asset: opts.asset,
            price: opts.price,
            apiId: opts.apiId,
          },
        ],
      });
    }

    // Prevent reuse
    if (isTxUsed(txid)) {
      return res.status(402).json({
        error: "Transaction already used",
      });
    }

    try {
      // 🔥 REAL BLOCKCHAIN VERIFICATION
      const { sender } = await verifyStacksPayment(txid);

      // Record payment
      recordPayment({
        txid,
        address: sender,
        apiId: opts.apiId,
        asset: opts.asset,
        amount: opts.price,
        verifiedAt: Date.now(),
      });

      next();
    } catch (err) {
      return res.status(402).json({
        error: err.message || "Payment verification failed",
      });
    }
  };
}
