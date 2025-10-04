import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput = ({ onGenerate, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Describe your social media post... (e.g., 'Diwali celebration post with diyas')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none text-lg border-2 focus:border-primary transition-colors"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={!prompt.trim() || isLoading}
        className="w-full bg-gradient-primary hover:shadow-hover transition-all duration-300 text-lg py-6"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {isLoading ? "Generating Magic..." : "Generate Posts"}
      </Button>
    </form>
  );
};
