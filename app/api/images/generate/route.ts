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
      // Prevent caching to ensure fresh images each time
      return NextResponse.json(
        { url: imageUrl, source: "openai" },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
          },
        }
      );
    } catch (error) {
      console.error("OpenAI image generation failed:", error);
      // Fall through to Unsplash fallback
    }
  }

  // Fallback to Unsplash for nature images
  const unsplashUrl = await generateUnsplashImage(prompt, width, height);
  
  // Prevent caching to ensure fresh images each time
  return NextResponse.json(
    { url: unsplashUrl, source: "unsplash" },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
      },
    }
  );
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
  // Trim whitespace and remove quotes if present
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY?.trim().replace(/^["']|["']$/g, '');
  
  if (unsplashApiKey) {
    try {
      // Use generic nature-related queries for variety, randomly selected each time
      const natureQueries = [
        "nature landscape",
        "peaceful nature",
        "calming nature",
        "serene landscape",
        "tranquil nature",
        "forest landscape",
        "mountain landscape",
        "ocean landscape",
        "garden nature",
        "sunset nature",
        "peaceful scenery",
        "meditation nature"
      ];
      
      // Pick a random query to get variety each time
      const randomQuery = natureQueries[Math.floor(Math.random() * natureQueries.length)];
      
      // Log for debugging (remove in production)
      console.log("[Unsplash API] Making request with key length:", unsplashApiKey.length);
      
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
          randomQuery
        )}&orientation=landscape`,
        { 
          method: "GET",
          headers: {
            "Accept-Version": "v1",
            "Authorization": `Client-ID ${unsplashApiKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Use the regular size and add dimensions for proper sizing
        const imageUrl = data.urls?.regular || data.urls?.full || data.urls?.small;
        if (imageUrl) {
          // Add dimensions to the URL if not already present
          const urlObj = new URL(imageUrl);
          urlObj.searchParams.set('w', width.toString());
          urlObj.searchParams.set('h', height.toString());
          urlObj.searchParams.set('fit', 'crop');
          urlObj.searchParams.set('q', '85');
          return urlObj.toString();
        } else {
          console.error("Unsplash API: No image URL in response", data);
        }
      } else {
        let errorText = "";
        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error("Unsplash API error response:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            hasApiKey: !!unsplashApiKey,
            apiKeyLength: unsplashApiKey?.length || 0,
            apiKeyPrefix: unsplashApiKey?.substring(0, 10) + "..."
          });
        } catch (e) {
          errorText = await response.text();
          console.error("Unsplash API error (text):", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
            hasApiKey: !!unsplashApiKey,
            apiKeyLength: unsplashApiKey?.length || 0
          });
        }
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

  // Select image randomly (not based on hash) for variety each time
  const index = Math.floor(Math.random() * reliableNatureImages.length);
  
  // Return the selected image URL with requested dimensions
  return reliableNatureImages[index].replace("w=1200", `w=${width}&h=${height}`);
}