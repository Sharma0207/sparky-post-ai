import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Facebook, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

interface SocialMediaPopupProps {
  platform: string;
  onClose: () => void;
  onAuthenticated: (accessToken: string) => void;
}

export const SocialMediaPopup = ({ platform, onClose, onAuthenticated }: SocialMediaPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined;

  useEffect(() => {
    if (platform !== "facebook") return;

    // If no App ID configured, nothing to load
    if (!appId) return;

    // If SDK already present, mark loaded
    if (window.FB) {
      setSdkLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      if (!window.FB) return;
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
      setSdkLoaded(true);
    };

    if (document.getElementById("facebook-jssdk")) return;

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, [platform, appId]);

  const handleConnect = async () => {
    if (platform !== "facebook") return;

    if (!appId) {
      toast({
        title: "Facebook not configured",
        description: "Set VITE_FACEBOOK_APP_ID to enable Facebook connect.",
        variant: "destructive",
      });
      return;
    }

    if (!sdkLoaded) {
      setError("Facebook SDK is still loading. Please wait a moment.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      window.FB.login(
        (response: any) => {
          setIsLoading(false);
          if (response?.authResponse) {
            const accessToken = response.authResponse.accessToken;
            onAuthenticated(accessToken);
            onClose();
            toast({ title: "Successfully Connected!", description: "Your Facebook account is now connected." });
          } else {
            setError("Failed to connect to Facebook. Please try again.");
          }
        },
        { scope: "public_profile,email,pages_manage_posts,publish_to_groups", return_scopes: true }
      );
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred while connecting to Facebook.");
      console.error("Facebook login error:", err);
    }
  };

  const handleManualToken = () => {
    const token = prompt("Enter your Facebook Access Token:");
    if (token && token.trim()) {
      onAuthenticated(token.trim());
      onClose();
      toast({ title: "Token Added!", description: "Using manual access token for posting." });
    }
  };

  const fbDisabled = platform === "facebook" && !appId;

  return (
    <div className="relative max-w-md mx-auto p-4">
      <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>

      <div className="text-center mb-6">
        <Facebook className="h-12 w-12 text-[#1877F2] mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Connect Facebook</h3>
        <p className="text-muted-foreground">Connect your Facebook account to post directly from the app</p>
      </div>

      {fbDisabled && (
        <p className="mb-2 text-sm text-muted-foreground">Facebook App ID is not set. Configure VITE_FACEBOOK_APP_ID to continue.</p>
      )}

      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button onClick={handleConnect} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white" disabled={isLoading || !sdkLoaded || fbDisabled}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Facebook className="mr-2 h-4 w-4" />
              Connect with Facebook
            </>
          )}
        </Button>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">or</span>
        </div>

        <Button onClick={handleManualToken} variant="outline" className="w-full">
          Use Access Token
        </Button>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">Required Permissions:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Public Profile</li>
          <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Email</li>
          <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Manage Pages</li>
          <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-500 mr-2" />Publish Posts</li>
        </ul>
      </div>
    </div>
  );
};
