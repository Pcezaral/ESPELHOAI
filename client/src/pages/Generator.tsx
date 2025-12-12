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
import { InstallPromptAfterTransformation } from "@/components/InstallPromptAfterTransformation";
import { GenderRefineFilter } from "@/components/GenderRefineFilter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useRef, useState, useEffect } from "react";

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
  
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [hasShownInstallPrompt, setHasShownInstallPrompt] = useState(false);
  const [showGenderRefine, setShowGenderRefine] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  
  const [step, setStep] = useState<"theme" | "upload" | "processing" | "result">("theme");

  const generateMutation = trpc.generation.generate.useMutation();
  const uploadMutation = trpc.generation.uploadImage.useMutation();
  const ratingMutation = trpc.rating.submit.useMutation();

  useEffect(() => {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const themeFromUrl = searchParams.get('theme') as Theme | null;
    
    if (themeFromUrl) {
      setSelectedTheme(themeFromUrl);
      setStep("upload");
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && !user) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setStep("upload");
    setLocation(`/generator?theme=${theme}`);
    window.history.pushState({}, '', `/generator?theme=${theme}`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
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
    if (!selectedTheme || !previewUrl) return;

    try {
      setStep("processing");
      const result = await generateMutation.mutateAsync({
        theme: selectedTheme,
        imageUrl: previewUrl,
      });
      
      setGeneratedImage(result.generatedImageUrl);
      setGeneratedText(result.generatedText);
      setStep("result");

      if (!hasShownInstallPrompt && typeof window !== 'undefined' && 'BeforeInstallPromptEvent' in window) {
        setShowInstallPrompt(true);
        setHasShownInstallPrompt(true);
      }
    } catch (error) {
      console.error('Erro ao gerar:', error);
      toast.error("Erro ao gerar transformação");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setSelectedTheme(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    setGeneratedImage(null);
    setGeneratedText(null);
    setHasRated(false);
    setShowInstallPrompt(false);
    setHasShownInstallPrompt(false);
    setShowGenderRefine(false);
    setIsRefining(false);
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

  const handleRefineGender = async (genderStyle: "feminine" | "masculine" | "neutral") => {
    if (!previewUrl || !selectedTheme) return;
    setIsRefining(true);
    try {
      const result = await generateMutation.mutateAsync({
        theme: selectedTheme,
        imageUrl: previewUrl,
      });
      setGeneratedImage(result.generatedImageUrl);
      setGeneratedText(result.generatedText);
      setHasRated(false);
      setShowGenderRefine(false);
      toast.success("Transformação refinada!");
    } catch (error) {
      toast.error("Erro ao refinar");
    } finally {
      setIsRefining(false);
    }
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
    
    const url = `https://descubraeu-ipcsmflf.manus.space?ref=share`;
    if (navigator.share) {
      navigator.share({ title: "ESPELHO AI", text, url });
    } else {
      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/?text=${url}`, "_blank");
    }
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
            <h1 className="text-xl font-bold text-white">
              ESPELHO <span className="text-orange-500">AI</span>
            </h1>
          </div>
          <CreditBadge />
        </div>
      </header>

      <main className="container py-12 relative z-10">

        {step === "theme" && (
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem'} as React.CSSProperties}>
            <div style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem'} as React.CSSProperties}>
              <h2 style={{fontSize: '2.25rem', fontWeight: 'bold', color: 'white'} as React.CSSProperties}>Escolha um estilo</h2>
              <p style={{color: '#cbd5e1', fontSize: '1.125rem'} as React.CSSProperties}>Selecione como você quer se transformar</p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%'}}>
              {THEMES.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  style={{
                    cursor: 'pointer',
                    border: '2px solid #334155',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    minHeight: '280px',
                    transition: 'all 0.3s ease'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#ea580c';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#334155';
                  }}
                >
                  <div style={{fontSize: '3rem', textAlign: 'center'} as React.CSSProperties}>{theme.emoji}</div>
                  <div style={{flex: 1} as React.CSSProperties}>
                    <h3 style={{fontSize: '1.125rem', fontWeight: 'bold', color: 'white', textAlign: 'center'} as React.CSSProperties}>{theme.name}</h3>
                    <p style={{fontSize: '0.875rem', color: '#cbd5e1', textAlign: 'center', marginTop: '0.5rem'} as React.CSSProperties}>{theme.description}</p>
                  </div>
                  <button
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#ea580c',
                      color: 'white',
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    } as React.CSSProperties}
                  >
                    Transforme
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border border-slate-700">
                  <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-96 object-cover" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setPreviewUrl(null)} variant="outline" className="flex-1 border-slate-700 text-white hover:bg-slate-800">
                    Mudar Foto
                  </Button>
                  <Button onClick={handleGenerate} disabled={generateMutation.isPending} className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    {generateMutation.isPending ? "Gerando..." : "Gerar Transformação"}
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

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center min-h-96 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            <p className="text-white text-lg">Gerando sua transformação...</p>
          </div>
        )}

        {step === "result" && generatedImage && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <img src={generatedImage} alt="Resultado" className="w-full h-auto" />
            </div>

            {/* Gender refine filter removed */}

            {!hasRated && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-white font-semibold">Como você avalia essa transformação?</h3>
                <StarRating onRate={handleRate} />
              </div>
            )}

            <div className="space-y-4">
              <Button onClick={handleDownload} className="w-full gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Download className="w-4 h-4" />
                Baixar Imagem
              </Button>
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
              Fazer Outra Transformação
            </Button>
          </div>
        )}
      </main>

      {showInstallPrompt && <InstallPromptAfterTransformation isOpen={showInstallPrompt} onClose={() => setShowInstallPrompt(false)} />}
    </div>
  );
}
