import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Crown, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const PLANS = [
  {
    id: "light",
    name: "Pacote Light",
    price: "R$ 9,90",
    credits: 50,
    description: "Ideal para experimentar",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
    features: [
      "50 transformações",
      "Todos os temas disponíveis",
      "Download em alta qualidade",
      "Compartilhamento ilimitado",
    ],
  },
  {
    id: "premium",
    name: "Pacote Premium",
    price: "R$ 19,90",
    credits: 150,
    description: "O mais escolhido!",
    icon: Crown,
    color: "from-orange-500 to-red-500",
    borderColor: "border-orange-500/30 hover:border-orange-500/60",
    popular: true,
    features: [
      "150 transformações",
      "Todos os temas disponíveis",
      "Download em alta qualidade",
      "Compartilhamento ilimitado",
      "Melhor custo-benefício",
      "Suporte prioritário",
    ],
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

    if (success === 'true' && sessionId) {
      // Verify payment and add credits
      verifyPaymentMutation.mutate(
        { sessionId },
        {
          onSuccess: (result) => {
            if (result.success) {
              toast.success("🎉 Pagamento confirmado! Seus créditos foram adicionados.");
              // Clean URL
              window.history.replaceState({}, '', '/planos');
              setLocation("/generator");
            } else {
              toast.error("Não foi possível verificar o pagamento.");
            }
          },
          onError: () => {
            toast.error("Erro ao verificar pagamento.");
          },
        }
      );
    } else if (canceled === 'true') {
      toast.info("Pagamento cancelado.");
      // Clean URL
      window.history.replaceState({}, '', '/planos');
    }
  }, [verifyPaymentMutation, setLocation]);

  const handlePurchase = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setSelectedPlan(planId);

    try {
      toast.info("Redirecionando para pagamento...");
      
      const { url } = await createCheckoutMutation.mutateAsync({
        packageType: planId as any,
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar sessão de pagamento");
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
          >
            <img src="/espelho-ai-logo-transp.png" alt="ESPELHO AI" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-white">
              ESPELHO <span className="text-orange-500">AI</span>
            </h1>
          </button>
          <div className="flex items-center gap-4">
            {subscription && (
              <div className="text-sm text-slate-300">
                Saldo: <span className="font-bold text-orange-400">{subscription.credits} créditos</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/generator")}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Compre <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Créditos</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Cada crédito = 1 transformação. Escolha o pacote ideal para você!
          </p>
        </div>

        {/* Plans Grid - Centered */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-3xl mx-auto mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden border-2 ${plan.borderColor} bg-slate-900/50 p-8 transition-all hover:scale-105 flex-1 max-w-sm ${
                  plan.popular ? "ring-2 ring-orange-500/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                    ⭐ MAIS POPULAR
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan Info */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-4xl font-bold text-white">
                      {plan.price}
                    </p>
                    <p className="text-sm text-slate-400">{plan.description}</p>
                    <div className="bg-orange-500/20 text-orange-400 font-bold px-3 py-1 rounded-full inline-block text-sm">
                      {plan.credits} créditos
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={selectedPlan === plan.id || createCheckoutMutation.isPending}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold text-lg py-6`}
                  >
                    {selectedPlan === plan.id ? "Processando..." : "Comprar Agora"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="text-center space-y-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Pagamento 100% Seguro via Stripe</span>
          </div>
          <p className="text-slate-400 text-sm">
            Seus créditos nunca expiram e podem ser usados em qualquer tema de transformação.
          </p>
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-700">
            <img src="https://cdn.jsdelivr.net/gh/AliasIO/wappalyzer@master/src/drivers/webextension/images/icons/Stripe.svg" alt="Stripe" className="h-8 opacity-60" />
            <span className="text-slate-500 text-xs">Cartão de crédito, débito e Pix</span>
          </div>
        </div>
      </main>
    </div>
  );
}
