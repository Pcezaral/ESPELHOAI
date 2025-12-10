import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadButtons() {
  const handleDownloadWindows = () => {
    // Placeholder: Será substituído por link real de download
    window.open("https://download.example.com/espelho-ai-windows.exe", "_blank");
  };

  const handleDownloadMac = () => {
    // Placeholder: Será substituído por link real de download
    window.open("https://download.example.com/espelho-ai-mac.dmg", "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Windows Download */}
      <Button
        onClick={handleDownloadWindows}
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-base h-12 px-6 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 min-w-fit"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
        </svg>
        Download Windows
      </Button>

      {/* macOS Download */}
      <Button
        onClick={handleDownloadMac}
        className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white text-base h-12 px-6 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2 min-w-fit"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 13.5c-.91 0-1.82-.67-2.69-1.98.91-1.31 1.78-2.68 2.69-2.68 1.24 0 2.25 1.01 2.25 2.25s-1.01 2.41-2.25 2.41zm-4.3-5.5c-1.59 0-2.8-1.21-2.8-2.8S11.16 2.4 12.75 2.4s2.8 1.21 2.8 2.8-1.21 2.8-2.8 2.8zm7.45 1.9c-1.59 0-2.8-1.21-2.8-2.8s1.21-2.8 2.8-2.8 2.8 1.21 2.8 2.8-1.21 2.8-2.8 2.8zm-11.2 0c-1.59 0-2.8-1.21-2.8-2.8s1.21-2.8 2.8-2.8 2.8 1.21 2.8 2.8-1.21 2.8-2.8 2.8zm5.6 8.4c-3.35 0-6.3-2.95-6.3-6.3 0-1.59.67-3.18 1.81-4.29.91.67 2.02 1.01 3.18 1.01 1.24 0 2.35-.34 3.26-1.01 1.14 1.11 1.81 2.7 1.81 4.29 0 3.35-2.95 6.3-6.3 6.3z" />
        </svg>
        Download macOS
      </Button>

      {/* Info Text */}
      <div className="text-sm text-gray-500 text-center sm:text-left">
        <p>Disponível para Windows 10+ e macOS 10.13+</p>
      </div>
    </div>
  );
}
