import { Router, type IRouter } from "express";

const router: IRouter = Router();

const MARKETPLACE_APIS = [
  {
    id: 1,
    name: "AI Bitcoin Predictor",
    description: "Real-time BTC price predictions powered by on-chain data and machine learning models.",
    price: 10,
    asset: "USDCx",
    endpoint: "/api/price-feed",
    usageCount: 42,
    earnings: 420,
    category: "Finance",
  },
  {
    id: 2,
    name: "Stacks NFT Metadata",
    description: "Fetch NFT metadata, traits, and ownership history for any Stacks NFT collection.",
    price: 5,
    asset: "USDCx",
    endpoint: "/api/nft-metadata",
    usageCount: 18,
    earnings: 90,
    category: "NFT",
  },
  {
    id: 3,
    name: "sBTC Price Oracle",
    description: "High-frequency sBTC/USD price oracle with sub-minute updates sourced from multiple DEXs.",
    price: 2,
    asset: "sBTC",
    endpoint: "/api/price-feed",
    usageCount: 87,
    earnings: 174,
    category: "DeFi",
  },
  {
    id: 4,
    name: "On-chain Sentiment",
    description: "Bitcoin on-chain sentiment score derived from mempool activity and whale movements.",
    price: 8,
    asset: "USDCx",
    endpoint: "/api/sentiment",
    usageCount: 31,
    earnings: 248,
    category: "Analytics",
  },
];

router.get("/apis", (_req, res) => {
  res.json(MARKETPLACE_APIS);
});

export default router;
