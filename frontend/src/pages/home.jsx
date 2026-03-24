import { useListApis } from "@/lib/api-client";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useMarketplacePayment } from "@/hooks/use-marketplace";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Zap,
  Activity,
  Cpu,
  Box,
  Server,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};
function Home() {
  const { data: apis, isLoading, error } = useListApis();
  const { handlePayment, isVerifying } = useMarketplacePayment();
  const displayApis = apis && apis.length > 0 ? apis : [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Abstract blockchain background"
            className="w-full h-full object-cover opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-primary mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Live on Stacks Testnet
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              The Decentralized <br />
              <span className="text-primary font-bold">Bit</span>
              <span className="text-foreground font-bold">Gate</span>
              <br />
              <span className="text-xl md:text-2xl text-primary font-mono tracking-[0.2em] mt-6 block uppercase">
                Bitcoin API Paywall
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Pay with smart contracts. Get instant, verifiable access to
              premium data feeds and web3 infrastructure. No fiat, no
              subscriptions, pure web3.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full text-lg px-8"
                onClick={() =>
                  document
                    .getElementById("marketplace")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore APIs <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link
                href="/dashboard"
                className="inline-flex h-14 items-center justify-center px-8 rounded-full text-lg font-medium border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-colors backdrop-blur-md"
              >
                Developer Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marketplace Grid */}
      <section
        id="marketplace"
        className="py-24 bg-card/20 border-t border-white/5"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                Available APIs
              </h2>
              <p className="text-muted-foreground">
                Discover and integrate premium data streams.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-primary" /> Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-secondary" /> High Uptime
              </span>
            </div>
          </div>

          {
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayApis.map((api) => (
                <motion.div
                  key={api.id}
                  variants={item}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/50 to-primary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  <div className="relative h-full flex flex-col glass-panel rounded-3xl p-8 overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                    {/* Top row */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                        {api.category.includes("DeFi") ? (
                          <Activity className="w-6 h-6" />
                        ) : api.category.includes("AI") ? (
                          <Cpu className="w-6 h-6" />
                        ) : (
                          <Server className="w-6 h-6" />
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
                        {api.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                        {api.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {api.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Total Calls
                        </p>
                        <p className="font-mono text-white font-medium flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-primary" />
                          {api.usageCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Contract Earnings
                        </p>
                        <p className="font-mono text-white font-medium flex items-center gap-1.5">
                          <Box className="w-3 h-3 text-primary" />
                          {api.earnings.toLocaleString()} {api.asset}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      onClick={() =>
                        handlePayment(api.id, api.price, api.asset)
                      }
                      disabled={isVerifying}
                      className="w-full h-14 text-base rounded-xl"
                    >
                      Pay {api.price} {api.asset} &amp; Access
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          }
        </div>
      </section>
    </Layout>
  );
}
export { Home as default };
