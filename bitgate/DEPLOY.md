# BitGate — Clarity Contract Deployment Guide

## Contracts

| Contract | File | Description |
|---|---|---|
| `api-registry` | `contracts/api-registry.clar` | Stores API metadata, usage, and earnings |
| `api-payments` | `contracts/api-payments.clar` | Records payments, updates registry |

> **Deploy order:** `api-registry` must be deployed **before** `api-payments`, since the payments contract calls into the registry.

---

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) v2.x installed
- A Stacks wallet with STX for deployment fees
- [Hiro Wallet](https://wallet.hiro.so/) or a private key

---

## Local Development

### Check contracts
```bash
clarinet check
```

### Start a local devnet (simulated blockchain)
```bash
clarinet devnet start
```

### Run REPL interactively
```bash
clarinet console
```

Inside the REPL, try:
```clarity
;; Register an API
(contract-call? .api-registry register-api "My API" u100 "STX" "https://api.example.com")

;; Get API info
(contract-call? .api-registry get-api u1)

;; Record a payment with asset type
(contract-call? .api-payments record-payment u1 u10 "USDCx")
(contract-call? .api-payments record-payment u2 u3 "sBTC")

;; Get full payment record
(contract-call? .api-payments get-payment tx-sender u1)

;; Check payment status
(contract-call? .api-payments has-paid tx-sender u1)
```

---

## Testnet Deployment

1. Add your private key or mnemonic to `settings/Testnet.toml`:

```toml
[network]
name = "testnet"

[accounts.deployer]
mnemonic = "your 24-word mnemonic here"
```

2. Deploy to testnet:
```bash
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

---

## Mainnet Deployment

1. Add your credentials to `settings/Mainnet.toml`:

```toml
[network]
name = "mainnet"

[accounts.deployer]
mnemonic = "your 24-word mnemonic here"
```

2. Generate and apply the deployment plan:
```bash
clarinet deployments generate --mainnet
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

---

## Contract Addresses (after deployment)

After deploying, your contracts will be available at:
- `<YOUR_ADDRESS>.api-registry`
- `<YOUR_ADDRESS>.api-payments`

Update the `registry` constant in `api-payments.clar` if you need to reference the registry by full address (for cross-deployer calls).

---

## Error Codes

| Code | Meaning |
|---|---|
| `u404` | API not found |
| `u403` | Not the owner |
