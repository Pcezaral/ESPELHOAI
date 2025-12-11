import { Download, Apple, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface DownloadAppBannerProps {
  showAfterShare?: boolean;
}

export function DownloadAppBanner({ showAfterShare = false }: DownloadAppBannerProps) {
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) {
      setPlatform("android");
    } else if (/iphone|ipad|ipot/.test(ua)) {
      setPlatform("ios");
    }
  }, []);

  const handleGooglePlayClick = () => {
    // Link para Google Play Store
    window.open("https://play.google.com/store/apps/details?id=com.descubraeu.app", "_blank");
  };

  const handleAppStoreClick = () => {
    // Link para App Store
    window.open("https://apps.apple.com/br/app/descubra-seu-verdadeiro-eu/id123456789", "_blank");
  };

  const handleInstallPWA = () => {
    // Trigger PWA install prompt
    const event = new Event("beforeinstallprompt");
    window.dispatchEvent(event);
  };

  return (
    <div className={`bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-lg p-6 text-white ${showAfterShare ? "mt-6" : "my-6"}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">📱 Baixe o App!</h3>
          <p className="text-sm opacity-90">Acesso rápido, offline, e ganhe créditos extras</p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {platform === "android" ? (
            <Button
              onClick={handleGooglePlayClick}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold gap-2"
              size="sm"
            >
              <Smartphone className="w-4 h-4" />
              Google Play
            </Button>
          ) : platform === "ios" ? (
            <Button
              onClick={handleAppStoreClick}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold gap-2"
              size="sm"
            >
              <Apple className="w-4 h-4" />
              App Store
            </Button>
          ) : (
            <>
              <Button
                onClick={handleGooglePlayClick}
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold gap-2 text-xs"
                size="sm"
              >
                <Smartphone className="w-4 h-4" />
                Play Store
              </Button>
              <Button
                onClick={handleAppStoreClick}
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold gap-2 text-xs"
                size="sm"
              >
                <Apple className="w-4 h-4" />
                App Store
              </Button>
            </>
          )}

          <Button
            onClick={handleInstallPWA}
            className="bg-white text-orange-600 hover:bg-orange-50 font-bold gap-2 text-xs"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Instalar
          </Button>
        </div>
      </div>
    </div>
  );
}
