const MARKETPLACE_APIS = [
  {
    id: 1,
    name: "AI Bitcoin Predictor",
    price: 10,
    asset: "USDCx",
  },
  {
    id: 2,
    name: "Stacks NFT Metadata",
    price: 5,
    asset: "USDCx",
  },
];

export function getApis(req, res) {
  res.json(MARKETPLACE_APIS);
}
