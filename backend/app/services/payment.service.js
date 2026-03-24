import { v4 as uuidv4 } from "uuid";
import { saveKey, getKey } from "../../core/storage/memory.store.js";

export async function processPayment({ txid, userAddress, apiId }) {

  console.log({ txid, userAddress, apiId });

  if (!txid || !userAddress) {
    throw new Error("txid and userAddress required");
  }

  const apiKey = uuidv4();
  saveKey(userAddress, apiKey, apiId ?? 1);

  return {
    success: true,
    apiKey,
    message: "Payment verified",
  };
}

export function fetchApiKey(address) {
  if (!address) {
    throw new Error("Address required");
  }

  const record = getKey(address);

  if (!record) {
    throw new Error("No API key found");
  }

  return {
    success: true,
    apiKey: record.key,
  };
}
