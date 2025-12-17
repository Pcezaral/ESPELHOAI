import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Loader2, ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface BeforeAfterDownloadProps {
  originalImageUrl: string;
  transformedImageUrl: string;
  theme: string;
  userCredits: number;
  onCreditsUpdated?: () => void;
}

export function BeforeAfterDownload({
  originalImageUrl,
  transformedImageUrl,
  theme,
  userCredits,
  onCreditsUpdated,
}: BeforeAfterDownloadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /**
   * Permite ao usuário escolher onde salvar a imagem (Galeria/Fotos)
   */
  const downloadToDevice = async (imageUrl: string, filename: string) => {
    try {
      // Usar proxy do servidor para evitar CORS
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      // Tentar Web Share API com arquivo (funciona em mobile para salvar na galeria)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Antes/Depois - ESPELHO AI',
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
      window.open(imageUrl, '_blank');
      toast.info("Segure na imagem para salvar na galeria.");
    }
  };

  const generateBeforeAfterMutation = trpc.generation.generateBeforeAfter.useMutation({
    onSuccess: async (data) => {
      if (data.downloadUrl) {
        setPreviewUrl(data.downloadUrl);
        const filename = `antes-depois-${theme}-${Date.now()}.jpg`;
        await downloadToDevice(data.downloadUrl, filename);
        onCreditsUpdated?.();
      }
      setIsGenerating(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao gerar imagem. Tente novamente.");
      setIsGenerating(false);
    },
  });

  const handleDownload = async () => {
    if (userCredits < 1) {
      toast.error("Você precisa de pelo menos 1 crédito para baixar a imagem Antes/Depois.");
      return;
    }

    setIsGenerating(true);
    generateBeforeAfterMutation.mutate({
      originalImageUrl,
      transformedImageUrl,
      theme,
    });
  };

  const creditCost = 1;
  const hasEnoughCredits = userCredits >= creditCost;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-purple-500 text-purple-600 hover:bg-purple-50"
        >
          <ImageIcon className="h-4 w-4" />
          Baixar Antes/Depois
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            Download Antes/Depois
          </DialogTitle>
          <DialogDescription>
            Baixe uma imagem combinada mostrando a transformação lado a lado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview das imagens */}
          <div className="grid grid-cols-2 gap-2 rounded-lg border p-3 bg-gray-50">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-500 mb-1">Antes</div>
              <img
                src={originalImageUrl}
                alt="Antes"
                className="w-full h-24 object-cover rounded"
              />
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-gray-500 mb-1">Depois</div>
              <img
                src={transformedImageUrl}
                alt="Depois"
                className="w-full h-24 object-cover rounded"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-800">
              <strong>📸 Imagem combinada:</strong> As duas fotos serão unidas lado a lado
              com etiquetas "Antes" e "Depois" - perfeita para compartilhar!
            </p>
          </div>

          {/* Custo */}
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
            <span className="text-sm font-medium">Custo:</span>
            <span className="text-lg font-bold text-purple-600">
              {creditCost} crédito
            </span>
          </div>

          {/* Saldo */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Seu saldo:</span>
            <span className={`font-medium ${hasEnoughCredits ? "text-green-600" : "text-red-600"}`}>
              {userCredits} créditos
            </span>
          </div>

          {/* Botão de download */}
          <Button
            onClick={handleDownload}
            disabled={!hasEnoughCredits || isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando imagem...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {hasEnoughCredits
                  ? "Baixar Antes/Depois (1 crédito)"
                  : "Créditos insuficientes"}
              </>
            )}
          </Button>

          {!hasEnoughCredits && (
            <p className="text-xs text-center text-red-500">
              Você precisa de mais créditos.{" "}
              <a href="/planos" className="underline">
                Comprar créditos
              </a>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
