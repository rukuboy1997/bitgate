import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useStacks } from "@/hooks/use-stacks";
import { useX402 } from "@/hooks/use-x402";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Terminal,
  AlertCircle,
  RefreshCcw,
  Lock,
  Zap,
  CheckCircle2,
  Loader2,
  Wallet,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "@/lib/api";
function useEarnings() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const refetch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/earnings`);
      if (res.ok) setData(await res.json());
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    refetch();
  }, []);
  return { data, isLoading, refetch };
}
function StageIndicator({
  label,
  active,
  done
}) {
  return <div
    className={`flex items-center gap-2 text-xs font-mono transition-colors ${done ? "text-green-400" : active ? "text-primary" : "text-muted-foreground/40"}`}
  >
      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-current opacity-40" />}
      {label}
    </div>;
}
function Dashboard() {
  const { address, isConnected, connect } = useStacks();
  const { data: earnings, isLoading: earningsLoading, refetch: refetchEarnings } = useEarnings();
  const { stage, callEndpoint, pay, reset } = useX402("/price-feed");
  const isIdle = stage.type === "idle";
  const isCalling = stage.type === "calling";
  const isRequiresPayment = stage.type === "requires_payment";
  const isWaitingWallet = stage.type === "waiting_wallet";
  const isVerifying = stage.type === "verifying";
  const isSuccess = stage.type === "success";
  const isError = stage.type === "error";
  const isDone1 = isRequiresPayment || isWaitingWallet || isVerifying || isSuccess;
  const isDone2 = isVerifying || isSuccess;
  const isDone3 = isSuccess;
  if (!isConnected || !address) {
    return <Layout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">
            Connect to Access Dashboard
          </h1>
          <p className="text-muted-foreground max-w-md mb-8">
            You need to connect your Hiro Wallet to view your earnings and
            interact with the x402 payment layer.
          </p>
          <Button size="lg" onClick={connect}>
            Connect Hiro Wallet
          </Button>
        </div>
      </Layout>;
  }
  return <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Developer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor earnings and interact with the x402 payment layer live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {
    /* Left: Earnings + Account */
  }
          <div className="lg:col-span-4 space-y-6">
            {
    /* Earnings Panel */
  }
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  API Earnings
                </h2>
                <Button
    variant="ghost"
    size="icon"
    onClick={refetchEarnings}
    disabled={earningsLoading}
  >
                  <RefreshCcw
    className={`w-4 h-4 ${earningsLoading ? "animate-spin" : ""}`}
  />
                </Button>
              </div>

              {earningsLoading && !earnings ? <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-white/5 rounded-xl" />
                  <div className="h-10 bg-white/5 rounded-xl" />
                  <div className="h-10 bg-white/5 rounded-xl" />
                </div> : <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total API Calls
                      </p>
                      <p className="text-2xl font-bold font-mono text-white">
                        {earnings?.totalCalls ?? 0}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                      <p className="text-xs text-primary/70 mb-1">
                        Total Earned
                      </p>
                      <p className="text-2xl font-bold font-mono text-primary">
                        {earnings?.total ?? 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                      Breakdown by Asset
                    </p>
                    {earnings && Object.keys(earnings.byAsset).length > 0 ? <div className="space-y-2">
                        {Object.entries(earnings.byAsset).map(
    ([asset, amount]) => <div
      key={asset}
      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/30 border border-white/5"
    >
                              <span className="text-sm font-semibold text-white flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                {asset}
                              </span>
                              <span className="font-mono text-sm text-primary">
                                {amount}
                              </span>
                            </div>
  )}
                      </div> : <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <p className="text-xs text-muted-foreground">
                          No payments recorded yet.
                          <br />
                          Run the demo to see earnings appear here.
                        </p>
                      </div>}
                  </div>

                  {earnings && earnings.recentPayments.length > 0 && <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                        Recent Payments
                      </p>
                      <div className="space-y-2">
                        {earnings.recentPayments.slice(0, 3).map((p) => <div
    key={p.txid}
    className="px-3 py-2 rounded-lg bg-black/30 border border-white/5"
  >
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                                {p.txid}
                              </span>
                              <span className="text-xs font-semibold text-green-400">
                                +{p.amount} {p.asset}
                              </span>
                            </div>
                          </div>)}
                      </div>
                    </div>}
                </div>}
            </div>

            {
    /* Account Status */
  }
            <div className="glass-panel p-6 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">Account Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Connected Address
                  </p>
                  <p className="font-mono text-xs px-3 py-2 rounded-lg bg-black/30 border border-white/5 overflow-hidden text-ellipsis">
                    {address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Network</p>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Stacks Testnet
                  </div>
                </div>
              </div>
            </div>
          </div>

          {
    /* Right: x402 Playground */
  }
          <div className="lg:col-span-8">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl min-h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">x402 API Playground</h2>
                  <p className="text-sm text-muted-foreground">
                    Live demo of the pay-per-request flow — 402 → pay → 200.
                  </p>
                </div>
              </div>

              {
    /* Endpoint + Execute */
  }
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">
                  Endpoint: Crypto Price Feed
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm overflow-x-auto">
                    <span className="text-primary font-bold mr-2">GET</span>
                    <span className="text-muted-foreground">
                      /api/price-feed
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!isIdle && <Button
    variant="outline"
    onClick={() => {
      reset();
      refetchEarnings();
    }}
    className="h-12"
  >
                        <RefreshCcw className="w-4 h-4" />
                      </Button>}
                    <Button
    onClick={() => callEndpoint()}
    disabled={isCalling || isWaitingWallet || isVerifying}
    className="h-12 shrink-0"
  >
                      {isCalling ? <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Calling…
                        </> : "Execute Request"}
                    </Button>
                  </div>
                </div>
              </div>

              {
    /* Flow stages tracker */
  }
              <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-black/30 border border-white/5">
                <StageIndicator
    label="GET /price-feed"
    active={isCalling}
    done={isDone1}
  />
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
                <StageIndicator
    label="402 → pay"
    active={isRequiresPayment || isWaitingWallet}
    done={isDone2}
  />
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
                <StageIndicator
    label="verify tx"
    active={isVerifying}
    done={isDone3}
  />
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
                <StageIndicator
    label="200 OK"
    active={false}
    done={isSuccess}
  />
              </div>

              {
    /* Stage display area */
  }
              <div className="flex-1 flex flex-col min-h-[320px]">
                <AnimatePresence mode="wait">
                  {isIdle && <motion.div
    key="idle"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex-1 flex items-center justify-center bg-[#0d0d0d] border border-white/10 rounded-xl"
  >
                      <div className="text-center px-8">
                        <Terminal className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground/50 font-mono text-sm italic">
                          // Click "Execute Request" to start the x402 flow
                        </p>
                      </div>
                    </motion.div>}

                  {isCalling && <motion.div
    key="calling"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex-1 flex items-center justify-center bg-[#0d0d0d] border border-white/10 rounded-xl"
  >
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground font-mono">
                          Sending request…
                        </p>
                      </div>
                    </motion.div>}

                  {isRequiresPayment && stage.type === "requires_payment" && <motion.div
    key="402"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex-1 flex flex-col gap-4"
  >
                      {
    /* 402 response */
  }
                      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-yellow-500/20 bg-yellow-500/10">
                          <span className="font-mono text-xs font-bold text-yellow-400">
                            HTTP 402 Payment Required
                          </span>
                        </div>
                        <pre className="p-4 font-mono text-xs text-yellow-300/80 overflow-auto max-h-48">
                          {JSON.stringify(stage.details, null, 2)}
                        </pre>
                      </div>

                      {
    /* Payment action */
  }
                      <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white mb-1">
                            Payment required to access this endpoint
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Cost:{" "}
                            <span className="text-primary font-mono font-bold">
                              {stage.details.accepts[0]?.price}{" "}
                              {stage.details.accepts[0]?.asset}
                            </span>{" "}
                            via Stacks smart contract
                          </p>
                        </div>
                        <Button
    onClick={() => pay(stage.details)}
    className="shrink-0 h-11"
  >
                          <Wallet className="w-4 h-4 mr-2" />
                          Pay &amp; Retry
                        </Button>
                      </div>
                    </motion.div>}

                  {isWaitingWallet && <motion.div
    key="wallet"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex-1 flex items-center justify-center bg-[#0d0d0d] border border-white/10 rounded-xl"
  >
                      <div className="text-center px-8">
                        <Wallet className="w-10 h-10 text-primary mx-auto mb-3 animate-pulse" />
                        <p className="text-sm font-semibold text-white mb-1">
                          Hiro Wallet is open
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Confirm the transaction to pay and retry the request.
                        </p>
                      </div>
                    </motion.div>}

                  {isVerifying && stage.type === "verifying" && <motion.div
    key="verifying"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex-1 flex flex-col gap-4"
  >
                      <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-white mb-1">
                            Verifying transaction on Stacks…
                          </p>
                          <p className="font-mono text-xs text-muted-foreground break-all">
                            txid: {stage.txid}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] border border-white/10 rounded-xl">
                        <p className="text-xs text-muted-foreground font-mono italic">
                          Retrying request with x-payment-tx header…
                        </p>
                      </div>
                    </motion.div>}

                  {isSuccess && stage.type === "success" && <motion.div
    key="success"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex-1 flex flex-col gap-4"
  >
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-500/30 bg-green-500/10">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        <p className="text-sm font-semibold text-green-300">
                          HTTP 200 OK — Payment verified, data returned
                        </p>
                        <span className="ml-auto font-mono text-xs text-green-400/70 truncate max-w-[180px]">
                          {stage.txid}
                        </span>
                      </div>
                      <div className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-xl p-4 font-mono text-sm overflow-auto">
                        <pre className="text-green-400">
                          {JSON.stringify(stage.data, null, 2)}
                        </pre>
                      </div>
                    </motion.div>}

                  {isError && stage.type === "error" && <motion.div
    key="error"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex-1 flex flex-col gap-4"
  >
                      <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <pre className="text-sm text-destructive/90 whitespace-pre-wrap">
                          {stage.message}
                        </pre>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>

              {
    /* cURL reference */
  }
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                  cURL Reference — x402 Flow
                </p>
                <div className="bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
                  <code>
                    <span className="text-white/30"># 1. First call → 402</span>
                    <br />
                    curl -i GET /api/price-feed
                    <br />
                    <br />
                    <span className="text-white/30">
                      # 2. Retry with payment proof
                    </span>
                    <br />
                    curl -X GET /api/price-feed \<br />
                    &nbsp;&nbsp;-H "x-payment-tx: &lt;txid&gt;"
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
}
export {
  Dashboard as default
};
