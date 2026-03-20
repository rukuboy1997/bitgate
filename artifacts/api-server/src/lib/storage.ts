export interface PaymentRecord {
  txid: string;
  address: string;
  apiId: number;
  asset: string;
  amount: number;
  verifiedAt: number;
}

const usedTxIds = new Set<string>();
const payments: PaymentRecord[] = [];

export function recordPayment(record: PaymentRecord): void {
  usedTxIds.add(record.txid);
  payments.push(record);
}

export function isTxUsed(txid: string): boolean {
  return usedTxIds.has(txid);
}

export function getEarnings(): {
  total: number;
  byAsset: Record<string, number>;
  totalCalls: number;
  recentPayments: PaymentRecord[];
} {
  const byAsset: Record<string, number> = {};
  for (const p of payments) {
    byAsset[p.asset] = (byAsset[p.asset] ?? 0) + p.amount;
  }
  return {
    total: payments.reduce((s, p) => s + p.amount, 0),
    byAsset,
    totalCalls: payments.length,
    recentPayments: payments.slice(-10).reverse(),
  };
}
