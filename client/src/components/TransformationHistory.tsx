import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { History, Download, Share2, Loader2, Clock, Eye, Star, Filter, AlertTriangle } from "lucide-react";
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

const THEME_OPTIONS = [
  { value: "all", label: "Todos os temas" },
  { value: "favorites", label: "⭐ Favoritos" },
  { value: "animals", label: "🐾 Bichinho" },
  { value: "monster", label: "👾 Monstro" },
  { value: "art", label: "🎨 Pintura" },
  { value: "gender", label: "⚧️ Se tivesse nascido..." },
  { value: "epic", label: "⚔️ Épico" },
  { value: "gangster", label: "🎩 Gangster" },
  { value: "circus", label: "🎪 Circo" },
  { value: "natal", label: "🎄 Natal" },
  { value: "reveillon", label: "🎆 Réveillon" },
  { value: "beach", label: "🏖️ Praia" },
];

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
  const [filter, setFilter] = useState<string>("all");
  const [showExpiringAlert, setShowExpiringAlert] = useState(false);

  // Query para todos os itens
  const { data: allData, isLoading: allLoading, refetch: refetchAll } = trpc.history.list.useQuery(
    { limit: 50 },
    { enabled: isOpen && filter === "all" }
  );

  // Query para favoritos
  const { data: favoritesData, isLoading: favoritesLoading, refetch: refetchFavorites } = trpc.history.listFavorites.useQuery(
    { limit: 50 },
    { enabled: isOpen && filter === "favorites" }
  );

  // Query para tema específico
  const { data: themeData, isLoading: themeLoading, refetch: refetchTheme } = trpc.history.listByTheme.useQuery(
    { theme: filter as any, limit: 50 },
    { enabled: isOpen && filter !== "all" && filter !== "favorites" }
  );

  // Query para contagens
  const { data: counts, refetch: refetchCounts } = trpc.history.getCounts.useQuery(
    undefined,
    { enabled: isOpen }
  );

  // Query para itens expirando
  const { data: expiringData } = trpc.history.getExpiring.useQuery(
    undefined,
    { enabled: isOpen }
  );

  // Mutation para marcar como notificado
  const markNotifiedMutation = trpc.history.markNotified.useMutation();

  // Mutation para favoritar
  const toggleFavoriteMutation = trpc.history.toggleFavorite.useMutation({
    onSuccess: () => {
      refetchAll();
      refetchFavorites();
      refetchCounts();
      if (filter !== "all" && filter !== "favorites") {
        refetchTheme();
      }
    },
  });

  // Mostrar alerta de expiração quando abrir o modal
  useEffect(() => {
    if (isOpen && expiringData?.transformations?.length && !showExpiringAlert) {
      setShowExpiringAlert(true);
      const count = expiringData.transformations.length;
      toast.warning(
        `⚠️ ${count} transformaç${count > 1 ? 'ões vão' : 'ão vai'} expirar em menos de 24 horas! Favorite para manter.`,
        { duration: 6000 }
      );
      
      // Marcar como notificado
      const ids = expiringData.transformations.map(t => t.id);
      markNotifiedMutation.mutate({ transformationIds: ids });
    }
  }, [isOpen, expiringData]);

  // Determinar dados a exibir baseado no filtro
  const isLoading = filter === "all" ? allLoading : filter === "favorites" ? favoritesLoading : themeLoading;
  const transformations = filter === "all" 
    ? allData?.transformations 
    : filter === "favorites" 
    ? favoritesData?.transformations 
    : themeData?.transformations;

  const handleDownload = async (imageUrl: string, theme: string) => {
    const filename = `espelho-ai-${theme}-${Date.now()}.jpg`;
    
    try {
      toast.info("📥 Preparando imagem...");
      
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
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
    const shareText = `🪞 Olha minha transformação ${themeName} no ESPELHO AI!\n\n✨ Crie a sua também em https://www.espelhoai.com.br`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + imageUrl)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Compartilhando via WhatsApp!");
  };

  const handleToggleFavorite = (id: number, currentlyFavorite: boolean) => {
    const newState = !currentlyFavorite;
    toggleFavoriteMutation.mutate(
      { transformationId: id, isFavorite: newState },
      {
        onSuccess: () => {
          toast.success(newState ? "⭐ Adicionado aos favoritos!" : "Removido dos favoritos");
        },
        onError: () => {
          toast.error("Erro ao atualizar favorito");
        },
      }
    );
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

  const formatExpiresIn = (date: Date, isFavorite: boolean) => {
    if (isFavorite) return "⭐ Favorito";
    
    const now = new Date();
    const expiresAt = new Date(date);
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expirando...';
    if (diffDays === 1) return 'Expira amanhã';
    return `Expira em ${diffDays} dias`;
  };

  const isExpiringSoon = (date: Date, isFavorite: boolean) => {
    if (isFavorite) return false;
    const now = new Date();
    const expiresAt = new Date(date);
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setShowExpiringAlert(false);
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 relative"
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
            Suas transformações ficam disponíveis por 5 dias. Favorite para manter para sempre!
          </p>
        </DialogHeader>

        {/* Contadores e Filtro */}
        <div className="flex flex-wrap items-center gap-3 mt-2 mb-4">
          {counts && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                📷 {counts.total} total
              </Badge>
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30">
                ⭐ {counts.favorites} favoritos
              </Badge>
              {counts.expiringSoon > 0 && (
                <Badge variant="secondary" className="bg-red-600/20 text-red-400 border border-red-600/30 animate-pulse">
                  ⚠️ {counts.expiringSoon} expirando
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 ml-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Filtrar por tema" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {THEME_OPTIONS.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-white hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alerta de expiração */}
        {expiringData?.transformations?.length ? (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-400 font-medium text-sm">
                {expiringData.transformations.length} transformaç{expiringData.transformations.length > 1 ? 'ões vão' : 'ão vai'} expirar em menos de 24 horas!
              </p>
              <p className="text-orange-400/70 text-xs mt-1">
                Clique na ⭐ para favoritar e manter para sempre.
              </p>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : !transformations?.length ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === "favorites" 
                ? "Nenhum favorito ainda" 
                : filter !== "all" 
                ? `Nenhuma transformação de ${THEME_NAMES[filter] || filter}` 
                : "Nenhuma transformação ainda"}
            </h3>
            <p className="text-slate-400">
              {filter === "favorites" 
                ? "Clique na ⭐ para adicionar favoritos" 
                : "Suas transformações aparecerão aqui depois de criá-las"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {transformations.map((item) => {
              const isFavorite = item.isFavorite === 1;
              const expiringSoon = isExpiringSoon(item.expiresAt, isFavorite);
              
              return (
                <Card
                  key={item.id}
                  className={`bg-slate-800/50 border-slate-700 overflow-hidden transition-all hover:border-purple-500/50 ${
                    selectedItem === item.id ? 'ring-2 ring-purple-500' : ''
                  } ${expiringSoon ? 'border-orange-500/50' : ''} ${isFavorite ? 'border-yellow-500/30' : ''}`}
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
                    {/* Badge de expiração / favorito */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 ${
                      isFavorite 
                        ? 'bg-yellow-500/20 border border-yellow-500/50' 
                        : expiringSoon 
                        ? 'bg-orange-500/20 border border-orange-500/50' 
                        : 'bg-black/70'
                    }`}>
                      {isFavorite ? (
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <Clock className={`w-3 h-3 ${expiringSoon ? 'text-orange-400' : 'text-slate-400'}`} />
                      )}
                      <span className={`text-xs ${
                        isFavorite 
                          ? 'text-yellow-400' 
                          : expiringSoon 
                          ? 'text-orange-400' 
                          : 'text-slate-400'
                      }`}>
                        {formatExpiresIn(item.expiresAt, isFavorite)}
                      </span>
                    </div>
                    
                    {/* Botão de favoritar (overlay) */}
                    <button
                      onClick={() => handleToggleFavorite(item.id, isFavorite)}
                      className={`absolute bottom-2 right-2 p-2 rounded-full transition-all ${
                        isFavorite 
                          ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      disabled={toggleFavoriteMutation.isPending}
                    >
                      <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
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
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
