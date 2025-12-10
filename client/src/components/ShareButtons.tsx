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

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    tiktok: `https://www.tiktok.com/share?url=${encodedUrl}`,
    instagram: `https://www.instagram.com/`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    email: `mailto:?subject=Veja minha transformação no ESPELHO AI!&body=${encodedText}`,
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        onClick={() => window.open(shareLinks.whatsapp, "_blank")}
        className="bg-green-500 hover:bg-green-600 text-white gap-2 text-xs"
        size="sm"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </Button>

      <Button
        onClick={() => window.open(shareLinks.telegram, "_blank")}
        className="bg-blue-500 hover:bg-blue-600 text-white gap-2 text-xs"
        size="sm"
      >
        <Send className="w-4 h-4" />
        Telegram
      </Button>

      <Button
        onClick={() => window.open(shareLinks.twitter, "_blank")}
        className="bg-sky-500 hover:bg-sky-600 text-white gap-2 text-xs"
        size="sm"
      >
        <Share2 className="w-4 h-4" />
        Twitter
      </Button>

      <Button
        onClick={() => window.open(shareLinks.facebook, "_blank")}
        className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-xs"
        size="sm"
      >
        <Facebook className="w-4 h-4" />
        Facebook
      </Button>

      <Button
        onClick={() => window.open(shareLinks.tiktok, "_blank")}
        className="bg-black hover:bg-gray-800 text-white gap-2 text-xs"
        size="sm"
      >
        <span className="text-lg">🎵</span>
        TikTok
      </Button>

      <Button
        onClick={() => window.open(shareLinks.instagram, "_blank")}
        className="bg-pink-500 hover:bg-pink-600 text-white gap-2 text-xs"
        size="sm"
      >
        <span className="text-lg">📷</span>
        Instagram
      </Button>

      <Button
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs"
        size="sm"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn
      </Button>

      <Button
        onClick={() => window.open(shareLinks.pinterest, "_blank")}
        className="bg-red-600 hover:bg-red-700 text-white gap-2 text-xs"
        size="sm"
      >
        <Heart className="w-4 h-4" />
        Pinterest
      </Button>

      <Button
        onClick={() => window.open(shareLinks.reddit, "_blank")}
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2 text-xs"
        size="sm"
      >
        <Users className="w-4 h-4" />
        Reddit
      </Button>

      <Button
        onClick={() => window.open(shareLinks.email, "_blank")}
        className="bg-gray-600 hover:bg-gray-700 text-white gap-2 text-xs"
        size="sm"
      >
        <span className="text-lg">✉️</span>
        Email
      </Button>
    </div>
  );
}
