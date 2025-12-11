import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Download, Heart, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface TrendingTransformation {
  id: number;
  transformationId: number;
  userId: number;
  theme: string;
  imageUrl: string;
  title: string;
  description?: string;
  shareCount: number;
  downloadCount: number;
  ratingScore: number;
  isPublic: number;
  createdAt: string;
}

export default function Trending() {
  const [trendingItems, setTrendingItems] = useState<TrendingTransformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");

  const getTrendingQuery = trpc.trending.getTrending.useQuery(
    { limit: 20, theme: selectedTheme === "all" ? undefined : selectedTheme },
    { enabled: true }
  );

  const shareWhatsappMutation = trpc.social.shareWhatsapp.useMutation();

  const themes = [
    { id: "all", name: "Todas", emoji: "🌟" },
    { id: "animals", name: "Animais", emoji: "🐾" },
    { id: "monster", name: "Monstros", emoji: "👹" },
    { id: "art", name: "Arte", emoji: "🎨" },
    { id: "gender", name: "Gênero", emoji: "👥" },
    { id: "epic", name: "Épico", emoji: "⚔️" },
    { id: "gangster", name: "Gangster", emoji: "🔫" },
    { id: "circus", name: "Circo", emoji: "🎪" },
    { id: "natal", name: "Natal", emoji: "🎄" },
    { id: "reveillon", name: "Réveillon", emoji: "🎆" },
  ];

  useEffect(() => {
    if (getTrendingQuery.data) {
      setTrendingItems(getTrendingQuery.data);
      setIsLoading(false);
    }
  }, [getTrendingQuery.data]);

  const handleShareWhatsapp = (transformationId: number, title: string) => {
    shareWhatsappMutation.mutate(
      { transformationId, message: `Confira esta transformação incrível: ${title}` },
      {
        onSuccess: () => {
          toast.success("✅ Compartilhado no WhatsApp!");
        },
        onError: (error: any) => {
          toast.error(error.message || "Erro ao compartilhar");
        },
      }
    );
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${title}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("✅ Download iniciado!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Transformações em Trending
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Descubra as transformações mais populares da comunidade
          </p>
        </div>

        {/* Theme Filter */}
        <div className="mb-12 flex flex-wrap gap-2 justify-center">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                selectedTheme === theme.id
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>{theme.emoji}</span>
              {theme.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && trendingItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingItems.map((item) => (
              <Card
                key={item.id}
                className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-orange-500/50 transition-all group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Theme Badge */}
                  <div className="absolute top-3 right-3 bg-orange-500/90 px-3 py-1 rounded-full text-white text-sm font-semibold">
                    {item.theme}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Title */}
                  <div>
                    <h3 className="text-white font-bold text-lg line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4 text-orange-400" />
                      <span>{item.shareCount} compartilhamentos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>{item.downloadCount} downloads</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(item.ratingScore / 20)
                              ? "fill-red-500 text-red-500"
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-400">
                      {(item.ratingScore / 20).toFixed(1)}/5
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() =>
                        handleShareWhatsapp(item.transformationId, item.title)
                      }
                      disabled={shareWhatsappMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleDownload(item.imageUrl, item.title)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && trendingItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">
              Nenhuma transformação em trending para este filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
