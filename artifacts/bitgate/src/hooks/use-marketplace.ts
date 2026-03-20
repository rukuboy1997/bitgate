import { useVerifyPayment } from "@workspace/api-client-react";
import { useStacks } from "./use-stacks";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const CONTRACT_ADDRESS = "ST1Q4E29HCNRQ5E24PW5E63CCTW63FGFP02SND6B";
const CONTRACT_NAME = "api-payments";

export function useMarketplacePayment() {
  const { address, isConnected, connect } = useStacks();
  const verifyMutation = useVerifyPayment();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePayment = async (apiId: number, price: number, asset: string) => {
    if (!isConnected || !address) {
      connect();
      return;
    }

    try {
      await openContractCall({
        network: STACKS_TESTNET,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "record-payment",
        functionArgs: [
          uintCV(apiId),
          uintCV(price),
          stringAsciiCV(asset),
        ],
        onFinish: (data) => {
          toast({
            title: "Transaction Broadcasted",
            description: "Verifying payment on the network...",
          });

          // Call backend to verify and issue API key
          verifyMutation.mutate(
            {
              data: {
                txid: data.txId,
                userAddress: address,
                apiId: apiId,
              },
            },
            {
              onSuccess: () => {
                toast({
                  title: "Payment Verified!",
                  description: "Your API key has been issued successfully.",
                });
                queryClient.invalidateQueries({ queryKey: ["/api/payment/key"] });
              },
              onError: (error) => {
                toast({
                  variant: "destructive",
                  title: "Verification Failed",
                  description: error.error?.error || "Could not verify payment.",
                });
              },
            }
          );
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
