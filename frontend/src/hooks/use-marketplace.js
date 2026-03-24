import { useVerifyPayment } from "@/lib/api-client";
import { useStacks } from "./use-stacks";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
const CONTRACT_ADDRESS = "ST1Q4E29HCNRQ5E24PW5E63CCTW63FGFP02SND6B";
const CONTRACT_NAME = "api-payments";
function useMarketplacePayment() {
  const { address, isConnected, connect } = useStacks();
  const verifyMutation = useVerifyPayment();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const handlePayment = async (apiId, price, asset) => {
    if (!isConnected || !address) {
      await connect();
    }
    try {
      openContractCall({
        network: STACKS_TESTNET,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "record-payment",
        functionArgs: [
          uintCV(apiId),
          uintCV(Math.floor(price * 100)),
          stringAsciiCV(asset),
        ],
        onFinish: (data) => {
          toast({
            title: "Transaction Broadcasted",
            description: "Verifying payment on the network...",
          });

          verifyMutation.mutate({
            data: {
              txid: data.txId,
              userAddress: address,
              apiId,
              asset,
              price,
            },
          });
        },
        onCancel: () => {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the transaction.",
          });
        },
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize wallet transaction.",
      });
    }
  };
  return {
    handlePayment,
    isVerifying: verifyMutation.isPending,
  };
}
export { useMarketplacePayment };
