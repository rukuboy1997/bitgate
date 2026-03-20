import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketplaceRouter from "./marketplace";
import pricefeedRouter from "./pricefeed";
import earningsRouter from "./earnings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketplaceRouter);
router.use(pricefeedRouter);
router.use(earningsRouter);

export default router;
