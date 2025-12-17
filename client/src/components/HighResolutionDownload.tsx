import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Sparkles, ChevronLeft, ChevronRight, Download, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

interface HighResolutionDownloadProps {
  imageUrl: string;
  theme?: string;
}

type ResolutionType = "hd" | "4k";
type ProductType = "camiseta" | "caneca" | "poster";

export function HighResolutionDownload({ imageUrl, theme }: HighResolutionDownloadProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionType>("hd");
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("camiseta");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const downloadMutation = trpc.generation.downloadHighResolution.useMutation();
  
  // Verificar se usuario tem creditos suficientes
  const userCredits = user?.credits || 0;
  const hasEnoughCredits = (resolution: ResolutionType) => {
    const cost = resolution === "hd" ? 5 : 10;
    return userCredits >= cost;
  };

  const resolutions = [
    {
      id: "hd" as ResolutionType,
      name: "HD (300 DPI)",
      size: "2400x2400px",
      description: "Perfeito para camisetas e canecas",
      credits: 5,
      price: "5 créditos",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "4k" as ResolutionType,
      name: "Premium 4K (600 DPI)",
      size: "4800x6000px",
      description: "Qualidade máxima para fotos e posters",
      credits: 10,
      price: "10 créditos",
      color: "from-purple-500 to-pink-500",
      badge: "MELHOR QUALIDADE",
    },
  ];

  const products: Array<{ id: ProductType; name: string; emoji: string; description: string }> = [
    { id: "camiseta", name: "Camiseta", emoji: "👕", description: "Estampa em camiseta de qualidade" },
    { id: "caneca", name: "Caneca", emoji: "☕", description: "Impressão em caneca cerâmica" },
    { id: "poster", name: "Poster", emoji: "🖼️", description: "Impressão em papel fotográfico" },
  ];

  /**
   * Permite ao usuário escolher onde salvar a imagem
   * Usa File System Access API quando disponível (Chrome/Edge desktop)
   * Fallback para download tradicional em outros navegadores
   */
  const downloadToDevice = async (url: string, filename: string) => {
    try {
      // Fetch the image
      const response = await fetch(url);
      const blob = await response.blob();

      // Tentar usar File System Access API (permite escolher local)
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [{
              description: 'Imagem JPEG',
              accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
            }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          toast.success("✅ Imagem salva com sucesso!");
          return;
        } catch (err: any) {
          // Usuário cancelou ou API não disponível
          if (err.name === 'AbortError') {
            return; // Usuário cancelou, não mostrar erro
          }
          // Continua para fallback
        }
      }

      // Fallback: Download tradicional (abre diálogo do navegador)
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      // Detectar dispositivo para mensagem apropriada
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        toast.success("✅ Imagem salva! Verifique o app Fotos ou Downloads");
      } else if (isAndroid) {
        toast.success("✅ Imagem baixada! Verifique a Galeria ou Downloads");
      } else {
        toast.success("✅ Download iniciado! Verifique sua pasta de downloads");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erro ao baixar imagem");
    }
  };

  const handleDownload = async () => {
    // Verificar se tem creditos suficientes
    const cost = selectedResolution === "hd" ? 5 : 10;
    if (userCredits < cost) {
      toast.error(`Você precisa de ${cost} créditos para este download. Você tem ${userCredits}.`);
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
          resolution: selectedResolution,
          product: selectedProduct,
          theme: theme || "unknown",
        },
        {
          onSuccess: (data: any) => {
            if (data.downloadUrl) {
              setDownloadUrl(data.downloadUrl);
              
              // Gerar nome do arquivo
              const filename = `transformacao-${selectedResolution}-${selectedProduct}-${Date.now()}.jpg`;
              
              // Baixar para o dispositivo
              downloadToDevice(data.downloadUrl, filename);
              
              // Mostrar sucesso
              setDownloadSuccess(true);
              toast.success("✅ Imagem em alta resolução baixada com sucesso!");
              
              // Resetar após 3 segundos
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

  const currentResolution = resolutions.find((r) => r.id === selectedResolution);
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
        Baixar em Alta Resolução (HD/4K)
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-2">
              <Download className="w-6 h-6 text-orange-500" />
              Download em Alta Resolução
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Escolha a resolução e o tipo de produto para sua transformação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Preview da Imagem */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-48 h-48 rounded-lg object-cover border-2 border-orange-500/50"
                />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {currentProduct?.emoji} {currentProduct?.name}
                </div>
              </div>
            </div>

            {/* Seleção de Resolução */}
            <div>
              <h3 className="text-white font-bold mb-3">Escolha a Resolução:</h3>
              <div className="grid grid-cols-2 gap-3">
                {resolutions.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResolution(res.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedResolution === res.id
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-700 bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-white">{res.name}</div>
                      <div className="text-sm text-slate-400">{res.size}</div>
                      <div className="text-sm text-slate-300 mt-1">{res.description}</div>
                      <div className="text-orange-400 font-bold mt-2">{res.price}</div>
                      {res.badge && (
                        <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded mt-2 inline-block">
                          {res.badge}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Produto */}
            <div>
              <h3 className="text-white font-bold mb-3">Escolha o Produto:</h3>
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={handlePrevProduct}
                  variant="outline"
                  size="icon"
                  className="border-slate-600 hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Card className="flex-1 bg-slate-800 border-slate-700 p-4 text-center">
                  <div className="text-4xl mb-2">{currentProduct?.emoji}</div>
                  <div className="font-bold text-white text-lg">{currentProduct?.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{currentProduct?.description}</div>
                </Card>

                <Button
                  onClick={handleNextProduct}
                  variant="outline"
                  size="icon"
                  className="border-slate-600 hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Status de Download */}
            {downloadSuccess && (
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-bold text-green-400">Download Concluído!</div>
                  <div className="text-sm text-green-300">
                    A imagem foi salva em sua Galeria/Fotos
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Download */}
            <Button
              onClick={handleDownload}
              disabled={isDownloading || downloadMutation.isPending}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-6 text-lg gap-2"
            >
              {isDownloading || downloadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Confirmar e Baixar ({currentResolution?.price})
                </>
              )}
            </Button>

            {/* Informações */}
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4 text-sm text-blue-200">
              <div className="font-bold mb-2">💡 Dica:</div>
              <ul className="space-y-1 text-xs">
                <li>✓ A imagem será salva automaticamente em sua Galeria (Android) ou Fotos (iOS)</li>
                <li>✓ Você pode compartilhar direto do seu dispositivo</li>
                <li>✓ Qualidade garantida para impressão</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
