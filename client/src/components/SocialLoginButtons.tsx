import { Button } from "@/components/ui/button";
import { Instagram, Music, Twitter, Youtube } from "lucide-react";

interface SocialLoginButtonsProps {
  onInstagramClick?: () => void;
  onTiktokClick?: () => void;
  onTwitterClick?: () => void;
  onYoutubeClick?: () => void;
  loading?: boolean;
}

export function SocialLoginButtons({
  onInstagramClick,
  onTiktokClick,
  onTwitterClick,
  onYoutubeClick,
  loading = false,
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="text-center text-slate-400 text-sm mb-4">
        Ou conecte com suas redes sociais
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Instagram */}
        <Button
          onClick={onInstagramClick}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </Button>

        {/* TikTok */}
        <Button
          onClick={onTiktokClick}
          disabled={loading}
          className="bg-black hover:bg-gray-900 text-white gap-2"
        >
          <Music className="w-4 h-4" />
          TikTok
        </Button>

        {/* Twitter */}
        <Button
          onClick={onTwitterClick}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </Button>

        {/* YouTube */}
        <Button
          onClick={onYoutubeClick}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white gap-2"
        >
          <Youtube className="w-4 h-4" />
          YouTube
        </Button>
      </div>

      <div className="text-center text-xs text-slate-500 mt-4">
        Conectando suas redes sociais permite compartilhamento automático e acesso a recursos exclusivos
      </div>
    </div>
  );
}
