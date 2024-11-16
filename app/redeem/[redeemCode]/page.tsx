"use client";

import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
  useSocialAccounts,
} from "@dynamic-labs/sdk-react-core";

import { RedeemCodeForm } from "./redeem-code.form";
import { ProviderEnum } from "@dynamic-labs/types";

const provider = ProviderEnum.Telegram;

export default function RedeemPage({
  params,
}: {
  params: { redeemCode: string };
}) {
  const isLoggedIn = useIsLoggedIn();
  const { getLinkedAccountInformation } = useSocialAccounts();

  const telegramAccountInfo = getLinkedAccountInformation(provider);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
      <div className="border-2 border-white p-5 rounded-lg shadow-2xl mb-7 mt-7 text-sm py-6 mx-4 justify-center items-center">
        <h2 className="mx-auto max-w-3xl text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Redeem your code
        </h2>
        {isLoggedIn ? (
          <>
            <p className="mx-auto mb-4 mt-6 max-w-lg text-center text-lg text-gray-300">
              You are logged in with
            </p>
            {telegramAccountInfo && (
              <div className="flex items-center justify-center gap-3 mb-6">
                {telegramAccountInfo.avatar && (
                  <img
                    src={telegramAccountInfo.avatar}
                    alt="Telegram Profile"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                )}
                <span className="text-xl font-medium">
                  {telegramAccountInfo.username || "Telegram User"}
                </span>
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <DynamicWidget />
            </div>
            {telegramAccountInfo && (
              <RedeemCodeForm
                defaultRedeemCode={params.redeemCode}
                telegramUsername={telegramAccountInfo.username!}
              />
            )}
          </>
        ) : (
          <DynamicWidget />
        )}
      </div>
    </div>
  );
}
