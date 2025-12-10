import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Gift, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function TestDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  const creditsQuery = trpc.credits.getBalance.useQuery(undefined, {
    enabled: !!user,
  });

  const addCreditsMutation = trpc.credits.testAddCredits.useMutation();

  const handleAddTestCredits = () => {
    addCreditsMutation.mutate(
      { amount: 100 },
      {
        onSuccess: () => {
          toast.success("✅ 100 créditos de teste adicionados!");
          creditsQuery.refetch?.();
        },
        onError: () => {
          toast.error("Erro ao adicionar créditos de teste");
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-md text-center space-y-4">
          <p className="text-white text-lg">Você precisa estar logado para acessar o painel de teste.</p>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-black border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">
            🧪 Painel de <span className="text-orange-500">Teste</span>
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Aviso */}
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-200 font-semibold">Modo de Teste Ativado</p>
            <p className="text-yellow-100 text-sm">Use este painel para testar todas as funcionalidades sem limitações</p>
          </div>
        </div>

        {/* Info do Usuário */}
        <Card className="bg-slate-900/50 border-slate-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">👤 Informações do Usuário</h2>
          <div className="space-y-2 text-slate-300">
            <p><span className="text-white font-semibold">ID:</span> {user.id}</p>
            <p><span className="text-white font-semibold">Nome:</span> {user.name || "Não definido"}</p>
            <p><span className="text-white font-semibold">Email:</span> {user.email || "Não definido"}</p>
            <p><span className="text-white font-semibold">Role:</span> {user.role || "user"}</p>
          </div>
        </Card>

        {/* Créditos de Teste */}
        <Card className="bg-slate-900/50 border-slate-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Créditos de Teste
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Saldo Atual</p>
              <p className="text-3xl font-bold text-orange-400">
                {creditsQuery.data || 0} ⚡
              </p>
            </div>
            <Button
              onClick={handleAddTestCredits}
              disabled={addCreditsMutation.isPending}
              className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
            >
              <Gift className="w-4 h-4" />
              {addCreditsMutation.isPending ? "Adicionando..." : "Adicionar 100 Créditos de Teste"}
            </Button>
            <p className="text-slate-400 text-sm">
              💡 Clique acima para adicionar créditos ilimitados e testar transformações, downloads e compras
            </p>
          </div>
        </Card>

        {/* Testes Rápidos */}
        <Card className="bg-slate-900/50 border-slate-800 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🎯 Testes Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setLocation("/generator")}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12"
            >
              🎨 Testar Transformações
            </Button>
            <Button
              onClick={() => setLocation("/gallery")}
              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold h-12"
            >
              🖼️ Ver Galeria
            </Button>
            <Button
              onClick={() => setLocation("/planos")}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
            >
              💳 Testar Compra de Créditos
            </Button>
            <Button
              onClick={() => setLocation("/referral")}
              className="gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold h-12"
            >
              🔗 Testar Referral
            </Button>
          </div>
        </Card>

        {/* Checklist de Testes */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">✅ Checklist de Testes</h2>
          <div className="space-y-3">
            {[
              { name: "Transformações (Bichinho, Épico, etc)", icon: "🎭" },
              { name: "Downloads em Alta Resolução (HD/4K)", icon: "📥" },
              { name: "Compra de Créditos via Stripe", icon: "💰" },
              { name: "Sistema de Referral", icon: "👥" },
              { name: "Galeria de Produtos", icon: "🛍️" },
              { name: "Responsividade Mobile", icon: "📱" },
            ].map((test, i) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-600 text-orange-500"
                  defaultChecked={false}
                />
                <span className="text-white">{test.icon} {test.name}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Dicas */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 space-y-3">
          <h3 className="text-white font-bold flex items-center gap-2">
            💡 Dicas de Teste
          </h3>
          <ul className="text-blue-100 space-y-2 text-sm">
            <li>• Use créditos de teste para fazer transformações ilimitadas</li>
            <li>• Cartão Stripe de teste: <code className="bg-slate-800 px-2 py-1 rounded">4242 4242 4242 4242</code></li>
            <li>• Qualquer data futura e CVC funcionam no Stripe teste</li>
            <li>• Teste em mobile abrindo em navegador do celular</li>
            <li>• Verifique o console do navegador (F12) para erros</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
