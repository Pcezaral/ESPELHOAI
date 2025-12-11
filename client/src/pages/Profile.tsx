import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Heart, Share2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

interface DownloadItem {
  id: number;
  imageUrl: string;
  resolution: "hd" | "4k";
  product: "camiseta" | "caneca" | "poster";
  theme: string;
  creditsCost: number;
  downloadedAt: Date;
}

export default function Profile() {
  const { user, loading } = useAuth();
  const [downloadHistory, setDownloadHistory] = useState<DownloadItem[]>([]);

  // Simular dados de histórico (em produção, vir do backend)
  useEffect(() => {
    // TODO: Chamar trpc.profile.getDownloadHistory() quando implementado
    setDownloadHistory([
      {
        id: 1,
        imageUrl: "https://via.placeholder.com/150",
        resolution: "4k",
        product: "camiseta",
        theme: "epic",
        creditsCost: 10,
        downloadedAt: new Date(Date.now() - 86400000),
      },
      {
        id: 2,
        imageUrl: "https://via.placeholder.com/150",
        resolution: "hd",
        product: "poster",
        theme: "gangster",
        creditsCost: 5,
        downloadedAt: new Date(Date.now() - 172800000),
      },
    ]);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar seu perfil</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const resolutionLabel = (res: string) => res === "hd" ? "HD (300 DPI)" : "4K (600 DPI)";
  const productLabel = (prod: string) => {
    const labels: Record<string, string> = {
      camiseta: "Camiseta",
      caneca: "Caneca",
      poster: "Poster",
    };
    return labels[prod] || prod;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header do Perfil */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name || "Usuário"}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.credits || 0}</div>
                <div className="text-sm text-muted-foreground">Créditos Disponíveis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{downloadHistory.length}</div>
                <div className="text-sm text-muted-foreground">Downloads Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Transformações Favoritadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="downloads" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="downloads">
              <Download className="w-4 h-4 mr-2" />
              Histórico de Downloads
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="shares">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhamentos
            </TabsTrigger>
          </TabsList>

          {/* Downloads */}
          <TabsContent value="downloads" className="space-y-4">
            {downloadHistory.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Você ainda não realizou nenhum download de alta resolução.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {downloadHistory.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        <img
                          src={item.imageUrl}
                          alt="Transformação"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold capitalize">{item.theme}</h3>
                              <p className="text-sm text-muted-foreground">
                                {productLabel(item.product)} • {resolutionLabel(item.resolution)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-primary">-{item.creditsCost} ⚡</div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.downloadedAt).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Baixar Novamente
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favoritos */}
          <TabsContent value="favorites">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Você ainda não favoritou nenhuma transformação.
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compartilhamentos */}
          <TabsContent value="shares">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Você ainda não compartilhou nenhuma transformação.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
