import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Trash2, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function DownloadHistory() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalDownloads: 0, hdDownloads: 0, k4Downloads: 0, totalCreditsCost: 0 });
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const downloadHistoryQuery = trpc.generation.getDownloadHistory.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated && !!user }
  );

  const downloadStatsQuery = trpc.generation.getDownloadStats.useQuery(
    undefined,
    { enabled: isAuthenticated && !!user }
  );

  useEffect(() => {
    if (!loading && !isAuthenticated && !user) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  useEffect(() => {
    if (downloadHistoryQuery.data) {
      setDownloads(downloadHistoryQuery.data);
      setIsLoadingHistory(false);
    }
  }, [downloadHistoryQuery.data]);

  useEffect(() => {
    if (downloadStatsQuery.data) {
      setStats(downloadStatsQuery.data);
    }
  }, [downloadStatsQuery.data]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResolutionLabel = (resolution: string) => {
    return resolution === "hd" ? "HD (300 DPI)" : "4K (600 DPI)";
  };

  const getProductLabel = (product: string) => {
    const labels: Record<string, string> = {
      camiseta: "👕 Camiseta",
      caneca: "☕ Caneca",
      poster: "🖼️ Poster",
    };
    return labels[product] || product;
  };

  const getThemeLabel = (theme: string) => {
    const labels: Record<string, string> = {
      animals: "🐾 Bichinho",
      monster: "👾 Monstro",
      art: "🎨 Pintura",
      gender: "⚧️ Se tivesse nascido...",
      epic: "⚔️ Romanos, Gregos e Vikings",
      gangster: "🎩 Gangster 1920s",
      circus: "🎪 Circo",
      natal: "🎄 Natal",
      reveillon: "🎆 Réveillon 2026",
    };
    return labels[theme] || theme;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => setLocation("/generator")}
              variant="outline"
              size="icon"
              className="border-slate-600 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">Histórico de Downloads</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Total de Downloads</div>
              <div className="text-3xl font-bold text-orange-500">{stats.totalDownloads}</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Downloads HD</div>
              <div className="text-3xl font-bold text-blue-500">{stats.hdDownloads}</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Downloads 4K</div>
              <div className="text-3xl font-bold text-purple-500">{stats.k4Downloads}</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Créditos Gastos</div>
              <div className="text-3xl font-bold text-pink-500">{stats.totalCreditsCost}</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Downloads List */}
      <div className="container mx-auto px-4 py-8">
        {isLoadingHistory ? (
          <div className="text-center py-12">
            <div className="text-slate-400">Carregando histórico...</div>
          </div>
        ) : downloads.length === 0 ? (
          <div className="text-center py-12">
            <Download className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">Nenhum download ainda</p>
            <Button
              onClick={() => setLocation("/generator")}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Criar Transformação
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {downloads.map((download) => (
              <Card
                key={download.id}
                className="bg-slate-800 border-slate-700 p-4 hover:border-slate-600 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Imagem */}
                  <div className="flex-shrink-0">
                    <img
                      src={download.imageUrl}
                      alt="Transformação"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm text-slate-400">
                          {getThemeLabel(download.theme)}
                        </div>
                        <div className="text-lg font-semibold">
                          {getResolutionLabel(download.resolution)} • {getProductLabel(download.product)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">
                          {formatDate(download.downloadedAt)}
                        </div>
                        <div className="text-lg font-bold text-orange-500">
                          -{download.creditsCost} créditos
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          download.downloadStatus === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : download.downloadStatus === "failed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {download.downloadStatus === "completed"
                          ? "✓ Concluído"
                          : download.downloadStatus === "failed"
                          ? "✗ Falhou"
                          : "⏳ Pendente"}
                      </span>
                      {download.fileSize && (
                        <span className="text-xs text-slate-400">
                          {(download.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          window.open(download.imageUrl, "_blank");
                          toast.success("Abrindo imagem...");
                        }}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700 gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Baixar
                      </Button>
                      <Button
                        onClick={() => {
                          const text = `Veja minha transformação no ESPELHO AI!\n${download.imageUrl}`;
                          navigator.clipboard.writeText(text);
                          toast.success("Link copiado!");
                        }}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 hover:bg-slate-700 gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
