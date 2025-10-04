import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { SocialMediaPopup } from "./SocialMediaPopup";
import { GeneratedPost } from "./GeneratedPost";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GeneratedVersion {
  caption: string;
  hashtags: string[];
  imageUrl: string;
}

export const Dashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [prompt, setPrompt] = useState("");
  const [generatedContents, setGeneratedContents] = useState<GeneratedVersion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setIsPopupOpen(true);
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to generate posts.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedContents([]);
    setSelectedIndex(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-post", {
        body: { prompt },
      });

      if (error) throw error;

      setGeneratedContents(data.versions);
      toast({
        title: "Posts Generated!",
        description: "3 unique versions are ready for you.",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostToFacebook = () => {
    if (selectedIndex === null) return;

    const selectedPost = generatedContents[selectedIndex];
    toast({
      title: "Posting to Facebook...",
      description: "Opening Facebook to share your post.",
    });

    const text = `${selectedPost.caption}\n\n${selectedPost.hashtags.join(" ")}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      selectedPost.imageUrl
    )}&quote=${encodeURIComponent(text)}`;

    window.open(fbShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onConnectPlatform={handleConnectPlatform} />

      <div className="flex-1 flex flex-col p-6 ml-20">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Social Media Manager Dashboard
        </h1>

        {isAuthenticated && (
          <div className="mb-4 text-center">
            <p className="text-green-500">✓ Connected to Facebook</p>
          </div>
        )}

        {generatedContents.length > 0 && !isLoading && (
          <div className="mb-6 p-6 bg-card rounded-lg shadow-card border border-border">
            <h2 className="text-xl font-bold mb-4">Generated Post Previews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedContents.map((version, index) => (
                <GeneratedPost
                  key={index}
                  caption={version.caption}
                  hashtags={version.hashtags}
                  imageUrl={version.imageUrl}
                  isSelected={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                  onPostToFacebook={handlePostToFacebook}
                />
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-lg text-muted-foreground animate-pulse">
              Creating amazing posts for you...
            </p>
          </div>
        )}

        <div className="flex-1" />

        <div className="p-6 bg-card rounded-lg shadow-card border border-border max-w-4xl mx-auto w-full">
          <div className="flex items-end gap-3">
            <Textarea
              className="flex-1 min-h-[100px] resize-none bg-background border-border"
              placeholder="Enter your prompt (e.g., 'Generate a happy Diwali post with diyas')..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handlePromptSubmit();
                }
              }}
            />
            <Button
              onClick={handlePromptSubmit}
              disabled={isLoading || !prompt.trim()}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-card p-6 rounded-lg shadow-card border border-border max-w-md w-full">
            <SocialMediaPopup
              platform={selectedPlatform}
              onClose={() => setIsPopupOpen(false)}
              onAuthenticated={() => setIsAuthenticated(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
