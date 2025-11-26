import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { StarRating } from "@/components/StarRating";
import { toast } from "sonner";
import { CreditBadge } from "@/components/CreditBadge";
type Theme = "animals" | "monster" | "art" | "gender" | "epic" | "gangster";

const THEMES = [
  {
    id: "animals" as Theme,
    name: "Bichinho",
    emoji: "🐾",
    description: "Você como animal adorável mantendo suas características",
    color: "from-orange-500 to-yellow-500",
    borderColor: "border-orange-500/30 hover:border-orange-500/60",
  },
  {
    id: "monster" as Theme,
    name: "Monstro",
    emoji: "👾",
    description: "Você como criatura fofa mantendo seus traços",
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
  },
  {
    id: "art" as Theme,
    name: "Pintura",
    emoji: "🎨",
    description: "Você como personagem histórico de época (1600s-1800s)",
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
  },
  {
    id: "gender" as Theme,
    name: "Se tivesse nascido...",
    emoji: "⚧️",
    description: "Descubra como você seria do outro gênero",
    color: "from-pink-500 to-blue-500",
    borderColor: "border-pink-500/30 hover:border-pink-500/60",
  },
  {
    id: "epic" as Theme,
    name: "Romanos, Gregos e Vikings",
    emoji: "⚔️",
    description: "Você como guerreiro/deusa épico e poderoso",
    color: "from-yellow-600 to-red-600",
    borderColor: "border-yellow-600/30 hover:border-yellow-600/60",
  },
  {
    id: "gangster" as Theme,
    name: "Gangster 1920s",
    emoji: "🎩",
    description: "Você na era da Lei Seca: carros, boates, conflitos",
    color: "from-gray-700 to-gray-900",
    borderColor: "border-gray-700/30 hover:border-gray-700/60",
  },
];

export default function Generator() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"theme" | "upload" | "processing" | "result">(
    "theme"
  );
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);

  if (!isAuthenticated && !user) {
    setLocation("/");
    return null;
  }

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setStep("upload");
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

  const generateMutation = trpc.generation.generate.useMutation();
  const uploadMutation = trpc.generation.uploadImage.useMutation();
  const ratingMutation = trpc.rating.submit.useMutation();

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
      toast.error("Erro ao enviar avalia\u00e7\u00e3o");
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

  const handleShare = (message: string) => {
    const text = `${message}\n\nDescubra seu verdadeiro eu! Acesse: [link do app]`;
    const url = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
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
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-white">Escolha seu tema</h2>
              <p className="text-slate-300 text-lg">
                Qual transformação você quer fazer?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {THEMES.map((theme) => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all border-2 ${theme.borderColor} bg-slate-900/50 hover:shadow-lg hover:shadow-orange-500/20`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <div className={`bg-gradient-to-br ${theme.color} p-8 rounded-t-lg`}>
                    <p className="text-6xl text-center">{theme.emoji}</p>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      {theme.name}
                    </h3>
                    <p className="text-slate-400">{theme.description}</p>
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
              <h2 className="text-4xl font-bold text-white">
                Envie sua foto
              </h2>
              <p className="text-slate-300 text-lg">
                Tema: <span className="font-bold text-orange-400">{THEMES.find(t => t.id === selectedTheme)?.name}</span>
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mt-4">
                <p className="text-sm font-medium text-orange-800">
                  💡 <strong>Dica:</strong> O ESPELHO AI oferece melhores resultados com fotos individuais ou até duas pessoas.
                </p>
              </div>
            </div>

            {!previewUrl ? (
              <Card className="border-2 border-dashed border-orange-500/30 bg-slate-900/50 p-12">
                <div className="space-y-6 text-center">
                  <div className="text-6xl">📸</div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-white">
                      Escolha uma foto
                    </p>
                    <p className="text-slate-400">
                      Você pode fazer upload ou tirar uma foto com a câmera
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleUploadClick}
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                    >
                      <Upload className="w-5 h-5" />
                      Upload de arquivo
                    </Button>
                    <Button
                      onClick={handleCameraClick}
                      size="lg"
                      className="gap-2 border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                    >
                      <Camera className="w-5 h-5" />
                      Tirar foto
                    </Button>
                  </div>

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
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="overflow-hidden border-orange-500/30 bg-slate-900/50">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-96 object-cover"
                  />
                </Card>

                <div className="flex gap-4">
                  <Button
                    onClick={handleUploadClick}
                    variant="outline"
                    className="flex-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                  >
                    Escolher outra foto
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                  >
                    Gerar transformação
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Processing */}
        {step === "processing" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-slate-900/50 border-orange-500/30 p-12">
              <div className="space-y-6 text-center">
                <Loader2 className="w-16 h-16 mx-auto text-orange-400 animate-spin" />
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">
                    Criando sua transformação...
                  </h2>
                  <p className="text-slate-300">
                    A IA está trabalhando na sua imagem. Isso pode levar alguns segundos.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Result */}
        {step === "result" && generatedImage && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-white">
                Sua transformação está pronta!
              </h2>
              <p className="text-slate-300 text-lg">
                Tema: <span className="font-bold text-orange-400">{THEMES.find(t => t.id === selectedTheme)?.name}</span>
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mt-4">
                <p className="text-sm font-medium text-orange-800">
                  💡 <strong>Dica:</strong> O ESPELHO AI oferece melhores resultados com fotos individuais ou até duas pessoas.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-orange-500/30 bg-slate-900/50">
                <div className="p-4 bg-slate-800/50 border-b border-slate-700">
                  <p className="text-sm font-semibold text-slate-300">Foto Original</p>
                </div>
                <img
                  src={previewUrl || ""}
                  alt="Original"
                  className="w-full h-96 object-cover"
                />
              </Card>

              <Card className="overflow-hidden border-orange-500/30 bg-slate-900/50">
                <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/30">
                  <p className="text-sm font-semibold text-orange-300">Transformação</p>
                </div>
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-96 object-cover"
                />
              </Card>
            </div>

            {generatedText && (
              <Card className="bg-slate-900/50 border-orange-500/30 p-6">
                <p className="text-slate-300 text-center text-lg italic">
                  "{generatedText}"
                </p>
              </Card>
            )}

            {/* Rating System */}
            <Card className="bg-slate-900/50 border-orange-500/30 p-6">
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold text-white">
                  {hasRated ? "Obrigado pelo feedback!" : "Como ficou sua transformação?"}
                </h3>
                <p className="text-slate-400">
                  {hasRated ? "Sua avaliação nos ajuda a melhorar!" : "Avalie a qualidade da imagem gerada"}
                </p>
                <div className="flex justify-center">
                  <StarRating onRate={handleRate} disabled={hasRated} />
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDownload}
                size="lg"
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
              >
                Baixar imagem
              </Button>
              <Button
                onClick={() => handleShare(generatedText || "Veja minha transformação!")}
                size="lg"
                variant="outline"
                className="flex-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                Compartilhar
              </Button>
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Nova transformação
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
