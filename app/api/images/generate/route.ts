import { NextRequest, NextResponse } from "next/server";

/**
 * API route to generate AI images for the dashboard background
 * Supports OpenAI DALL-E 3 or falls back to Unsplash if no API key is configured
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const prompt = searchParams.get("prompt") || "peaceful nature scene";
  const width = parseInt(searchParams.get("width") || "512");
  const height = parseInt(searchParams.get("height") || "512");

  // Try OpenAI DALL-E if API key is available
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (openaiApiKey) {
    try {
      const imageUrl = await generateImageWithOpenAI(prompt, width, height, openaiApiKey);
      return NextResponse.json({ url: imageUrl, source: "openai" });
    } catch (error) {
      console.error("OpenAI image generation failed:", error);
      // Fall through to Unsplash fallback
    }
  }

  // Fallback to Unsplash for nature images
  const unsplashUrl = await generateUnsplashImage(prompt, width, height);
  return NextResponse.json({ url: unsplashUrl, source: "unsplash" });
}

/**
 * Generate image using OpenAI DALL-E 3
 */
async function generateImageWithOpenAI(
  prompt: string,
  width: number,
  height: number,
  apiKey: string
): Promise<string> {
  // Enhance prompt for calming nature scenes
  const enhancedPrompt = `A serene, peaceful ${prompt}, calming and meditative atmosphere, soft lighting, nature photography, high quality, tranquil mood`;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024", // DALL-E 3 supports specific sizes
      quality: "standard",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

/**
 * Fallback: Generate image using Unsplash API (free tier)
 * Uses reliable Unsplash photo URLs that are known to work
 */
async function generateUnsplashImage(
  prompt: string,
  width: number,
  height: number
): Promise<string> {
  // Use Unsplash API with key if available (for truly random images)
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (unsplashApiKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
          prompt
        )}&orientation=landscape&client_id=${unsplashApiKey}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        return data.urls.regular || data.urls.full;
      }
    } catch (error) {
      console.error("Unsplash API error:", error);
    }
  }

  // Fallback: Use curated list of reliable Unsplash nature images
  // These are the same URLs used in ExperienceView and are guaranteed to work
  const reliableNatureImages = [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&fit=crop", // Peaceful Forest
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=85&fit=crop", // Calm Ocean
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85&fit=crop", // Mountain Vista
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85&fit=crop", // Blooming Garden
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=85&fit=crop", // Serene Lake
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=85&fit=crop", // Sunset Sky
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=85&fit=crop", // Flowers
    "https://images.unsplash.com/photo-1469474968028-56645f4e32e6?w=1200&q=85&fit=crop", // Mountain landscape
  ];

  // Select image based on prompt hash for consistency
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % reliableNatureImages.length;
  
  // Return the selected image URL with requested dimensions
  return reliableNatureImages[index].replace("w=1200", `w=${width}&h=${height}`);
}