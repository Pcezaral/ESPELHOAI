import { AlertCircle, CreditCard, Clock, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DeferredPaymentNoticeProps {
  creditsCost: number;
  resolution: "hd" | "4k";
  currentCredits: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeferredPaymentNotice({
  creditsCost,
  resolution,
  currentCredits,
  onConfirm,
  isLoading,
}: DeferredPaymentNoticeProps) {
  const hasEnoughCredits = currentCredits >= creditsCost;
  const creditsNeeded = creditsCost - currentCredits;

  const resolutionInfo = {
    hd: {
      name: "HD (300 DPI)",
      price: "R$ 9,90",
      credits: 5,
    },
    "4k": {
      name: "Premium 4K (600 DPI)",
      price: "R$ 19,90",
      credits: 10,
    },
  };

  const info = resolutionInfo[resolution];

  return (
    <div className="space-y-4">
      {/* Aviso Principal */}
      <Card className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              💳 Pagamento Diferido Disponível
            </h3>
            <p className="text-sm text-gray-700">
              Você não tem créditos suficientes agora, mas pode baixar mesmo assim! 
              Você pagará depois quando quiser.
            </p>
          </div>
        </div>
      </Card>

      {/* Detalhes do Download */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Resolução:</span>
            <span className="font-semibold text-gray-900">{info.name}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Créditos Necessários:</span>
            <span className="font-semibold text-orange-600">{creditsCost} créditos</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700">Seus Créditos:</span>
            <span className={`font-semibold ${hasEnoughCredits ? "text-green-600" : "text-red-600"}`}>
              {currentCredits} créditos
            </span>
          </div>

          {!hasEnoughCredits && (
            <div className="flex justify-between items-center pt-2 bg-red-50 -mx-4 px-4 py-3 rounded">
              <span className="text-gray-700">Faltam:</span>
              <span className="font-bold text-red-600">{creditsNeeded} créditos</span>
            </div>
          )}
        </div>
      </Card>

      {/* Como Funciona */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Como Funciona o Pagamento Diferido
        </h4>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>Você baixa a imagem agora sem ter créditos suficientes</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>A transação fica pendente na sua conta</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            <span>Você compra créditos quando quiser para confirmar o pagamento</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">4.</span>
            <span>Nenhuma taxa extra ou juros - pague apenas o valor dos créditos</span>
          </li>
        </ul>
      </Card>

      {/* Preço */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Valor do Download:</p>
            <p className="text-2xl font-bold text-green-700">{info.price}</p>
            <p className="text-xs text-gray-500 mt-1">ou {creditsCost} créditos</p>
          </div>
          <CreditCard className="w-12 h-12 text-green-600 opacity-20" />
        </div>
      </Card>

      {/* Botão de Confirmação */}
      <Button
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 text-lg"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Processando...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Confirmar Download {hasEnoughCredits ? "com Créditos" : "com Pagamento Diferido"}
          </>
        )}
      </Button>

      {/* Informação Adicional */}
      <p className="text-xs text-gray-500 text-center">
        ✓ Nenhum cartão necessário agora • ✓ Sem compromisso • ✓ Cancele a qualquer momento
      </p>
    </div>
  );
}


