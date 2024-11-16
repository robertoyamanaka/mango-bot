import { NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseUnits, Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  scroll,
} from "viem/chains";
import { erc20Abi } from 'viem'

// Custom chain configuration for Rootstock
const rootstock = {
  id: 30,
  name: 'Rootstock',
  network: 'rootstock',
  nativeCurrency: {
    decimals: 18,
    name: 'RSK Smart Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: { 
      http: [process.env.ROOTSTOCK_RPC || 'https://public-node.rsk.co']
    },
    public: { 
      http: [process.env.ROOTSTOCK_RPC || 'https://public-node.rsk.co']
    },
  },
} as const;

// Modify the built-in chain configurations with custom RPCs
const customChains: { [key: number]: Chain } = {
  [mainnet.id]: {
    ...mainnet,
    rpcUrls: {
      ...mainnet.rpcUrls,
      default: { http: [process.env.ETHEREUM_RPC!] },
    }
  },
  [optimism.id]: {
    ...optimism,
    rpcUrls: {
      ...optimism.rpcUrls,
      default: { http: [process.env.OPTIMISM_RPC!] },
    }
  },
  [base.id]: {
    ...base,
    rpcUrls: {
      ...base.rpcUrls,
      default: { http: [process.env.BASE_RPC!] },
    }
  },
  [arbitrum.id]: {
    ...arbitrum,
    rpcUrls: {
      ...arbitrum.rpcUrls,
      default: { http: [process.env.ARBITRUM_RPC!] },
    }
  },
  [scroll.id]: {
    ...scroll,
    rpcUrls: {
      ...scroll.rpcUrls,
      default: { http: [process.env.SCROLL_RPC!] },
    }
  },
  [rootstock.id]: rootstock,
};

// Token configuration remains the same
const TOKEN_CONFIG: { [key: number]: { address: string; decimals: number } } = {
  [arbitrum.id]: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6 },
  [base.id]: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
  [mainnet.id]: { address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 },
  [optimism.id]: { address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85", decimals: 6 },
  [scroll.id]: { address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4", decimals: 6 },
  [rootstock.id]: { address: "0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB", decimals: 18 },
};

function convertBigIntToString(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }
  const result: any = {};
  for (const key in obj) {
    result[key] = convertBigIntToString(obj[key]);
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_address, chain_id, amount } = body;

    const tokenConfig = TOKEN_CONFIG[chain_id];
    if (!tokenConfig) {
      return new NextResponse("Unsupported chain", { status: 400 });
    }

    if (!user_address) {
      return new NextResponse("Invalid address", { status: 400 });
    }

    if (!amount || amount <= 0) {
      return new NextResponse("The amount must be greater than 0.", { status: 400 });
    }

    const chain = getChainConfig(chain_id);
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY!}`);
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(),
    });

    const tokenAmount = parseUnits(amount.toString(), tokenConfig.decimals);

    const hash = await walletClient.writeContract({
      address: tokenConfig.address as `0x${string}`,
      abi: erc20Abi,
      functionName: 'transferFrom',
      args: [user_address, account.address, tokenAmount],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const receiptForSerialization = convertBigIntToString(receipt);
    
    return NextResponse.json(receiptForSerialization);
  } catch (error: any) {
    console.error('[TRANSACTION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

function getChainConfig(chainId: number) {
  const chain = customChains[chainId];
  if (!chain) {
    throw new Error("Unsupported chain");
  }
  return chain;
}