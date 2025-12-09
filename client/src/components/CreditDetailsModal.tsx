import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, TrendingDown, Calendar, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface CreditDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditDetailsModal({ open, onOpenChange }: CreditDetailsModalProps) {
  const [location, setLocation] = useLocation();
  const { data: subscription, isLoading: subscriptionLoading } = trpc.credits.getSubscription.useQuery();
  const { data: transactions, isLoading: transactionsLoading } = trpc.credits.getTransactionHistory.useQuery();

  const isLoading = subscriptionLoading || transactionsLoading;
  const credits = subscription?.credits || 0;
  const isUnlimited = subscription?.hasUnlimitedCredits;
  const subscriptionType = subscription?.subscriptionType;

  const handleBuyCredits = () => {
    onOpenChange(false);
    setLocation("/planos");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-orange-400" />
            Detalhes de Créditos
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-24 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-32 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Status Atual */}
            <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Saldo Disponível</p>
                    <p className="text-4xl font-bold text-white mt-1">
                      {isUnlimited ? "∞" : credits}
                    </p>
                  </div>
                  <div className="text-5xl text-orange-400">
                    {isUnlimited ? <Zap /> : <Coins />}
                  </div>
                </div>

                {!isUnlimited && (
                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-sm text-slate-300">
                      Com seus créditos atuais, você pode fazer aproximadamente <strong className="text-orange-400">{credits} transformações</strong>
                    </p>
                    {credits < 5 && (
                      <p className="text-sm text-red-400">
                        ⚠️ Seus créditos estão acabando!
                      </p>
                    )}
                  </div>
                )}

                {subscriptionType && subscriptionType !== "free" && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span>Plano: <strong className="text-orange-400 capitalize">{subscriptionType.replace(/_/g, " ")}</strong></span>
                  </div>
                )}
              </div>
            </Card>

            {/* Histórico de Transações */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Histórico Recente
              </h3>

              {transactions && transactions.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {transaction.type === "consumption"
                            ? "Transformação gerada"
                            : transaction.type === "purchase"
                            ? "Créditos comprados"
                            : transaction.type === "initial"
                            ? "Créditos iniciais"
                            : transaction.type === "bonus"
                            ? "Bônus recebido"
                            : "Reembolso"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          transaction.amount > 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                        </p>
                        <p className="text-xs text-slate-400">
                          Saldo: {transaction.balanceAfter}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">
                  Nenhuma transação ainda
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-4 border-t border-slate-700">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
              >
                Fechar
              </Button>
              {!isUnlimited && (
                <Button
                  onClick={handleBuyCredits}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Comprar Créditos
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
