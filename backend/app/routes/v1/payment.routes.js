import { Router } from "express";
import {
  verifyPayment,
  getApiKey,
} from "../../controllers/payment.controller.js";

const router = Router();

router.post("/verify", verifyPayment);
router.get("/key", getApiKey);

export default router;
