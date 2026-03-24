import { createContext, useContext, useEffect, useState } from "react";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
} from "@stacks/connect";
const StacksContext = createContext(void 0);
function getTestnetAddress() {
  const stored = getLocalStorage();
  if (!stored) return null;
  const stxAddresses = stored.addresses?.stx ?? [];
  const testnet = stxAddresses.find((a) => a.address?.startsWith("ST"));
  return testnet?.address ?? stxAddresses[0]?.address ?? null;
}
function StacksProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (isConnected()) {
      const addr = getTestnetAddress();
      if (addr) {
        setAddress(addr);
        setConnected(true);
      }
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
function useStacks() {
  const context = useContext(StacksContext);
  if (context === void 0) {
    throw new Error("useStacks must be used within a StacksProvider");
  }
  return context;
}
export { StacksProvider, useStacks };
