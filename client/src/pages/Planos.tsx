import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown, Infinity as InfinityIcon } from "lucide-react";
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
    description: "50 Créditos",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
    features: [
      "50 transformações",
      "Todos os 5 temas",
      "Download em alta qualidade",
      "Compartilhamento ilimitado",
    ],
  },
  {
    id: "premium",
    name: "Pacote Premium",
    price: "R$ 19,90",
    credits: 150,
    description: "150 Créditos + Recursos/Cursos Extras",
    icon: Crown,
    color: "from-orange-500 to-red-500",
    borderColor: "border-orange-500/30 hover:border-orange-500/60",
    popular: true,
    features: [
      "150 transformações",
      "Todos os 5 temas",
      "Download em alta qualidade",
      "Compartilhamento ilimitado",
      "Recursos e cursos extras",
      "Suporte prioritário",
    ],
  },
  {
    id: "monthly_unlimited",
    name: "Ilimitado Mensal",
    price: "R$ 29,90/mês",
    credits: -1,
    description: "Créditos Ilimitados (Mensal - Econsa!)",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
    features: [
      "Transformações ilimitadas",
      "Todos os 5 temas",
      "Download em alta qualidade",
      "Compartilhamento ilimitado",
      "Renovação automática mensal",
      "Cancele quando quiser",
    ],
  },
  {
    id: "annual_unlimited",
    name: "Ilimitado Anual",
    price: "R$ 119,90/ano",
    credits: -1,
    description: "Créditos Ilimitados (Anual - Economize!)",
    icon: InfinityIcon,
    color: "from-yellow-500 to-orange-600",
    borderColor: "border-yellow-500/30 hover:border-yellow-500/60",
    badge: "Melhor Custo-Benefício",
    features: [
      "Transformações ilimitadas",
      "Todos os 5 temas",
      "Download em alta qualidade",
      "Compartilhamento ilimitado",
      "Economize R$ 238,90 por ano",
      "Renovação automática anual",
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
              toast.success("Pagamento confirmado! Seus créditos foram adicionados.");
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
          {subscription && (
            <div className="text-sm text-slate-300">
              Saldo atual: <span className="font-bold text-orange-400">
                {subscription.hasUnlimitedCredits ? "Ilimitado" : `${subscription.credits} créditos`}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-white">
            ESPELHO AI <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Premium</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Desbloqueie todo o potencial das transformações com IA. Escolha o plano ideal para você!
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden border-2 ${plan.borderColor} bg-slate-900/50 p-6 transition-all hover:scale-105 ${
                  plan.popular ? "ring-2 ring-orange-500/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MAIS POPULAR
                  </div>
                )}
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {plan.badge}
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
                    <p className="text-3xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent">
                      {plan.price}
                    </p>
                    <p className="text-sm text-slate-400">{plan.description}</p>
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
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold`}
                  >
                    {selectedPlan === plan.id ? "Processando..." : "Assinar"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer: Cancele a Qualquer Momento */}
        <div className="text-center space-y-3 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30 rounded-2xl p-6 max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Cancele a Qualquer Momento!
            </h3>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-slate-300 text-sm">
            Sem compromisso. Sem surpresas. Sem taxas ocultas. Você é livre para cancelar sua assinatura quando quiser, diretamente na sua conta.
          </p>
          <p className="text-xs text-slate-400 italic">
            Porque confiamos que você vai amar o ESPELHO AI! 💚
          </p>
        </div>

        {/* Bottom Info */}
        <div className="text-center space-y-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white">
            Escolha o plano ideal e desbloqueie todo o potencial do ESPELHO AI
          </h2>
          <p className="text-slate-400">
            Transforme quantas fotos quiser e compartilhe momentos divertidos com seus amigos!
          </p>
          <p className="text-sm text-slate-500 pt-4 border-t border-slate-700">
            🔒 Pagamento Seguro e Confiável
          </p>
        </div>
      </main>
    </div>
  );
}
