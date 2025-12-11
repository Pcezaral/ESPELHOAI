import React, { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, TrendingUp, DollarSign, Users, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { getLoginUrl } from '@/const';

export default function AffiliateProgram() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  const { data: affiliateData, isLoading } = trpc.affiliate.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createAffiliateMutation = trpc.affiliate.create.useMutation({
    onSuccess: () => {
      toast.success('Programa de afiliados ativado!');
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-orange-900/20 to-black flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Programa de Afiliados</h1>
          <p className="text-gray-400 mb-6">Faça login para participar do nosso programa de afiliados e ganhe comissões!</p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (affiliateData?.affiliateCode) {
      const affiliateLink = `${window.location.origin}?ref=${affiliateData.affiliateCode}`;
      navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900/20 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Ganhe Comissões
            </span>
          </h1>
          <p className="text-xl text-gray-300">Compartilhe seu link de afiliado e ganhe 10% de comissão em cada venda!</p>
        </div>

        {/* Main Stats */}
        {affiliateData ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Cliques</p>
                  <p className="text-3xl font-bold text-white">{affiliateData.totalClicks}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Conversões</p>
                  <p className="text-3xl font-bold text-white">{affiliateData.totalConversions}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-white">{affiliateData.conversionRate}%</p>
                </div>
                <Zap className="w-8 h-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Ganhos</p>
                  <p className="text-3xl font-bold text-white">R$ {(affiliateData.totalEarnings / 100).toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </div>
        ) : null}

        {/* Affiliate Link */}
        {affiliateData ? (
          <Card className="p-8 mb-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <h2 className="text-2xl font-bold mb-4">Seu Link de Afiliado</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={`${window.location.origin}?ref=${affiliateData.affiliateCode}`}
                readOnly
                className="flex-1 px-4 py-3 bg-black/50 border border-orange-500/30 rounded-lg text-white font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ativar Programa de Afiliados</h2>
            <p className="text-gray-400 mb-6">Clique abaixo para gerar seu link de afiliado único e começar a ganhar comissões!</p>
            <Button
              onClick={() => createAffiliateMutation.mutate()}
              disabled={createAffiliateMutation.isPending}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {createAffiliateMutation.isPending ? 'Ativando...' : 'Ativar Agora'}
            </Button>
          </Card>
        )}

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">1</div>
              <h3 className="text-lg font-bold">Compartilhe</h3>
            </div>
            <p className="text-gray-400">Compartilhe seu link de afiliado com amigos, família e seguidores nas redes sociais.</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">2</div>
              <h3 className="text-lg font-bold">Pessoas Clicam</h3>
            </div>
            <p className="text-gray-400">Quando alguém clica no seu link e se registra, você ganha crédito de afiliado.</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">3</div>
              <h3 className="text-lg font-bold">Ganhe Comissões</h3>
            </div>
            <p className="text-gray-400">Quando eles compram créditos, você recebe 10% de comissão na sua conta!</p>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <h3 className="font-bold mb-2">Qual é a comissão?</h3>
              <p className="text-gray-400">Você ganha 10% de comissão em cada compra feita através do seu link de afiliado.</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <h3 className="font-bold mb-2">Como recebo meus ganhos?</h3>
              <p className="text-gray-400">Você pode sacar seus ganhos via PIX, transferência bancária ou PayPal quando atingir o mínimo de R$ 50.</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <h3 className="font-bold mb-2">Há limite de ganhos?</h3>
              <p className="text-gray-400">Não! Você pode ganhar quanto quiser. Quanto mais pessoas você indicar, mais você ganha.</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <h3 className="font-bold mb-2">Quanto tempo leva para receber?</h3>
              <p className="text-gray-400">Os pagamentos são processados semanalmente. Você receberá seus ganhos em até 5 dias úteis.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
