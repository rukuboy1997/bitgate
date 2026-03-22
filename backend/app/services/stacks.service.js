const STACKS_API = "https://api.testnet.hiro.so";

export async function getTransaction(txid) {
  const res = await fetch(`${STACKS_API}/extended/v1/tx/${txid}`);

  if (!res.ok) {
    throw new Error("Transaction not found on Stacks");
  }

  return res.json();
}

export async function verifyStacksPayment(txid) {
  const tx = await getTransaction(txid);

  if (tx.tx_status !== "success") {
    throw new Error(`Transaction not confirmed. Status: ${tx.tx_status}`);
  }

  return {
    valid: true,
    sender: tx.sender_address,
    tx,
  };
}
