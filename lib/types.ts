export type PrizeRedeem = {
  id: string;
  prizeRedeemCode: string;
  walletAddress: string;
  telegramUsername: string;
  createdTs: string;
};

export type Prize = {
  id: string;
  name: string;
  description: string;
};
