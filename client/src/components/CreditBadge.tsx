import { Coins, Infinity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export function CreditBadge() {
  const { data: subscription, isLoading } = trpc.credits.getSubscription.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 animate-pulse">
        <Coins className="w-5 h-5 text-orange-400" />
        <span className="text-sm font-semibold text-slate-400">...</span>
      </div>
    );
  }

  const isUnlimited = subscription?.hasUnlimitedCredits;
  const credits = subscription?.credits || 0;
  const isLowCredits = credits < 3 && !isUnlimited;

  return (
    <Link href="/planos">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all hover:scale-105 ${
        isUnlimited 
          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
          : isLowCredits
          ? "bg-red-500/20 border-red-500/50 animate-pulse"
          : "bg-slate-800/50 border-slate-700 hover:border-orange-500/50"
      }`}>
        {isUnlimited ? (
          <>
            <Infinity className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">Ilimitado</span>
          </>
        ) : (
          <>
            <Coins className={`w-5 h-5 ${isLowCredits ? "text-red-400" : "text-orange-400"}`} />
            <span className={`text-sm font-semibold ${isLowCredits ? "text-red-400" : "text-white"}`}>
              {credits} {credits === 1 ? "crédito" : "créditos"}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
