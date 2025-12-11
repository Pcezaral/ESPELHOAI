import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, Gift, Zap, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptAfterTransformationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallPromptAfterTransformation({
  isOpen,
  onClose,
}: InstallPromptAfterTransformationProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");
  const recordPwaInstallMutation = trpc.credits.recordPwaInstall.useMutation();

  useEffect(() => {
    // Detectar plataforma
    const ua = navigator.userAgent.toLowerCase();
    let detectedPlatform: "android" | "ios" | "desktop" = "desktop";

    if (/android/.test(ua)) {
      detectedPlatform = "android";
    } else if (/iphone|ipad|ipot/.test(ua)) {
      detectedPlatform = "ios";
    }

    setPlatform(detectedPlatform);

    // Listener para beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("Instalação não disponível neste momento");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        toast.success("✅ App instalado com sucesso! 🎉");
        recordPwaInstallMutation.mutate(
          {
            platform: platform,
            userAgent: navigator.userAgent,
          },
          {
            onSuccess: (result) => {
              if (result?.success) {
                toast.success(`🎁 Você ganhou ${result.creditsAwarded} créditos extras! 🚀`);
              }
            },
          }
        );
      }

      setDeferredPrompt(null);
      onClose();
    } catch (error) {
      console.error("Install error:", error);
      toast.error("Erro ao instalar o app");
    }
  };

  const handleIOSInstall = () => {
    toast.info(
      "📱 No iOS, toque em Compartilhar → Adicionar à Tela Inicial para instalar",
      { duration: 5000 }
    );
    onClose();
  };

  const handleDesktopInstall = async () => {
    if (deferredPrompt) {
      await handleInstallClick();
    } else {
      toast.info(
        "💻 Clique nos 3 pontinhos do navegador → Instalar app ou Adicionar à tela inicial",
        { duration: 5000 }
      );
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 border-0 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader className="text-center space-y-4">
          {/* Animated Gift Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
              <Gift className="w-16 h-16 text-white relative z-10 animate-bounce" />
            </div>
          </div>

          <DialogTitle className="text-3xl font-bold text-white text-center">
            🎁 Ganhe 5 Fotos Grátis!
          </DialogTitle>

          <DialogDescription className="text-white/90 text-center text-lg">
            Instale nosso app e ganhe 5 transformações extras para usar quando quiser
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 py-6">
          {/* Highlight Box */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-200" />
              <span className="text-white font-bold text-xl">5 Fotos Grátis</span>
              <Sparkles className="w-6 h-6 text-yellow-200" />
            </div>
            <p className="text-white/80 text-center text-sm">
              Transforme mais fotos em seus estilos favoritos
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Acesso rápido sem barras de navegador</span>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Funciona offline quando instalado</span>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Ganhe 5 fotos grátis agora</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            {platform === "ios" ? (
              <Button
                onClick={handleIOSInstall}
                className="w-full bg-white text-orange-600 hover:bg-orange-50 text-lg h-14 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                Ver Instruções
              </Button>
            ) : (
              <Button
                onClick={platform === "android" ? handleInstallClick : handleDesktopInstall}
                className="w-full bg-white text-orange-600 hover:bg-orange-50 text-lg h-14 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                Instalar Agora - Ganhe 5 Fotos!
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-2 border-white text-white hover:bg-white/10 text-lg h-12 font-semibold rounded-xl"
            >
              Talvez Depois
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/70 text-center">
            ✨ Oferta válida para novos usuários que instalarem o app
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
