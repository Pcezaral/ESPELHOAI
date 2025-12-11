import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, TrendingDown, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const PLANS = [
  {
    id: "credits_50",
    credits: 50,
    price: 5000, // em centavos
    priceDisplay: "R$ 50,00",
    discount: 0,
    pricePerCredit: "R$ 1,00",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
  },
  {
    id: "credits_200",
    credits: 200,
    price: 18000, // em centavos
    priceDisplay: "R$ 180,00",
    discount: 10,
    pricePerCredit: "R$ 0,90",
    icon: Zap,
    color: "from-orange-500 to-amber-500",
    borderColor: "border-orange-500/30 hover:border-orange-500/60",
    badge: "10% OFF",
  },
  {
    id: "credits_500",
    credits: 500,
    price: 40000, // em centavos
    priceDisplay: "R$ 400,00",
    discount: 20,
    pricePerCredit: "R$ 0,80",
    icon: TrendingDown,
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
    badge: "20% OFF",
    popular: true,
  },
  {
    id: "credits_1000",
    credits: 1000,
    price: 70000, // em centavos
    priceDisplay: "R$ 700,00",
    discount: 30,
    pricePerCredit: "R$ 0,70",
    icon: Sparkles,
    color: "from-yellow-500 to-orange-600",
    borderColor: "border-yellow-500/30 hover:border-yellow-500/60",
    badge: "30% OFF - MELHOR VALOR",
  },
];

export default function Planos() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const { data: subscription } = trpc.credits.getSubscription.useQuery();
  const createCheckoutMutation = trpc.stripe.createCheckout.useMutation();
  const verifyPaymentMutation = trpc.stripe.verifyPayment.useMutation();

  // Check for payment success/cancel in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const canceled = params.get('canceled');
    const sessionId = params.get('session_id');

    if (success && sessionId) {
      verifyPaymentMutation.mutate(
        { sessionId },
        {
          onSuccess: (result) => {
            if (result.success) {
              toast.success("✅ Pagamento confirmado! Créditos adicionados à sua conta.");
              // Limpar URL
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          },
          onError: () => {
            toast.error("Erro ao verificar pagamento");
          },
        }
      );
    } else if (canceled) {
      toast.info("Compra cancelada");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setSelectedPlan(planId);
    createCheckoutMutation.mutate(
      { packageType: planId as any },
      {
        onSuccess: (session) => {
          window.location.href = session.url;
        },
        onError: (error: any) => {
          toast.error(error.message || "Erro ao criar sessão de pagamento");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-black border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">
            Escolha seu <span className="text-orange-500">Plano</span>
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Título e Descrição */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-white">
            Quanto mais créditos, maior o desconto!
          </h2>
          <p className="text-xl text-slate-400">
            Escolha o pacote que melhor se adequa às suas necessidades
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-slate-900/50 border-2 ${plan.borderColor} transition-all hover:scale-105 overflow-hidden group ${
                plan.popular ? "lg:scale-105 ring-2 ring-orange-500/50" : ""
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-bold rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg">
                  MAIS POPULAR
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>

                {/* Créditos */}
                <div>
                  <p className="text-slate-400 text-sm mb-1">Créditos</p>
                  <p className="text-3xl font-bold text-white">{plan.credits.toLocaleString()}</p>
                </div>

                {/* Preço */}
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Preço</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-white">{plan.priceDisplay}</p>
                    {plan.discount > 0 && (
                      <span className="text-green-400 font-semibold">{plan.discount}% OFF</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">
                    {plan.pricePerCredit} por crédito
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 py-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{plan.credits} transformações</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Todos os 9 temas</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Downloads em alta resolução</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Compartilhamento ilimitado</span>
                  </div>
                </div>

                {/* Botão */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={createCheckoutMutation.isPending && selectedPlan === plan.id}
                  className={`w-full gap-2 font-semibold h-12 group/btn ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      : "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500"
                  }`}
                >
                  {createCheckoutMutation.isPending && selectedPlan === plan.id ? (
                    "Processando..."
                  ) : (
                    <>
                      Comprar Agora
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Seção de Referral */}
        {isAuthenticated && (
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 p-8 mb-16">
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <h3 className="text-2xl font-bold text-white">🎁 Ganhe Créditos Indicando Amigos</h3>
                <p className="text-slate-300">Indique seus amigos e ambos ganham 5 créditos grátis quando eles se cadastram usando seu link!</p>
                <Button
                  onClick={() => setLocation("/referral")}
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                >
                  Ver Meu Link de Referral
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Comparação de Valor */}
        <Card className="bg-slate-900/50 border-slate-800 p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6">💰 Economize Mais Comprando em Maior Volume</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div key={plan.id} className="text-center space-y-2">
                <p className="text-slate-400">{plan.credits} Créditos</p>
                <p className="text-2xl font-bold text-white">{plan.pricePerCredit}</p>
                {plan.discount > 0 && (
                  <p className="text-green-400 text-sm font-semibold">Economiza {plan.discount}%</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* FAQ */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white mb-6">❓ Perguntas Frequentes</h3>
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h4 className="text-white font-semibold mb-2">Os créditos expiram?</h4>
            <p className="text-slate-400">Não! Seus créditos nunca expiram. Use-os quando quiser.</p>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h4 className="text-white font-semibold mb-2">Posso mudar de plano depois?</h4>
            <p className="text-slate-400">Sim! Você pode comprar mais créditos a qualquer momento. Os descontos progressivos se aplicam a cada compra.</p>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <h4 className="text-white font-semibold mb-2">Como funciona o desconto?</h4>
            <p className="text-slate-400">Quanto mais créditos você compra de uma vez, maior o desconto. Compre 1000 créditos e economize 30%!</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
