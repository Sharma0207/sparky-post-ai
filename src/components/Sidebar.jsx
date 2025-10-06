import { Facebook, Instagram, Linkedin, History, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Sidebar = ({ onConnectPlatform }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-card shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-20 bg-card shadow-card p-4 z-40 border-r border-border">
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

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-64 bg-card shadow-card p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Connect Platforms</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  onConnectPlatform('facebook');
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start text-blue-500 hover:text-blue-400 hover:bg-secondary"
              >
                <Facebook className="h-5 w-5 mr-3" />
                Connect Facebook
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onConnectPlatform('instagram');
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start text-pink-500 hover:text-pink-400 hover:bg-secondary"
              >
                <Instagram className="h-5 w-5 mr-3" />
                Connect Instagram
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onConnectPlatform('linkedin');
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start text-blue-600 hover:text-blue-500 hover:bg-secondary"
              >
                <Linkedin className="h-5 w-5 mr-3" />
                Connect LinkedIn
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <History className="h-5 w-5 mr-3" />
                History
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
