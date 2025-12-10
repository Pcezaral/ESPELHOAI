import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, CreditCard, Calendar, AlertCircle } from "lucide-react";

export default function Assinatura() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Minha Assinatura</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Status da Assinatura */}
        <Card className="bg-slate-900 border-slate-700 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Plano Gratuito</h2>
              <p className="text-slate-400">Você está usando o plano gratuito com 5 créditos</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Créditos Disponíveis</p>
              <p className="text-3xl font-bold text-orange-400">{user?.credits || 0}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Status</p>
              <p className="text-xl font-bold text-green-400">Ativo</p>
            </div>
          </div>

          <Button
            onClick={() => setLocation("/planos")}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
          >
            Fazer Upgrade para Plano Premium
          </Button>
        </Card>

        {/* Histórico de Pagamentos */}
        <Card className="bg-slate-900 border-slate-700 p-8">
          <h3 className="text-xl font-bold mb-6">Histórico de Pagamentos</h3>
          
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhum pagamento realizado ainda</p>
            <p className="text-sm text-slate-500 mt-2">
              Seus pagamentos aparecerão aqui após sua primeira compra
            </p>
          </div>
        </Card>

        {/* Seção de Cancelamento */}
        <Card className="bg-red-900/20 border-red-700/50 p-8 mt-8">
          <h3 className="text-xl font-bold text-red-400 mb-4">Cancelar Assinatura</h3>
          <p className="text-slate-300 mb-6">
            Você pode cancelar sua assinatura a qualquer momento. Seu acesso continuará até o final do período pago.
          </p>
          <Button
            variant="outline"
            className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
          >
            Cancelar Assinatura
          </Button>
          
          <p className="text-xs text-slate-400 mt-4">
            Para mais informações sobre cancelamento, consulte nossa <a href="/termos" className="text-orange-400 hover:underline">Política de Cancelamento</a>
          </p>
        </Card>
      </main>
    </div>
  );
}
