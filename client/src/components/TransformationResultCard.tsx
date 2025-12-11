import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Download, Share2, Filter } from "lucide-react";
import { useState } from "react";
import { ImageFilters, FilterValues } from "./ImageFilters";
import { DeferredPaymentNotice } from "./DeferredPaymentNotice";

interface TransformationResultCardProps {
  imageUrl: string;
  theme: string;
  creditsUsed: number;
  currentCredits: number;
  onDownload: (resolution: "hd" | "4k", filters?: FilterValues) => void;
  onShare: () => void;
  isLoading?: boolean;
}

export function TransformationResultCard({
  imageUrl,
  theme,
  creditsUsed,
  currentCredits,
  onDownload,
  onShare,
  isLoading,
}: TransformationResultCardProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<"hd" | "4k" | null>(null);

  const handleApplyFilters = (filters: FilterValues) => {
    setAppliedFilters(filters);
    setShowFilters(false);
  };

  const handleDownloadClick = (resolution: "hd" | "4k") => {
    setSelectedResolution(resolution);
  };

  const handleConfirmDownload = () => {
    if (selectedResolution) {
      onDownload(selectedResolution, appliedFilters || undefined);
      setSelectedResolution(null);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Cabeçalho com informações */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {theme}
          </h2>
          <p className="text-gray-700">
            ✨ Sua transformação foi criada com sucesso!
          </p>
        </div>
      </Card>

      {/* Imagem com filtros */}
      <Card className="overflow-hidden">
        <div className="relative bg-gray-100">
          {showFilters ? (
            <ImageFilters
              imageUrl={imageUrl}
              onApplyFilters={handleApplyFilters}
              isLoading={isLoading}
            />
          ) : (
            <>
              <img
                src={imageUrl}
                alt={`Transformação ${theme}`}
                className="w-full h-auto object-contain"
              />
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-100"
              >
                <Filter className="w-4 h-4 mr-2" />
                Adicionar Filtros
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Informações sobre cache */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">
              ✨ Transformação Salva por 3 Meses
            </h3>
            <p className="text-sm text-blue-800 mt-1">
              Sua transformação foi salva automaticamente. Você pode reutilizá-la sem gastar créditos novamente!
            </p>
          </div>
        </div>
      </Card>

      {/* Informações sobre créditos */}
      <Card className="p-4 bg-orange-50 border-orange-200">
        <div className="flex gap-3">
          <Zap className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900">
              Créditos Utilizados
            </h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-orange-800">
                Créditos gastos nesta transformação:
              </span>
              <span className="text-lg font-bold text-orange-600">
                -{creditsUsed}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-orange-800">
                Seus créditos restantes:
              </span>
              <span className={`text-lg font-bold ${currentCredits > 0 ? "text-green-600" : "text-red-600"}`}>
                {currentCredits}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Downloads Premium */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-green-600" />
          Downloads em Alta Resolução
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* HD */}
          <Card className="p-4 bg-white border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer"
            onClick={() => handleDownloadClick("hd")}>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">HD (300 DPI)</h4>
              <p className="text-sm text-gray-600">Perfeito para redes sociais</p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">5 créditos</span>
                <span className="text-lg font-bold text-green-600">R$ 9,90</span>
              </div>
            </div>
          </Card>

          {/* 4K */}
          <Card className="p-4 bg-white border-2 border-orange-200 hover:border-orange-400 transition-colors cursor-pointer"
            onClick={() => handleDownloadClick("4k")}>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Premium 4K (600 DPI)</h4>
              <p className="text-sm text-gray-600">Para impressão e produtos</p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">10 créditos</span>
                <span className="text-lg font-bold text-orange-600">R$ 19,90</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Mostrar aviso de pagamento diferido se selecionado */}
        {selectedResolution && (
          <div className="mt-4">
            <DeferredPaymentNotice
              creditsCost={selectedResolution === "hd" ? 5 : 10}
              resolution={selectedResolution}
              currentCredits={currentCredits}
              onConfirm={handleConfirmDownload}
              isLoading={isLoading}
            />
          </div>
        )}
      </Card>

      {/* Compartilhar */}
      <Button
        onClick={onShare}
        variant="outline"
        className="w-full py-6 text-lg font-semibold"
        disabled={isLoading}
      >
        <Share2 className="w-5 h-5 mr-2" />
        Compartilhar Transformação
      </Button>

      {/* Dicas */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">💡 Dicas Úteis</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Você pode aplicar filtros antes de baixar</li>
          <li>✓ Pagamento diferido: baixe agora, pague depois</li>
          <li>✓ Suas transformações ficam salvas por 3 meses</li>
          <li>✓ Compartilhe com amigos e ganhe créditos de bônus</li>
        </ul>
      </Card>
    </div>
  );
}
