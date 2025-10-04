import { PostGenerator } from "@/components/PostGenerator";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16 animate-float">
          <div className="inline-block">
            <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Post Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate stunning social media posts with AI-powered captions, hashtags, and images in seconds
          </p>
        </div>

        {/* Main Generator */}
        <PostGenerator />
      </div>
    </div>
  );
};

export default Index;
