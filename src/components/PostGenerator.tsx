import { useState } from "react";
import { PromptInput } from "./PromptInput";
import { GeneratedPost } from "./GeneratedPost";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GeneratedVersion {
  caption: string;
  hashtags: string[];
  imageUrl: string;
}

export const PostGenerator = () => {
  const [versions, setVersions] = useState<GeneratedVersion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setVersions([]);
    setSelectedIndex(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-post", {
        body: { prompt },
      });

      if (error) throw error;

      setVersions(data.versions);
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

  const handlePostToFacebook = async () => {
    if (selectedIndex === null) return;

    const selectedPost = versions[selectedIndex];
    
    toast({
      title: "Posting to Facebook...",
      description: "Opening Facebook to share your post.",
    });

    // Create Facebook share URL with pre-filled text
    const text = `${selectedPost.caption}\n\n${selectedPost.hashtags.join(" ")}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      selectedPost.imageUrl
    )}&quote=${encodeURIComponent(text)}`;

    window.open(fbShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="space-y-12">
      <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-lg text-muted-foreground animate-pulse-slow">
            Creating amazing posts for you...
          </p>
        </div>
      )}

      {versions.length > 0 && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Choose Your Favorite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {versions.map((version, index) => (
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
    </div>
  );
};
