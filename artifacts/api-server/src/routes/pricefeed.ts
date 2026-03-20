import { Router, type IRouter } from "express";
import { x402Middleware } from "../middleware/x402.js";

const router: IRouter = Router();

router.get(
  "/price-feed",
  x402Middleware({
    apiId: 1,
    price: 1,
    asset: "USDCx",
    description: "Pay 1 USDCx per request for real-time crypto price data",
  }),
  (_req, res) => {
    const base = 97800 + Math.floor(Math.random() * 400 - 200);
    res.json({
      BTC: base,
      STX: parseFloat((1.8 + Math.random() * 0.2).toFixed(4)),
      ETH: parseFloat((3200 + Math.random() * 100 - 50).toFixed(2)),
      USDCx: 1.0,
      sBTC: parseFloat((base * 0.00001).toFixed(8)),
      timestamp: Date.now(),
      source: "BitGate",
      paidWith: "USDCx",
    });
  }
);

export default router;
