"use server";

import { createSupabaseClient } from "@/lib/supabase-server";
import { PrizeRedeem } from "@/lib/types";

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

    // Check if prize has reached maxRedeems
    const { count: totalRedeems } = await supabase
      .from("prizeRedeems")
      .select("*", { count: "exact" })
      .eq("prizeRedeemCode", redeemCode);

    if (totalRedeems && totalRedeems >= prize.maxRedeems) {
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

    // Insert redeem record
    const { error: redeemError, data: redeemData } = await supabase
      .from("prizeRedeems")
      .insert({
        prizeRedeemCode: redeemCode,
        walletAddress,
        telegramUsername,
        network,
      })
      .select();

    if (redeemError) {
      return {
        success: false,
        error: "Failed to redeem code",
      };
    }

    return {
      success: true,
      data: redeemData[0] as PrizeRedeem,
    };
  } catch (error) {
    console.error("error redeeming", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
