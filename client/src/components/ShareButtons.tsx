import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Share2, Facebook, Heart, Linkedin, Users } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  message: string;
  imageUrl?: string;
  theme?: string;
}

export function ShareButtons({ message, imageUrl, theme }: ShareButtonsProps) {
  const appUrl = "https://descubraeu-ipcsmflf.manus.space?ref=share";
  
  // Criar mensagem com link da imagem
  const createShareMessage = (includeImage: boolean = false) => {
    if (includeImage && imageUrl) {
      // Mensagem com link direto da imagem
      return `${message}\n\n🖼️ Veja minha transformação:\n${imageUrl}\n\n✨ Crie a sua também:\n${appUrl}`;
    } else {
      // Mensagem apenas com link do app
      return `${message}\n\nDescubra seu verdadeiro eu!\n${appUrl}`;
    }
  };

  // WhatsApp - enviar com link da imagem
  const handleWhatsAppShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    toast.success("Abrindo WhatsApp...");
  };

  // Telegram - enviar com link da imagem
  const handleTelegramShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodedMessage}`, "_blank");
    toast.success("Abrindo Telegram...");
  };

  // Twitter - enviar com link da imagem
  const handleTwitterShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, "_blank");
    toast.success("Abrindo Twitter...");
  };

  // Facebook - enviar com link da imagem
  const handleFacebookShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodedMessage}`, "_blank");
    toast.success("Abrindo Facebook...");
  };

  // LinkedIn - enviar com link da imagem
  const handleLinkedInShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodedMessage}`, "_blank");
    toast.success("Abrindo LinkedIn...");
  };

  // Pinterest - enviar com link da imagem
  const handlePinterestShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(appUrl)}&description=${encodedMessage}&media=${encodeURIComponent(imageUrl || '')}`, "_blank");
    toast.success("Abrindo Pinterest...");
  };

  // Email - enviar com link da imagem
  const handleEmailShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`mailto:?subject=Veja minha transformação no ESPELHO AI!&body=${encodedMessage}`, "_blank");
    toast.success("Abrindo Email...");
  };

  // TikTok - apenas link
  const handleTikTokShare = () => {
    window.open(`https://www.tiktok.com/share?url=${encodeURIComponent(appUrl)}`, "_blank");
    toast.success("Abrindo TikTok...");
  };

  // Instagram - apenas link (não suporta compartilhamento direto)
  const handleInstagramShare = () => {
    toast.info("Copie o link e compartilhe no Instagram Stories ou Direct");
    navigator.clipboard.writeText(appUrl);
  };

  // Reddit - enviar com link da imagem
  const handleRedditShare = () => {
    const shareMessage = createShareMessage(true);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://reddit.com/submit?url=${encodeURIComponent(appUrl)}&title=${encodedMessage}`, "_blank");
    toast.success("Abrindo Reddit...");
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        onClick={handleWhatsAppShare}
        className="bg-green-500 hover:bg-green-600 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </Button>

      <Button
        onClick={handleTelegramShare}
        className="bg-blue-500 hover:bg-blue-600 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Send className="w-4 h-4" />
        Telegram
      </Button>

      <Button
        onClick={handleTwitterShare}
        className="bg-sky-500 hover:bg-sky-600 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Share2 className="w-4 h-4" />
        Twitter
      </Button>

      <Button
        onClick={handleFacebookShare}
        className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </Button>

      <Button
        onClick={handleTikTokShare}
        className="bg-black hover:bg-gray-800 text-white gap-2 text-xs"
        size="sm"
        title="Compartilhar no TikTok"
      >
        <span className="text-lg">🎵</span>
        TikTok
      </Button>

      <Button
        onClick={handleInstagramShare}
        className="bg-pink-500 hover:bg-pink-600 text-white gap-2 text-xs"
        size="sm"
        title="Copiar link para Instagram"
      >
        <span className="text-lg">📷</span>
        Instagram
      </Button>

      <Button
        onClick={handleLinkedInShare}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </Button>

      <Button
        onClick={handlePinterestShare}
        className="bg-red-600 hover:bg-red-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Heart className="w-4 h-4" />
        Pinterest
      </Button>

      <Button
        onClick={handleRedditShare}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Users className="w-4 h-4" />
        Reddit
      </Button>

      <Button
        onClick={handleEmailShare}
        className="bg-gray-600 hover:bg-gray-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <span className="text-lg">✉️</span>
        Email
      </Button>
    </div>
  );
}
