"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { Prize, PrizeRedeem } from "@/lib/types";

export type RedeemInput = {
  redeemCode: string;
  walletAddress: string;
  network: string;
  telegramUsername: string;
};
// ... existing imports ...

export type RedeemResponse = {
  success: boolean;
  data?: PrizeRedeem;
  error?: string;
};

export async function redeem({
  redeemCode,
  walletAddress,
  telegramUsername,
  network,
}: RedeemInput): Promise<RedeemResponse> {
  try {
    const supabase = await createSupabaseClient();

    const { data: prize, error: prizeError } = await supabase
      .from("prizes")
      .select("*")
      .eq("redeemCode", redeemCode)
      .single();

    if (prizeError || !prize) {
      return {
        success: false,
        error: "Invalid redeem code",
      };
    }

    const castedPrize = prize as Prize;

    // Check if prize has reached maxRedeems
    const { count: totalRedeems } = await supabase
      .from("prizeRedeems")
      .select("*", { count: "exact" })
      .eq("prizeRedeemCode", redeemCode);

    if (totalRedeems && totalRedeems >= castedPrize.maxRedeems) {
      return {
        success: false,
        error: "This prize has reached its maximum number of redeems",
      };
    }

    // Check if user already redeemed
    const { count: userRedeems } = await supabase
      .from("prizeRedeems")
      .select("*", { count: "exact" })
      .eq("prizeRedeemCode", redeemCode)
      .eq("telegramUsername", telegramUsername);

    if (userRedeems && userRedeems >= prize.maxRedeemsPerUser) {
      return {
        success: false,
        error: "You have already redeemed this code",
      };
    }

    // Execute the blockchain logic
    // Check if the network is Starknet
    if (network === "0x534e5f4d41494e") {
      console.log("🚀 Starting new Starknet transfer...");
      const starknetInput = {
        userAddress: walletAddress,
        amount: 0.1,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/starknet`, {
        method: "POST",
        body: JSON.stringify(starknetInput),
      });
      console.log("🚢 Response from Starknet:", response);
      const responseBody = await response.json();
      console.log("🚢 Response from Starknet:", responseBody.data);
      if (response.status !== 200) {
        return {
          success: false,
          error: "Failed to send in Starknet",
        };
      }
    } else {
      console.log("🚢 Starting new EVM USDC transfer...");
      const evmInput = {
        userAddress: walletAddress,
        chainId: network,
        amount: 0.1,
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/evm`, {
        method: "POST",
        body: JSON.stringify(evmInput),
      });
      const responseBody = await response.json();
      console.log("🚢 Response from EVM:", responseBody.data);
      if (response.status !== 200) {
        return {
          success: false,
          error: "Failed to send in EVM",
        };
      }
    }
    return {
      success: false,
      error: "Failed to redeem code",
    };

    // // Insert redeem record
    // const { error: redeemError, data: redeemData } = await supabase
    //   .from("prizeRedeems")
    //   .insert({
    //     prizeRedeemCode: redeemCode,
    //     walletAddress,
    //     telegramUsername,
    //     network,
    //   })
    //   .select();

    // if (redeemError) {
    //   return {
    //     success: false,
    //     error: "Failed to redeem code",
    //   };
    // }

    // return {
    //   success: true,
    //   data: redeemData[0] as PrizeRedeem,
    // };
  } catch (error) {
    console.error("error redeeming", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
