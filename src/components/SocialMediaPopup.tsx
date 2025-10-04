import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface SocialMediaPopupProps {
  platform: string;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const SocialMediaPopup = ({
  platform,
  onClose,
  onAuthenticated,
}: SocialMediaPopupProps) => {
  useEffect(() => {
    if (platform === "facebook") {
      // Load Facebook SDK
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "YOUR_FACEBOOK_APP_ID", // User needs to replace this
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
      };

      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, [platform]);

  const handleConnect = () => {
    if (platform === "facebook") {
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            onAuthenticated();
            onClose();
          }
        },
        { scope: "public_profile,email,pages_manage_posts" }
      );
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <h3 className="text-xl font-bold mb-4 capitalize">Connect {platform}</h3>
      <p className="mb-4 text-muted-foreground">
        Connect your {platform} account to start posting
      </p>
      <Button onClick={handleConnect} className="w-full">
        Connect {platform}
      </Button>
    </div>
  );
};
