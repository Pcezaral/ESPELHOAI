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
  const createShareMessage = () => {
    if (imageUrl) {
      return `${message}\n\n🖼️ Veja minha transformação:\n${imageUrl}\n\n✨ Crie a sua também:\n${appUrl}`;
    }
    return `${message}\n\nDescubra seu verdadeiro eu!\n${appUrl}`;
  };

  const shareMessage = createShareMessage();
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(appUrl);
  const encodedImageUrl = encodeURIComponent(imageUrl || '');

  // WhatsApp - enviar com link da imagem
  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    toast.success("Abrindo WhatsApp...");
  };

  // Telegram - enviar com link da imagem
  const handleTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`, "_blank");
    toast.success("Abrindo Telegram...");
  };

  // Twitter - enviar com link da imagem
  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, "_blank");
    toast.success("Abrindo Twitter...");
  };

  // Facebook - enviar com link da imagem
  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`, "_blank");
    toast.success("Abrindo Facebook...");
  };

  // LinkedIn - enviar com link da imagem
  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedMessage}`, "_blank");
    toast.success("Abrindo LinkedIn...");
  };

  // Pinterest - enviar com link da imagem E media
  const handlePinterestShare = () => {
    // Pinterest suporta parâmetro media para a imagem
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedMessage}&media=${encodedImageUrl}`;
    window.open(pinterestUrl, "_blank");
    toast.success("Abrindo Pinterest...");
  };

  // Email - enviar com link da imagem
  const handleEmailShare = () => {
    const subject = encodeURIComponent("Veja minha transformação no ESPELHO AI!");
    window.open(`mailto:?subject=${subject}&body=${encodedMessage}`, "_blank");
    toast.success("Abrindo Email...");
  };

  // TikTok - enviar com link da imagem
  const handleTikTokShare = () => {
    // TikTok não tem API de compartilhamento direto, mas podemos enviar com mensagem
    window.open(`https://www.tiktok.com/share?url=${encodedUrl}`, "_blank");
    toast.success("Abrindo TikTok...");
  };

  // Instagram - copiar link com imagem para clipboard
  const handleInstagramShare = () => {
    const textToCopy = shareMessage;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Link copiado! Cole no Instagram Stories ou Direct");
    }).catch(() => {
      toast.error("Erro ao copiar link");
    });
  };

  // Reddit - enviar com link da imagem
  const handleRedditShare = () => {
    window.open(`https://reddit.com/submit?url=${encodedUrl}&title=${encodedMessage}`, "_blank");
    toast.success("Abrindo Reddit...");
  };

  // Messenger (Facebook Messenger) - enviar com link da imagem
  const handleMessengerShare = () => {
    window.open(`https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodedUrl}&redirect_uri=${encodedUrl}`, "_blank");
    toast.success("Abrindo Messenger...");
  };

  // Viber - enviar com link da imagem
  const handleViberShare = () => {
    window.open(`viber://forward?text=${encodedMessage}`, "_blank");
    toast.success("Abrindo Viber...");
  };

  // Signal - enviar com link da imagem
  const handleSignalShare = () => {
    window.open(`https://signal.me/#p/${encodedMessage}`, "_blank");
    toast.success("Abrindo Signal...");
  };

  // Snapchat - enviar com link da imagem
  const handleSnapchatShare = () => {
    window.open(`https://www.snapchat.com/add/${encodeURIComponent('espelho-ai')}`, "_blank");
    toast.success("Abrindo Snapchat...");
  };

  // WhatsApp Business (se disponível)
  const handleWhatsAppBusinessShare = () => {
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    toast.success("Abrindo WhatsApp Business...");
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {/* WhatsApp */}
      <Button
        onClick={handleWhatsAppShare}
        className="bg-green-500 hover:bg-green-600 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </Button>

      {/* Telegram */}
      <Button
        onClick={handleTelegramShare}
        className="bg-blue-500 hover:bg-blue-600 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Send className="w-4 h-4" />
        Telegram
      </Button>

      {/* Twitter */}
      <Button
        onClick={handleTwitterShare}
        className="bg-sky-500 hover:bg-sky-600 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Share2 className="w-4 h-4" />
        Twitter
      </Button>

      {/* Facebook */}
      <Button
        onClick={handleFacebookShare}
        className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </Button>

      {/* TikTok */}
      <Button
        onClick={handleTikTokShare}
        className="bg-black hover:bg-gray-800 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <span className="text-lg">🎵</span>
        TikTok
      </Button>

      {/* Instagram */}
      <Button
        onClick={handleInstagramShare}
        className="bg-pink-500 hover:bg-pink-600 text-white gap-2 text-xs"
        size="sm"
        title="Copiar link com imagem"
      >
        <span className="text-lg">📷</span>
        Instagram
      </Button>

      {/* LinkedIn */}
      <Button
        onClick={handleLinkedInShare}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </Button>

      {/* Pinterest */}
      <Button
        onClick={handlePinterestShare}
        className="bg-red-600 hover:bg-red-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Heart className="w-4 h-4" />
        Pinterest
      </Button>

      {/* Reddit */}
      <Button
        onClick={handleRedditShare}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <Users className="w-4 h-4" />
        Reddit
      </Button>

      {/* Email */}
      <Button
        onClick={handleEmailShare}
        className="bg-gray-600 hover:bg-gray-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <span className="text-lg">✉️</span>
        Email
      </Button>

      {/* Viber */}
      <Button
        onClick={handleViberShare}
        className="bg-purple-600 hover:bg-purple-700 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <span className="text-lg">📱</span>
        Viber
      </Button>

      {/* Signal */}
      <Button
        onClick={handleSignalShare}
        className="bg-blue-400 hover:bg-blue-500 text-white gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <span className="text-lg">🔒</span>
        Signal
      </Button>

      {/* Snapchat */}
      <Button
        onClick={handleSnapchatShare}
        className="bg-yellow-400 hover:bg-yellow-500 text-black gap-2 text-xs"
        size="sm"
        title="Enviar com imagem"
      >
        <span className="text-lg">👻</span>
        Snapchat
      </Button>
    </div>
  );
}
