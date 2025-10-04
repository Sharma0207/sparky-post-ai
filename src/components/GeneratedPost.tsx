import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Facebook } from "lucide-react";
import { useState } from "react";

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

  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
        isSelected
          ? "border-primary shadow-hover ring-2 ring-primary/50"
          : "border-border shadow-card hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground rounded-full p-2">
          <Check className="h-4 w-4" />
        </div>
      )}

      <div className="aspect-square bg-muted relative overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        )}
        <img
          src={imageUrl}
          alt="Generated post"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="p-4 space-y-3 bg-card">
        <p className="text-sm leading-relaxed text-foreground">{caption}</p>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {isSelected && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onPostToFacebook();
            }}
            className="w-full mt-3 bg-[#1877F2] hover:bg-[#166FE5] text-white"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Post to Facebook
          </Button>
        )}
      </div>
    </Card>
  );
};
