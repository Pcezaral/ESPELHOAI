import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Sparkles, ChevronLeft, ChevronRight, Download, CheckCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

interface HighResolutionDownloadProps {
  imageUrl: string;
  theme?: string;
  onCreditsUpdated?: () => void;
}

type ProductType = "camiseta" | "caneca" | "poster";

export function HighResolutionDownload({ imageUrl, theme, onCreditsUpdated }: HighResolutionDownloadProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("camiseta");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const downloadMutation = trpc.generation.downloadHighResolution.useMutation();
  
  // Custo fixo de 5 créditos
  const CREDIT_COST = 5;
  const userCredits = user?.credits || 0;
  const hasEnoughCredits = userCredits >= CREDIT_COST;

  const products: Array<{ id: ProductType; name: string; emoji: string; description: string }> = [
    { id: "camiseta", name: "Camiseta", emoji: "👕", description: "Estampa em camiseta de qualidade" },
    { id: "caneca", name: "Caneca", emoji: "☕", description: "Impressão em caneca cerâmica" },
    { id: "poster", name: "Foto/Poster", emoji: "🖼️", description: "Impressão em papel fotográfico" },
  ];

  /**
   * Permite ao usuário escolher onde salvar a imagem (Galeria/Fotos)
   */
  const downloadToDevice = async (url: string, filename: string) => {
    try {
      // Usar proxy do servidor para evitar CORS
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      // Tentar Web Share API com arquivo (funciona em mobile para salvar na galeria)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'ESPELHO AI - Imagem para Impressão',
          });
          toast.success("✅ Escolha onde salvar a imagem!");
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') return;
          // Continua para fallback
        }
      }
      
      // Fallback: Download tradicional (desktop)
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
      toast.success("✅ Imagem salva! Verifique Downloads ou Galeria.");
    } catch (error) {
      console.error("Download error:", error);
      // Último fallback: abrir imagem para salvar manualmente
      window.open(url, '_blank');
      toast.info("Segure na imagem para salvar na galeria.");
    }
  };

  const handleDownload = async () => {
    if (!hasEnoughCredits) {
      toast.error(`Você precisa de ${CREDIT_COST} créditos. Você tem ${userCredits}.`);
      setIsOpen(false);
      setLocation("/planos");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      downloadMutation.mutate(
        {
          imageUrl,
          resolution: "hd", // Mantemos "hd" para compatibilidade com backend
          product: selectedProduct,
          theme: theme || "unknown",
        },
        {
          onSuccess: async (data: any) => {
            if (data.downloadUrl) {
              const filename = `espelho-ai-${selectedProduct}-${Date.now()}.jpg`;
              await downloadToDevice(data.downloadUrl, filename);
              setDownloadSuccess(true);
              onCreditsUpdated?.();
              
              setTimeout(() => {
                setDownloadSuccess(false);
              }, 3000);
            }
          },
          onError: (error: any) => {
            toast.error(error.message || "Erro ao processar download");
            setDownloadSuccess(false);
          },
          onSettled: () => {
            setIsDownloading(false);
          },
        }
      );
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erro ao processar download");
      setIsDownloading(false);
    }
  };

  const currentProduct = products.find((p) => p.id === selectedProduct);
  const productIndex = products.findIndex((p) => p.id === selectedProduct);

  const handlePrevProduct = () => {
    const newIndex = productIndex === 0 ? products.length - 1 : productIndex - 1;
    setSelectedProduct(products[newIndex].id);
  };

  const handleNextProduct = () => {
    const newIndex = productIndex === products.length - 1 ? 0 : productIndex + 1;
    setSelectedProduct(products[newIndex].id);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="text-white font-bold gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        size="lg"
      >
        <Sparkles className="w-5 h-5" />
        Baixar para Impressão
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-orange-500" />
              Download para Impressão
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Imagem otimizada para camisetas, canecas e fotos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Preview da Imagem */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-40 h-40 rounded-lg object-cover border-2 border-orange-500/50"
                />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {currentProduct?.emoji} {currentProduct?.name}
                </div>
              </div>
            </div>

            {/* Seleção de Produto */}
            <div>
              <h3 className="text-white font-bold mb-3 text-sm">Escolha o Produto:</h3>
              <div className="flex items-center justify-between gap-3">
                <Button
                  onClick={handlePrevProduct}
                  variant="outline"
                  size="icon"
                  className="border-slate-600 hover:bg-slate-800 h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Card className="flex-1 bg-slate-800 border-slate-700 p-3 text-center">
                  <div className="text-3xl mb-1">{currentProduct?.emoji}</div>
                  <div className="font-bold text-white">{currentProduct?.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{currentProduct?.description}</div>
                </Card>

                <Button
                  onClick={handleNextProduct}
                  variant="outline"
                  size="icon"
                  className="border-slate-600 hover:bg-slate-800 h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Custo */}
            <div className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
              <span className="text-sm text-slate-300">Custo:</span>
              <span className="text-lg font-bold text-orange-400">{CREDIT_COST} créditos</span>
            </div>

            {/* Saldo */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Seu saldo:</span>
              <span className={`font-medium ${hasEnoughCredits ? "text-green-400" : "text-red-400"}`}>
                {userCredits} créditos
              </span>
            </div>

            {/* Status de Download */}
            {downloadSuccess && (
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-bold text-green-400 text-sm">Download Concluído!</div>
                  <div className="text-xs text-green-300">Imagem salva na Galeria/Fotos</div>
                </div>
              </div>
            )}

            {/* Botão de Download */}
            <Button
              onClick={handleDownload}
              disabled={isDownloading || downloadMutation.isPending || !hasEnoughCredits}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-5 gap-2"
            >
              {isDownloading || downloadMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : !hasEnoughCredits ? (
                "Créditos insuficientes"
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Confirmar e Baixar ({CREDIT_COST} créditos)
                </>
              )}
            </Button>

            {!hasEnoughCredits && (
              <p className="text-xs text-center text-red-400">
                Você precisa de mais créditos.{" "}
                <a href="/planos" className="underline">Comprar créditos</a>
              </p>
            )}

            {/* Informações */}
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-3 text-xs text-blue-200">
              <div className="font-bold mb-1">💡 Dica:</div>
              <ul className="space-y-0.5">
                <li>✓ Imagem salva automaticamente na Galeria (Android) ou Fotos (iOS)</li>
                <li>✓ Qualidade ideal para camisetas, canecas e fotos até 15x20cm</li>
                <li>✓ Compartilhe direto do seu dispositivo</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
