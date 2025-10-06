import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Facebook, Copy, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedPostProps {
  caption: string;
  hashtags: string[];
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
  onPostToFacebook: () => void;
}

export const GeneratedPost = ({
  caption,
  hashtags,
  imageUrl,
  isSelected,
  onSelect,
  onPostToFacebook,
}: GeneratedPostProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const handleCopyText = () => {
    const text = `${caption}\n\n${hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Post text copied to clipboard.",
    });
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sparky-post-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded!",
        description: "Image saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this AI-generated post!',
        text: caption,
        url: imageUrl,
      });
    } else {
      handleCopyText();
    }
  };

  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 group ${
        isSelected
          ? "border-primary shadow-lg ring-2 ring-primary/50"
          : "border-border shadow-md hover:border-primary/50 hover:shadow-lg"
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}

      {/* Image Section */}
      <div className="aspect-square bg-muted relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Loading image...</div>
            </div>
          </div>
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-center text-red-600">
              <div className="text-2xl mb-2">📷</div>
              <div className="text-sm">Image failed to load</div>
            </div>
          </div>
        )}
        
        <img
          src={imageUrl}
          alt="Generated post"
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/* Action buttons overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyText();
              }}
              className="bg-white/90 hover:bg-white text-black"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadImage();
              }}
              className="bg-white/90 hover:bg-white text-black"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-white/90 hover:bg-white text-black"
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 bg-card">
        <p className="text-sm leading-relaxed text-foreground line-clamp-3">
          {caption}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {hashtags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {tag}
            </span>
          ))}
          {hashtags.length > 4 && (
            <span className="text-xs text-muted-foreground px-2 py-1">
              +{hashtags.length - 4} more
            </span>
          )}
        </div>

        {isSelected && (
          <div className="space-y-2 pt-2 border-t border-border">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPostToFacebook();
              }}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Post to Facebook
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyText();
                }}
                className="flex-1"
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadImage();
                }}
                className="flex-1"
              >
                <Download className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
