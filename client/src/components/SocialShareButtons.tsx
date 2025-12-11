import React from 'react';
import { Instagram, Share2, MessageCircle, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  transformationId: number;
  imageUrl: string;
  title?: string;
}

export default function SocialShareButtons({ transformationId, imageUrl, title = "Veja minha transformação!" }: SocialShareButtonsProps) {
  const shareUrl = `${window.location.origin}/share/${transformationId}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    instagram: () => {
      // Instagram doesn't support direct sharing via URL, so we copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado! Cole no Instagram Stories ou Direct.');
    },
    tiktok: () => {
      window.open(`https://www.tiktok.com/`, '_blank');
      toast.info('Compartilhe seu link no TikTok!');
    },
    twitter: () => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      window.open(twitterUrl, '_blank', 'width=600,height=400');
    },
    facebook: () => {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      window.open(facebookUrl, '_blank', 'width=600,height=400');
    },
    whatsapp: () => {
      const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      window.open(whatsappUrl, '_blank');
    },
    telegram: () => {
      const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
      window.open(telegramUrl, '_blank');
    },
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        onClick={shareLinks.instagram}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        title="Compartilhar no Instagram"
      >
        <Instagram className="w-4 h-4" />
        <span className="hidden sm:inline">Instagram</span>
      </Button>

      <Button
        onClick={shareLinks.tiktok}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        title="Compartilhar no TikTok"
      >
        <Music className="w-4 h-4" />
        <span className="hidden sm:inline">TikTok</span>
      </Button>

      <Button
        onClick={shareLinks.twitter}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        title="Compartilhar no Twitter"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>

      <Button
        onClick={shareLinks.facebook}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        title="Compartilhar no Facebook"
      >
        <Heart className="w-4 h-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        onClick={shareLinks.whatsapp}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        title="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Button>

      <Button
        onClick={shareLinks.telegram}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        title="Compartilhar no Telegram"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Telegram</span>
      </Button>
    </div>
  );
}

// Icon placeholder for TikTok
function Music(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18V5m6 13V2" />
    </svg>
  );
}
