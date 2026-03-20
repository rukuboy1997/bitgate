import { Router, type IRouter } from "express";
import { getEarnings } from "../lib/storage.js";

const router: IRouter = Router();

router.get("/earnings", (_req, res) => {
  res.json(getEarnings());
});

export default router;
