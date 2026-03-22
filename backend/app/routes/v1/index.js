import { Router } from "express";

import healthRoutes from "./health.routes.js";
import marketplaceRoutes from "./marketplace.routes.js";
import paymentRoutes from "./payment.routes.js";
import earningsRoutes from "./earnings.routes.js";
import priceRoutes from "./price.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/payment", paymentRoutes);
router.use("/earnings", earningsRoutes);
router.use("/price", priceRoutes);

export default router;
