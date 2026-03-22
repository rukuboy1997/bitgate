import { Router } from "express";
import { getEarnings } from "../../controllers/earnings.controller.js";

const router = Router();

// GET /api/v1/earnings
router.get("/", getEarnings);

export default router;
