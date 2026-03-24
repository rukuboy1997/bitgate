import { Link, useLocation } from "wouter";
import { useStacks } from "@/hooks/use-stacks";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, TerminalSquare } from "lucide-react";
function Layout({ children }) {
  const { address, isConnected, connect, disconnect } = useStacks();
  const [location] = useLocation();
  const truncateAddress = (addr) => {
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/images/bitgate-logo.png"
                alt="BitGate"
                className="h-9 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${location === "/" ? "text-primary text-glow" : "text-muted-foreground"}`}
              >
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${location === "/dashboard" ? "text-primary text-glow" : "text-muted-foreground"}`}
              >
                Dashboard
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {isConnected && address ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Connected
                    </span>
                    <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      {truncateAddress(address)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={disconnect}
                    className="rounded-full"
                    title="Disconnect"
                  >
                    <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                  </Button>
                </div>
              ) : (
                <Button onClick={connect} className="gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">{children}</main>

      <footer className="border-t border-white/5 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TerminalSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Built on Stacks</span>
          </div>
          <p className="text-sm text-muted-foreground/60">
            &copy; {/* @__PURE__ */ new Date().getFullYear()} BitGate Protocol.
            Decentralized API Access.
          </p>
        </div>
      </footer>
    </div>
  );
}
export { Layout };
