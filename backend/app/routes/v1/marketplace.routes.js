import { Router } from "express";
import { getApis } from "../../controllers/marketplace.controller.js";

const router = Router();

router.get("/apis", getApis);

export default router;
