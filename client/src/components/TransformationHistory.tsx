import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { History, Download, Share2, X, Loader2, Clock, Eye } from "lucide-react";
import { toast } from "sonner";

// Mapeamento de temas para nomes amigáveis
const THEME_NAMES: Record<string, string> = {
  animals: "Bichinho 🐾",
  monster: "Monstro 👾",
  art: "Pintura 🎨",
  gender: "Se tivesse nascido... ⚧️",
  epic: "Épico ⚔️",
  gangster: "Gangster 🎩",
  circus: "Circo 🎪",
  natal: "Natal 🎄",
  reveillon: "Réveillon 🎆",
  beach: "Praia 🏖️",
};

interface TransformationHistoryProps {
  onSelectTransformation?: (transformation: {
    id: number;
    originalImageUrl: string;
    transformedImageUrl: string;
    theme: string;
  }) => void;
}

export function TransformationHistory({ onSelectTransformation }: TransformationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const { data, isLoading, refetch } = trpc.history.list.useQuery(
    { limit: 20 },
    { enabled: isOpen }
  );

  const handleDownload = async (imageUrl: string, theme: string) => {
    const filename = `espelho-ai-${theme}-${Date.now()}.jpg`;
    
    try {
      toast.info("📥 Preparando imagem...");
      
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      // Tentar Web Share API com arquivo
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Minha transformação ESPELHO AI',
          });
          toast.success("✅ Escolha onde salvar a imagem!");
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') return;
        }
      }
      
      // Fallback: Download tradicional
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
      
      toast.success("✅ Imagem salva!");
    } catch (error) {
      console.error("Download error:", error);
      window.open(imageUrl, '_blank');
      toast.info("Segure na imagem para salvar.");
    }
  };

  const handleShare = async (imageUrl: string, theme: string) => {
    const themeName = THEME_NAMES[theme] || theme;
    const shareText = `🪞 Olha minha transformação ${themeName} no ESPELHO AI!\n\n✨ Crie a sua também em espelhoai.com.br`;
    
    // Tentar compartilhar via WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + imageUrl)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Compartilhando via WhatsApp!");
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    } else {
      return 'Agora há pouco';
    }
  };

  const formatExpiresIn = (date: Date) => {
    const now = new Date();
    const expiresAt = new Date(date);
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expirando...';
    if (diffDays === 1) return 'Expira amanhã';
    return `Expira em ${diffDays} dias`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          <History className="w-5 h-5 mr-2" />
          Minhas Transformações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" />
            Minhas Transformações
          </DialogTitle>
          <p className="text-slate-400 text-sm">
            Suas transformações ficam disponíveis por 5 dias para baixar e compartilhar
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : !data?.transformations?.length ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhuma transformação ainda
            </h3>
            <p className="text-slate-400">
              Suas transformações aparecerão aqui depois de criá-las
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {data.transformations.map((item) => (
              <Card
                key={item.id}
                className={`bg-slate-800/50 border-slate-700 overflow-hidden transition-all hover:border-purple-500/50 ${
                  selectedItem === item.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {/* Imagem transformada */}
                <div className="relative aspect-square">
                  <img
                    src={item.transformedImageUrl}
                    alt={`Transformação ${THEME_NAMES[item.theme] || item.theme}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge do tema */}
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-white">
                      {THEME_NAMES[item.theme] || item.theme}
                    </span>
                  </div>
                  {/* Badge de expiração */}
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span className="text-xs text-orange-400">
                      {formatExpiresIn(item.expiresAt)}
                    </span>
                  </div>
                </div>

                {/* Info e ações */}
                <div className="p-3 space-y-3">
                  <div className="text-xs text-slate-400">
                    {formatTimeAgo(item.createdAt)}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => handleDownload(item.transformedImageUrl, item.theme)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-green-600 text-green-400 hover:bg-green-600/10"
                      onClick={() => handleShare(item.transformedImageUrl, item.theme)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Enviar
                    </Button>
                  </div>

                  {/* Botão para ver detalhes / usar */}
                  {onSelectTransformation && (
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        onSelectTransformation({
                          id: item.id,
                          originalImageUrl: item.originalImageUrl,
                          transformedImageUrl: item.transformedImageUrl,
                          theme: item.theme,
                        });
                        setIsOpen(false);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver detalhes
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
