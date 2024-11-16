import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import dotenv from "dotenv";
import { Account, cairo, RpcProvider, Contract } from "starknet";
import { ERC20 } from "./const";

dotenv.config();

// Starknet USDC contract address
const USDC_CONTRACT = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";

// Constants and provider setup
const WALLET_ADDRESS = process.env.STARKNET_WALLET_ADDRESS;
const PRIVATE_KEY = process.env.STARKNET_PRIVATE_KEY?.replace("0x00", "0x");
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const provider = new RpcProvider({
  nodeUrl: `https://starknet-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
});

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting new Starknet USDC transfer...");

    const body = await request.json();
    const {
      user_address,
      amount,
    }: { user_address: string; amount: number } = body;

    console.log("📝 Request parameters:", {
      userAddress: user_address,
      amount,
    });

    // Validate required parameters
    if (!user_address || !amount) {
      console.log("❌ Missing required parameters");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Initialize account
    console.log("🔑 Initializing account...");
    if (!WALLET_ADDRESS || !PRIVATE_KEY) {
      throw new Error("Missing account credentials");
    }

    const account = new Account(
      provider,
      WALLET_ADDRESS,
      PRIVATE_KEY,
    );
    console.log("Wallet Account details:", account.address);

    // Initialize USDC contract
    const usdcContract = new Contract(ERC20, USDC_CONTRACT, provider);
    usdcContract.connect(account);

    // Check USDC balance
    const balance = await usdcContract.balanceOf(account.address);
    console.log("USDC Balance", balance);

    // Convert balance to numbers (USDC has 6 decimals)
    const balanceNum = Number(BigInt(balance));
    const transferAmount = amount * 10 ** 6; // Convert to USDC decimals

    // Check if we have enough balance
    if (balanceNum < transferAmount) {
      throw new Error("Insufficient USDC balance");
    }

    // Execute transfer
    const transfer = await account.execute([
      usdcContract.populate("transfer", [
        user_address,
        cairo.uint256(transferAmount),
      ]),
    ]);

    // Wait for confirmation
    console.log("⏳ Waiting for transaction confirmation...");
    if (!transfer || !transfer.transaction_hash) {
      throw new Error("Failed to send USDC");
    }

    const txHash = await provider.waitForTransaction(
      transfer.transaction_hash,
    );
    console.log("✅ Transaction confirmed!", txHash);

    return NextResponse.json(
      { 
        message: "Transaction successful",
        transaction_hash: transfer.transaction_hash 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Transaction error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      accountDetails: {
        address: WALLET_ADDRESS,
        privateKeyLength: PRIVATE_KEY?.length,
      },
    });

    return NextResponse.json(
      {
        error: "Failed to process transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}