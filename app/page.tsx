"use client";
import { useEffect, useState } from "react";
import {
  DynamicWidget,
  useTelegramLogin,
  useDynamicContext,
} from "../lib/dynamic";

import Spinner from "./Spinner";
import Link from "next/link";

export default function Main() {
  const { sdkHasLoaded, user } = useDynamicContext();
  const { telegramSignIn } = useTelegramLogin();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!sdkHasLoaded) return;

    const signIn = async () => {
      if (!user) {
        await telegramSignIn({ forceCreateUser: true });
      }
      setIsLoading(false);
    };

    signIn();
  }, [sdkHasLoaded]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white bg-black"
    >
      <div className="flex flex-col items-center justify-center text-center max-w-3xl px-6 py-24 sm:px-24 xl:py-32 ">
        <div className="border-2 border-white px-10 py-10 rounded-lg shadow-2xl mb-10 mt-7 text-sm py-6">
          <div className="inline-flex items-center justify-center">
            <img src="/mango-llc.png" alt="logo" className="w-auto h-24" />
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-6 space-y-4">
            Mango Community Bot LLC
          </h2>
          <div className="flex justify-center py-4 mb-4">
            {isLoading ? "Cargando..." : <DynamicWidget />}
          </div>

          <Link
            href="/redeem/chelitas"
            className="mb-10 rounded-md bg-white px-3.5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300"
          >
            Go to redeem Chelitas
          </Link>
        </div>
      </div>
    </div>
  );
}
