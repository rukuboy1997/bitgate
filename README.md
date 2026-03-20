# BitGate

## What is BitGate?

BitGate is a decentralized API marketplace built on the Stacks blockchain. It enables developers to monetize their APIs using a **pay-per-request model powered by Bitcoin**. Instead of traditional API keys and subscriptions, consumers pay directly through Stacks smart contracts — no fiat, no centralized billing, pure web3.

The core mechanism is the **x402 payment protocol**: when a consumer hits a protected endpoint without a valid payment proof, the server responds with HTTP 402 (Payment Required) and the payment details. The client then calls a Stacks smart contract (`record-payment`), gets a transaction ID, and retries the request with that txid in the `x-payment-tx` header. The backend verifies the transaction on-chain and serves the data.

## Architecture

```text
bitgate-monorepo/
├── artifacts/
│   ├── bitgate/            # React + Vite frontend (marketplace + dashboard)
│   └── api-server/         # Express API server with x402 middleware
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM scaffold (unused, in-memory storage active)
├── bitgate/                # Clarinet project — Clarity smart contracts
│   ├── contracts/
│   │   ├── api-registry.clar   # API registration, metadata, usage, earnings
│   │   └── api-payments.clar   # Records payments, calls api-registry
│   ├── Clarinet.toml
│   ├── settings/           # Devnet / Testnet / Mainnet configs
│   └── DEPLOY.md
└── scripts/                # Utility scripts
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 5, TypeScript |
| Blockchain | Stacks (Bitcoin L2), Clarity smart contracts |
| Wallet | Hiro Wallet (`@stacks/connect`) |
| Monorepo | pnpm workspaces |
| API codegen | Orval (from OpenAPI spec) |
| Build | esbuild (API server), Vite (frontend) |
| Contract tooling | Clarinet v2.13.0 |

## x402 Payment Flow

1. Client calls `GET /api/price-feed` — no payment header
2. Server responds `HTTP 402` with JSON: price, asset, contract address, function name
3. Frontend opens Hiro Wallet via `openContractCall` → calls `record-payment` on Stacks
4. Wallet returns a `txid` on confirmation
5. Client retries `GET /api/price-feed` with header `x-payment-tx: <txid>`
6. Backend (`x402Middleware`) verifies the txid against the Stacks API, checks it hasn't been reused, records the payment, and serves the data

## Key Files

### Frontend (`artifacts/bitgate/`)
- `src/lib/api.ts` — Central API URL resolver; reads `VITE_API_URL` env var for external deployments, falls back to Replit path routing
- `src/hooks/use-x402.ts` — The full x402 hook (fetch → 402 → wallet → retry → success)
- `src/hooks/use-marketplace.ts` — Buy access flow for marketplace (calls contract + backend to issue persistent access)
- `src/pages/home.tsx` — API marketplace grid
- `src/pages/dashboard.tsx` — Earnings panel + live x402 demo playground
- `.env.example` — Documents env vars needed for external deployment

### Backend (`artifacts/api-server/`)
- `src/middleware/x402.ts` — Core x402 middleware: returns 402 or verifies txid
- `src/lib/storage.ts` — In-memory payment store (tracks used txids + earnings)
- `src/routes/pricefeed.ts` — Protected endpoint behind x402 middleware
- `src/routes/earnings.ts` — Returns total calls, earnings by asset, recent payments
- `src/routes/marketplace.ts` — Lists available APIs

### Smart Contracts (`bitgate/contracts/`)
- `api-registry.clar` — Tracks API metadata, owner, price, asset, usage count, earnings
- `api-payments.clar` — Entry point for payments; calls `api-registry` via cross-contract call

## Storage

**Currently in-memory** — all payment records and earnings reset on server restart. A PostgreSQL + Drizzle ORM scaffold exists in `lib/db/` but is not yet wired up. Connecting it would make earnings and payment history persistent.

## Deployment

The project deploys as two separate services:

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root: `artifacts/bitgate`, output: `dist/public`, set `VITE_API_URL` |
| Backend | Railway / Render | Root: `artifacts/api-server` |

## Smart Contract Deployment

Contracts live on **Stacks Testnet**. Clarinet binary: `/home/runner/.local/bin/clarinet` (v2.13.0).

Key commands (run from `bitgate/`):
- `clarinet check` — Validate syntax
- `clarinet console` — Interactive REPL
- `clarinet deployments generate --testnet` — Generate testnet plan
- `clarinet deployments apply -p deployments/default.testnet-plan.yaml` — Deploy to testnet

## Monorepo Notes

- **TypeScript**: Always typecheck from root — `pnpm run typecheck`
- **Codegen**: Run `pnpm --filter @workspace/api-spec run codegen` to regenerate hooks/schemas from OpenAPI spec
- **Node version**: 24 | **pnpm** | **TypeScript 5.9**
