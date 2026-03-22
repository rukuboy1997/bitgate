import { Router } from "express";
import { getPriceFeed } from "../../controllers/price.controller.js";
import { x402Middleware } from "../../middleware/x402.middleware.js";

const router = Router();

// GET /api/v1/price/feed
router.get(
  "/feed",
  x402Middleware({
    apiId: 1,
    price: 1,
    asset: "USDCx",
    description: "Pay per request for real-time price data",
  }),
  getPriceFeed
);

export default router;
