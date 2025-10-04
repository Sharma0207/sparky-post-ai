import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating posts for prompt:", prompt);

    // Generate 3 versions in parallel
    const versions = await Promise.all([
      generateVersion(prompt, 1, LOVABLE_API_KEY),
      generateVersion(prompt, 2, LOVABLE_API_KEY),
      generateVersion(prompt, 3, LOVABLE_API_KEY),
    ]);

    return new Response(JSON.stringify({ versions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function generateVersion(prompt: string, versionNumber: number, apiKey: string) {
  // Generate caption and hashtags
  const textResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a creative social media expert. Generate engaging captions and relevant hashtags for social media posts. 
          Make each version unique and creative. Return ONLY valid JSON in this exact format:
          {"caption": "your caption here", "hashtags": ["#tag1", "#tag2", "#tag3"]}`,
        },
        {
          role: "user",
          content: `Create version ${versionNumber} for: ${prompt}. Make it unique and engaging.`,
        },
      ],
    }),
  });

  if (!textResponse.ok) {
    throw new Error(`Text generation failed: ${textResponse.status}`);
  }

  const textData = await textResponse.json();
  const content = textData.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content generated");
  }

  // Parse the JSON response - handle markdown code blocks
  let parsedContent;
  try {
    // Remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```\n/, "").replace(/\n```$/, "");
    }
    
    parsedContent = JSON.parse(cleanContent);
  } catch (e) {
    console.error("Failed to parse JSON:", content);
    // Fallback in case AI doesn't return valid JSON
    parsedContent = {
      caption: content.split("\n")[0] || "Check out this amazing post!",
      hashtags: ["#social", "#media", "#post"],
    };
  }

  // Generate image
  const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
      messages: [
        {
          role: "user",
          content: `Create a beautiful, vibrant social media image for: ${prompt}. Make it eye-catching and suitable for platforms like Facebook and Instagram. Version ${versionNumber} should have a unique style.`,
        },
      ],
      modalities: ["image", "text"],
    }),
  });

  if (!imageResponse.ok) {
    throw new Error(`Image generation failed: ${imageResponse.status}`);
  }

  const imageData = await imageResponse.json();
  const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl) {
    throw new Error("No image generated");
  }

  return {
    caption: parsedContent.caption,
    hashtags: parsedContent.hashtags,
    imageUrl: imageUrl,
  };
}
