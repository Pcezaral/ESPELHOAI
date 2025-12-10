import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Loader2, ArrowLeft, Wand2, Download, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { StarRating } from "@/components/StarRating";
import { toast } from "sonner";
import { CreditBadge } from "@/components/CreditBadge";
import { ShareButtons } from "@/components/ShareButtons";
import { HighResolutionDownload } from "@/components/HighResolutionDownload";
import { useAuth } from "@/_core/hooks/useAuth";

type Theme = "animals" | "monster" | "art" | "gender" | "epic" | "gangster" | "circus" | "natal" | "reveillon";

const THEMES = [
  {
    id: "animals" as Theme,
    name: "Bichinho",
    emoji: "🐾",
    description: "Você como animal adorável mantendo suas características",
  },
  {
    id: "monster" as Theme,
    name: "Monstro",
    emoji: "👾",
    description: "Você como criatura fofa mantendo seus traços",
  },
  {
    id: "art" as Theme,
    name: "Pintura",
    emoji: "🎨",
    description: "Você como personagem histórico de época (1600s-1800s)",
  },
  {
    id: "gender" as Theme,
    name: "Se tivesse nascido...",
    emoji: "⚧️",
    description: "Descubra como você seria do outro gênero",
  },
  {
    id: "epic" as Theme,
    name: "Romanos, Gregos e Vikings",
    emoji: "⚔️",
    description: "Você como guerreiro/deusa épico e poderoso",
  },
  {
    id: "gangster" as Theme,
    name: "Gangster 1920s",
    emoji: "🎩",
    description: "Você na era da Lei Seca: carros, boates, conflitos",
  },
  {
    id: "circus" as Theme,
    name: "Circo",
    emoji: "🎪",
    description: "Você como artista de circo: acrobata, palhaço, mágico...",
  },
  {
    id: "natal" as Theme,
    name: "Natal",
    emoji: "🎄",
    description: "Você como personagem natalino: Papai Noel, Mamãe Noel, Rena, Elfo...",
  },
  {
    id: "reveillon" as Theme,
    name: "Réveillon 2026",
    emoji: "🎆",
    description: "Você celebrando o Ano Novo com estilo: praia, fogos, festas...",
  },
];

export default function Generator() {
  const { user, isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const themeFromUrl = searchParams.get('theme') as Theme | null;
  
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(themeFromUrl);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);
  
  const initialStep = themeFromUrl ? "upload" : "theme";
  const [step, setStep] = useState<"theme" | "upload" | "processing" | "result">(initialStep as any);

  const generateMutation = trpc.generation.generate.useMutation();
  const uploadMutation = trpc.generation.uploadImage.useMutation();
  const ratingMutation = trpc.rating.submit.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated && !user) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return null;
  }

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setStep("upload");
    setLocation(`/generator?theme=${theme}`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleGenerate = async () => {
    if (!selectedImage || !selectedTheme || !previewUrl) return;

    setStep("processing");

    try {
      const base64Image = previewUrl.split(",")[1];
      const uploadResult = await uploadMutation.mutateAsync({
        imageBase64: base64Image,
        filename: selectedImage.name,
      });

      const result = await generateMutation.mutateAsync({
        theme: selectedTheme,
        imageUrl: uploadResult.url,
      });

      setGeneratedImage(result.generatedImageUrl);
      setGeneratedText(result.generatedText);
      setStep("result");
    } catch (error: any) {
      console.error("Generation error:", error);
      if (error.message && error.message.includes("Insufficient credits")) {
        toast.error("Créditos insuficientes! Compre mais créditos para continuar.", {
          action: {
            label: "Ver Planos",
            onClick: () => setLocation("/planos"),
          },
        });
      } else {
        toast.error("Erro ao gerar transformação. Tente novamente.");
      }
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("theme");
    setSelectedTheme(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    setGeneratedImage(null);
    setGeneratedText(null);
    setHasRated(false);
  };

  const handleRate = async (rating: number) => {
    if (!selectedTheme || hasRated) return;
    
    try {
      await ratingMutation.mutateAsync({
        theme: selectedTheme,
        rating,
      });
      setHasRated(true);
      toast.success("Obrigado pelo seu feedback!");
    } catch (error) {
      toast.error("Erro ao enviar avaliação");
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `descubra-seu-verdadeiro-eu-${selectedTheme}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (message: string) => {
    const isHolidayTheme = selectedTheme === "natal" || selectedTheme === "reveillon";
    const hashtag = isHolidayTheme ? " #EspelhoAI2026 🎄🎆" : "";
    const appUrl = `https://descubraeu-ipcsmflf.manus.space?ref=share`;
    const text = `✨ ESPELHO AI ✨\n${message}${hashtag}\n\nDescubra seu verdadeiro eu!\n${appUrl}`;
    
    if (navigator.share && generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], `espelho-ai-${selectedTheme}.jpg`, { type: "image/jpeg" });
        
        await navigator.share({
          title: "ESPELHO AI",
          text,
          files: [file],
        });
        return;
      } catch (error) {
        console.error("Erro ao compartilhar com imagem:", error);
      }
    }
    
    const url = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <img src="/espelho-ai-logo-transp.png" alt="ESPELHO AI" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-white">
              ESPELHO <span className="text-orange-500">AI</span>
            </h1>
          </div>
          <CreditBadge />
        </div>
      </header>

      <main className="container py-12 relative z-10">

        {/* Step 1: Theme Selection */}
        {step === "theme" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-white">Escolha um estilo</h2>
              <p className="text-slate-300 text-lg">Selecione como você quer se transformar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {THEMES.map((theme) => (
                <Card
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className="cursor-pointer border-2 border-slate-700 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 bg-slate-900/50 overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    <div className="text-5xl text-center">{theme.emoji}</div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white text-center">{theme.name}</h3>
                      <p className="text-sm text-slate-300 text-center">{theme.description}</p>
                    </div>
                    <Button className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold">
                      <Wand2 className="w-4 h-4" />
                      Transforme
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Upload Image */}
        {step === "upload" && selectedTheme && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-white">Carregue sua foto</h2>
              <p className="text-slate-300 text-lg">Escolha uma imagem ou tire uma foto para transformar</p>
            </div>

            {!previewUrl ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-orange-500/30 rounded-lg p-12 text-center space-y-4 hover:border-orange-500/60 transition-colors">
                  <Upload className="w-16 h-16 text-orange-500 mx-auto" />
                  <div>
                    <p className="text-white font-semibold mb-2">Clique para carregar ou arraste uma imagem</p>
                    <p className="text-slate-400 text-sm">PNG, JPG até 10MB</p>
                  </div>
                  <Button onClick={handleUploadClick} className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Upload className="w-4 h-4" />
                    Carregar Arquivo
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-950 text-slate-400">ou</span>
                  </div>
                </div>

                <Button onClick={handleCameraClick} variant="outline" className="w-full gap-2 border-slate-700 text-white hover:bg-slate-800">
                  <Camera className="w-4 h-4" />
                  Usar Câmera
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden border-2 border-orange-500/30">
                  <img src={previewUrl} alt="Preview" className="w-full h-auto" />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleUploadClick} variant="outline" className="flex-1 border-slate-700 text-white hover:bg-slate-800">
                    Mudar Foto
                  </Button>
                  <Button onClick={handleGenerate} disabled={generateMutation.isPending} className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Transformar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Step 3: Processing */}
        {step === "processing" && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-orange-500 mx-auto animate-spin" />
              <h2 className="text-4xl font-bold text-white">Transformando sua foto...</h2>
              <p className="text-slate-300">Isso pode levar alguns segundos</p>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === "result" && generatedImage && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-white">Sua transformação!</h2>
              <p className="text-slate-300">Confira o resultado</p>
            </div>

            {/* Antes e Depois */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-center text-slate-400 font-semibold text-sm">Antes</p>
                <div className="rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-900">
                  <img src={previewUrl || ""} alt="Antes" className="w-full h-auto object-cover aspect-square" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-center text-slate-400 font-semibold text-sm">Depois</p>
                <div className="rounded-lg overflow-hidden border-2 border-orange-500/30 bg-slate-900">
                  <img src={generatedImage} alt="Depois" className="w-full h-auto object-cover aspect-square" />
                </div>
              </div>
            </div>

            {!hasRated && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <p className="text-white font-semibold">Como foi a transformação?</p>
                <StarRating onRate={handleRate} />
              </div>
            )}

            <div className="space-y-4">
              <Button onClick={handleDownload} className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Download className="w-4 h-4" />
                Baixar Imagem
              </Button>
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <p className="text-white font-semibold mb-3 text-center">Compartilhe com seus amigos!</p>
                <ShareButtons message="Veja minha transformação no ESPELHO AI!" imageUrl={generatedImage} theme={selectedTheme || undefined} />
              </div>
            </div>

            <HighResolutionDownload imageUrl={generatedImage} theme={selectedTheme || undefined} />

            <Button onClick={handleReset} variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
              Fazer Outra Transformação
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
