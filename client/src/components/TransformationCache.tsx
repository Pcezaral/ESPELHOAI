import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface CachedTransformation {
  id: number;
  theme: string;
  transformedImageUrl: string;
  createdAt: Date;
  expiresAt: Date;
  filters?: Record<string, number>;
}

interface TransformationCacheProps {
  userId: number;
  onSelectCache: (cache: CachedTransformation) => void;
}

export function TransformationCache({ userId, onSelectCache }: TransformationCacheProps) {
  const [cachedTransformations, setCachedTransformations] = useState<CachedTransformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCache, setShowCache] = useState(false);

  useEffect(() => {
    loadCachedTransformations();
  }, [userId]);

  const loadCachedTransformations = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementar chamada tRPC para buscar cache
      // const result = await trpc.transformation.getCachedTransformations.useQuery({ userId });
      // setCachedTransformations(result.data || []);
      setCachedTransformations([]);
    } catch (error) {
      console.error("Erro ao carregar cache:", error);
      toast.error("Erro ao carregar transformações salvas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (cache: CachedTransformation) => {
    const text = `Confira minha transformação ${cache.theme}! 🎨 Criada em ${new Date(cache.createdAt).toLocaleDateString("pt-BR")}`;
    
    if (navigator.share) {
      navigator.share({
        title: "ESPELHO AI - Transformação",
        text,
        url: cache.transformedImageUrl,
      }).catch(err => console.log("Erro ao compartilhar:", err));
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(`${text}\n${cache.transformedImageUrl}`);
      toast.success("Link copiado para clipboard!");
    }
  };

  const handleDownload = (cache: CachedTransformation) => {
    const link = document.createElement("a");
    link.href = cache.transformedImageUrl;
    link.download = `espelho-ai-${cache.theme}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagem baixada!");
  };

  if (!showCache) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowCache(true)}
        className="w-full"
      >
        📚 Ver Transformações Salvas ({cachedTransformations.length})
      </Button>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Suas Transformações Salvas
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCache(false)}
        >
          ✕
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        ✨ Suas transformações são salvas por <strong>3 meses</strong>. Você pode reutilizá-las sem gastar créditos!
      </p>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : cachedTransformations.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>Nenhuma transformação salva ainda.</p>
          <p className="text-sm mt-2">Crie sua primeira transformação para vê-la aqui!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {cachedTransformations.map((cache) => (
            <Card key={cache.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={cache.transformedImageUrl}
                  alt={`Transformação ${cache.theme}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onSelectCache(cache)}
                />
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <p className="font-medium text-sm text-gray-800 capitalize">
                    {cache.theme}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(cache.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Expira em {new Date(cache.expiresAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleDownload(cache)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleShare(cache)}
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-white p-3 rounded border border-blue-100 text-sm text-gray-700">
        <p className="font-medium mb-1">💡 Como funciona:</p>
        <ul className="space-y-1 text-xs">
          <li>✓ Suas transformações são salvas automaticamente</li>
          <li>✓ Você pode reutilizá-las sem gastar créditos</li>
          <li>✓ Elas expiram após 3 meses</li>
          <li>✓ Você pode aplicar novos filtros a qualquer momento</li>
        </ul>
      </div>
    </div>
  );
}
