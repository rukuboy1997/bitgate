import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { connect, disconnect, isConnected, getLocalStorage } from "@stacks/connect";

interface StacksContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

function getTestnetAddress(): string | null {
  const stored = getLocalStorage();
  if (!stored) return null;
  const stxAddresses = stored.addresses?.stx ?? [];
  const testnet = stxAddresses.find((a) => a.address?.startsWith("ST"));
  return testnet?.address ?? stxAddresses[0]?.address ?? null;
}

export function StacksProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (isConnected()) {
      const addr = getTestnetAddress();
      setAddress(addr);
      setConnected(true);
    }
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
      const addr = getTestnetAddress();
      setAddress(addr);
      setConnected(true);
    } catch (err) {
      console.error("Connect failed", err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setAddress(null);
    setConnected(false);
  };

  return (
    <StacksContext.Provider
      value={{
        address,
        isConnected: connected,
        connect: handleConnect,
        disconnect: handleDisconnect,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error("useStacks must be used within a StacksProvider");
  }
  return context;
}
