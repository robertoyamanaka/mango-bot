"use client";

import { useState } from "react";
import { useRedeem } from "./use-redeem";
import { Spinner } from "@/lib/spinner";
import { joinClassNames } from "@/lib/join-classnames";
import ReactConfetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export function RedeemCodeForm({
  defaultRedeemCode,
  telegramUsername,
}: {
  defaultRedeemCode: string;
  telegramUsername: string;
}) {
  const router = useRouter();
  const { primaryWallet, network } = useDynamicContext();
  const [redeemCode, setRedeemCode] = useState<string>(defaultRedeemCode);
  const [showModal, setShowModal] = useState(false);
  const { mutateAsync: redeem, isPending, error, isSuccess } = useRedeem();

  const triggerRedeem = async () => {

    if (!primaryWallet || !network) return;
    setShowModal(true);
    await redeem({
      redeemCode,
      walletAddress: primaryWallet.address,
      network: network.toString(),
      telegramUsername,
    });
  };

  return (
    <>
     {/* Confetti */}
     {isSuccess && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative rounded-lg bg-black border-2 border-white p-6 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              {isPending ? (
                <div>
                  <code className="font-mono  px-2 py-1 rounded">
                    Redeeming Code...
                  </code>
                </div>
              ) : error ? (
                <div>
                  <p className="text-lg font-medium text-red-500">
                    {error.message}
                  </p>

                  <button
                    className="mt-4 rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-white">
                    🎉🎉🎉 Code Redeemed! 🎉🎉🎉
                  </p>
                  <button
                    className="mt-4 rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300"
                    onClick={() => {
                      setShowModal(false);
                      router.push("/");
                    }}
                  >
                    Go Home
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto mt-10 flex max-w-md flex-col gap-x-4">
        <div className="flex flex-col gap-x-2">
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="redeem-code"
            name="redeem-code"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            type="text"
            placeholder="Enter your code"
            autoComplete="redeem-code"
            className="min-w-0 flex-auto rounded-md border-2 border-white bg-black px-3.5 py-2 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          />
          <div className="flex flex-row gap-x-2 mt-3">
            <button
              type="submit"
              onClick={triggerRedeem}
              disabled={isPending}
              className={joinClassNames(
                isPending ? "cursor-not-allowed opacity-50" : "",
                "flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300"
              )}
            >
              {isPending ? "Redeeming" : "Redeem Code 🥳"}
            </button>
          </div>
        </div>
        {error && <p className="mt-1 text-red-500">{error.message}</p>}
      </div>
    </>
  );
}
