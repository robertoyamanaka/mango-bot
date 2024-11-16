import { useMutation } from "@tanstack/react-query";
import { redeem } from "./redeem";
import { RedeemInput, RedeemResponse } from "./redeem";

export function useRedeem() {
  return useMutation<RedeemResponse, Error, RedeemInput>({
    mutationFn: async (input) => {
      const response = await redeem(input);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response;
    },
  });
}
