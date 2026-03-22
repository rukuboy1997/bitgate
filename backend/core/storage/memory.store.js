const apiKeys = new Map();
export const payments = [];
const usedTxIds = new Set();

export function saveKey(address, key, apiId) {
  apiKeys.set(address, { key, apiId });
}

export function getKey(address) {
  return apiKeys.get(address) || null;
}

export function recordPayment(payment) {
  payments.push(payment);
  usedTxIds.add(payment.txid);
}

export function isTxUsed(txid) {
  return usedTxIds.has(txid);
}
