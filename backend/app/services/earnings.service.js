import { payments } from "../../core/storage/memory.store.js";

export function calculateEarnings() {
  const byAsset = {};

  for (const p of payments) {
    byAsset[p.asset] = (byAsset[p.asset] || 0) + p.amount;
  }

  return {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    byAsset,
    totalCalls: payments.length,
    recentPayments: payments.slice(-10).reverse(),
  };
}
