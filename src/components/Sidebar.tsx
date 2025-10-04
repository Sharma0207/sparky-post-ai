import { Facebook, Instagram, Linkedin, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onConnectPlatform: (platform: string) => void;
}

export const Sidebar = ({ onConnectPlatform }: SidebarProps) => {
  return (
    <div className="fixed top-0 left-0 h-full w-20 bg-card shadow-card p-4 z-50 border-r border-border">
      <h2 className="text-sm font-bold mb-6 text-foreground text-center">Connect</h2>
      <nav className="flex flex-col items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onConnectPlatform('facebook')}
          className="text-blue-500 hover:text-blue-400 hover:bg-secondary"
          title="Connect Facebook"
        >
          <Facebook className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onConnectPlatform('instagram')}
          className="text-pink-500 hover:text-pink-400 hover:bg-secondary"
          title="Connect Instagram"
        >
          <Instagram className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onConnectPlatform('linkedin')}
          className="text-blue-600 hover:text-blue-500 hover:bg-secondary"
          title="Connect LinkedIn"
        >
          <Linkedin className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          title="History"
        >
          <History className="h-6 w-6" />
        </Button>
      </nav>
    </div>
  );
};
