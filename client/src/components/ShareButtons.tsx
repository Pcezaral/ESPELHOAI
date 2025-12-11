import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Share2, Facebook, Heart, Linkedin, BookOpen, Users } from "lucide-react";

interface ShareButtonsProps {
  message: string;
  imageUrl?: string;
  theme?: string;
}

export function ShareButtons({ message, imageUrl, theme }: ShareButtonsProps) {
  const appUrl = "https://descubraeu-ipcsmflf.manus.space?ref=share";
  const fullText = `${message}\n\nDescubra seu verdadeiro eu!\n${appUrl}`;
  const encodedText = encodeURIComponent(fullText);
  const encodedUrl = encodeURIComponent(appUrl);

  // Função genérica para compartilhar com imagem usando Web Share API
  const handleShareWithImage = async (title: string, text: string) => {
    if (!imageUrl) {
      return false;
    }

    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "transformacao.jpg", { type: "image/jpeg" });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text,
            files: [file],
          });
          return true;
        }
      } catch (error) {
        console.log("Web Share API não disponível para esta rede");
      }
    }
    return false;
  };

  // WhatsApp com suporte a imagem
  const handleWhatsAppShare = async () => {
    if (await handleShareWithImage("Minha transformação no ESPELHO AI", message)) {
      return;
    }

    // Fallback: link com instruções
    const fallbackText = `${message}\n\n📸 Clique no link abaixo para ver minha transformação:\n${appUrl}\n\nDescubra seu verdadeiro eu!`;
    const encodedFallback = encodeURIComponent(fallbackText);
    window.open(`https://wa.me/?text=${encodedFallback}`, "_blank");
  };

  // Telegram com suporte a imagem
  const handleTelegramShare = async () => {
    if (await handleShareWithImage("Minha transformação no ESPELHO AI", message)) {
      return;
    }

    // Fallback: link padrão
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank");
  };

  // Twitter com suporte a imagem
  const handleTwitterShare = async () => {
    if (await handleShareWithImage("Veja minha transformação no ESPELHO AI", message)) {
      return;
    }

    // Fallback: link padrão
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank");
  };

  // Facebook com suporte a imagem
  const handleFacebookShare = async () => {
    if (await handleShareWithImage("Minha transformação no ESPELHO AI", message)) {
      return;
    }

    // Fallback: link padrão
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
  };

  // LinkedIn com suporte a imagem
  const handleLinkedInShare = async () => {
    if (await handleShareWithImage("Minha transformação no ESPELHO AI", message)) {
      return;
    }

    // Fallback: link padrão
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank");
  };

  // Pinterest com suporte a imagem
  const handlePinterestShare = async () => {
    if (await handleShareWithImage("Minha transformação no ESPELHO AI", message)) {
      return;
    }

    // Fallback: link padrão
    window.open(`https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`, "_blank");
  };

  // Email com suporte a imagem
  const handleEmailShare = async () => {
    if (await handleShareWithImage("Minha transformação no ESPELHO AI", message)) {
      return;
    }

    // Fallback: link padrão
    window.open(`mailto:?subject=Veja minha transformação no ESPELHO AI!&body=${encodedText}`, "_blank");
  };

  const shareLinks = {
    tiktok: `https://www.tiktok.com/share?url=${encodedUrl}`,
    instagram: `https://www.instagram.com/`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        onClick={handleWhatsAppShare}
        className="bg-green-500 hover:bg-green-600 text-white gap-2 text-xs"
        size="sm"
        title={imageUrl ? "Compartilhar com imagem" : "Compartilhar com link"}
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </Button>

      <Button
        onClick={handleTelegramShare}
        className="bg-blue-500 hover:bg-blue-600 text-white gap-2 text-xs"
        size="sm"
        title={imageUrl ? "Compartilhar com imagem" : "Compartilhar com link"}
      >
        <Send className="w-4 h-4" />
        Telegram
      </Button>

      <Button
        onClick={handleTwitterShare}
        className="bg-sky-500 hover:bg-sky-600 text-white gap-2 text-xs"
        size="sm"
        title={imageUrl ? "Compartilhar com imagem" : "Compartilhar com link"}
      >
        <Share2 className="w-4 h-4" />
        Twitter
      </Button>

      <Button
        onClick={handleFacebookShare}
        className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-xs"
        size="sm"
        title={imageUrl ? "Compartilhar com imagem" : "Compartilhar com link"}
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </Button>

      <Button
        onClick={() => window.open(shareLinks.tiktok, "_blank")}
        className="bg-black hover:bg-gray-800 text-white gap-2 text-xs"
        size="sm"
        title="Compartilhar no TikTok"
      >
        <span className="text-lg">🎵</span>
        TikTok
      </Button>

      <Button
        onClick={() => window.open(shareLinks.instagram, "_blank")}
        className="bg-pink-500 hover:bg-pink-600 text-white gap-2 text-xs"
        size="sm"
        title="Compartilhar no Instagram"
      >
        <span className="text-lg">📷</span>
        Instagram
      </Button>

      <Button
        onClick={handleLinkedInShare}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs"
        size="sm"
        title={imageUrl ? "Compartilhar com imagem" : "Compartilhar com link"}
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </Button>

      <Button
        onClick={handlePinterestShare}
        className="bg-red-600 hover:bg-red-700 text-white gap-2 text-xs"
        size="sm"
        title={imageUrl ? "Compartilhar com imagem" : "Compartilhar com link"}
      >
        <Heart className="w-4 h-4" />
        Pinterest
      </Button>

      <Button
        onClick={() => window.open(shareLinks.reddit, "_blank")}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2 text-xs"
        size="sm"
        title="Compartilhar no Reddit"
      >
        <Users className="w-4 h-4" />
        Reddit
      </Button>

      <Button
        onClick={handleEmailShare}
        className="bg-gray-600 hover:bg-gray-700 text-white gap-2 text-xs"
        size="sm"
        title={imageUrl ? "Enviar com imagem" : "Enviar com link"}
      >
        <span className="text-lg">✉️</span>
        Email
      </Button>
    </div>
  );
}
