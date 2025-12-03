import type { ContentItem, Feeling } from "@/types/domain";

/**
 * Curated content library for relaxation experiences
 * All content is from free, commercially-safe sources:
 * - Pixabay (CC0 license)
 * - Pexels (Free to use)
 * - FreePD (Public Domain music)
 * - Text prompts (original, public domain)
 */

// Nature Videos
const natureVideos: ContentItem[] = [
  {
    id: "nv-ocean-waves-1",
    type: "NATURE_VIDEO",
    title: "Calm Ocean Waves",
    url: "https://pixabay.com/videos/ocean-waves-sea-water-nature-31240/",
    description: "Peaceful ocean waves gently rolling onto shore",
    feeling: "ANXIETY",
    tags: ["ocean", "waves", "water", "peaceful"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 180,
  },
  {
    id: "nv-forest-stream-1",
    type: "NATURE_VIDEO",
    title: "Forest Stream",
    url: "https://pixabay.com/videos/stream-forest-nature-water-creek-41357/",
    description: "Tranquil forest stream with gentle water sounds",
    feeling: "STRESS",
    tags: ["forest", "stream", "water", "nature"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 240,
  },
  {
    id: "nv-mountain-sunrise-1",
    type: "NATURE_VIDEO",
    title: "Mountain Sunrise",
    url: "https://pixabay.com/videos/sunrise-mountains-nature-sky-dawn-28740/",
    description: "Beautiful sunrise over mountain peaks",
    feeling: "DEPRESSION",
    tags: ["mountains", "sunrise", "morning", "hope"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 200,
  },
  {
    id: "nv-rainfall-1",
    type: "NATURE_VIDEO",
    title: "Gentle Rainfall",
    url: "https://pixabay.com/videos/rain-water-drops-nature-weather-28645/",
    description: "Soothing rain falling on leaves",
    feeling: "FRUSTRATION",
    tags: ["rain", "water", "calming", "nature"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 180,
  },
];

// Relaxing Music
// Using local files in public/audio/ directory
const music: ContentItem[] = [
  {
    id: "music-ambient-1",
    type: "MUSIC",
    title: "Peaceful Ambient Music",
    url: "/audio/ambient-1.mp3",
    description: "Calm ambient music for relaxation",
    feeling: "ANXIETY",
    tags: ["ambient", "peaceful", "meditation"],
    license: {
      type: "PUBLIC_DOMAIN",
      requiresAttribution: false,
      commercialUse: true,
      source: "Local",
      sourceUrl: "",
    },
    attribution: "",
    durationSeconds: 300,
  },
  {
    id: "music-lofi-1",
    type: "MUSIC",
    title: "Lofi Study Beats",
    url: "/audio/lofi-1.mp3",
    description: "Gentle lofi music for focus and calm",
    feeling: "STRESS",
    tags: ["lofi", "chill", "study", "focus"],
    license: {
      type: "PUBLIC_DOMAIN",
      requiresAttribution: false,
      commercialUse: true,
      source: "Local",
      sourceUrl: "",
    },
    attribution: "",
    durationSeconds: 240,
  },
  {
    id: "music-piano-1",
    type: "MUSIC",
    title: "Soft Piano Melody",
    url: "/audio/piano-1.mp3",
    description: "Gentle piano music for reflection",
    feeling: "DEPRESSION",
    tags: ["piano", "soft", "gentle", "hopeful"],
    license: {
      type: "PUBLIC_DOMAIN",
      requiresAttribution: false,
      commercialUse: true,
      source: "Local",
      sourceUrl: "",
    },
    attribution: "",
    durationSeconds: 280,
  },
  {
    id: "music-nature-1",
    type: "MUSIC",
    title: "Nature Sounds with Music",
    url: "/audio/nature-1.mp3",
    description: "Harmonious blend of nature and music",
    feeling: "FRUSTRATION",
    tags: ["nature", "music", "harmony", "calm"],
    license: {
      type: "PUBLIC_DOMAIN",
      requiresAttribution: false,
      commercialUse: true,
      source: "Local",
      sourceUrl: "",
    },
    attribution: "",
    durationSeconds: 260,
  },
];

// Nature Sounds
const natureSounds: ContentItem[] = [
  {
    id: "ns-rain-1",
    type: "NATURE_SOUND",
    title: "Rain on Window",
    url: "https://pixabay.com/sound-effects/rain-on-window-1-7109/",
    description: "Gentle rain falling on a window",
    feeling: "STRESS",
    tags: ["rain", "ambient", "soothing"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 120,
  },
  {
    id: "ns-ocean-1",
    type: "NATURE_SOUND",
    title: "Ocean Waves",
    url: "https://pixabay.com/sound-effects/ocean-wave-1-6782/",
    description: "Rhythmic ocean waves",
    feeling: "ANXIETY",
    tags: ["ocean", "waves", "water"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 120,
  },
  {
    id: "ns-forest-1",
    type: "NATURE_SOUND",
    title: "Forest Ambience",
    url: "https://pixabay.com/sound-effects/forest-with-small-river-birds-and-nature-field-recording-6735/",
    description: "Birds chirping in a peaceful forest",
    feeling: "DEPRESSION",
    tags: ["forest", "birds", "nature"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 180,
  },
  {
    id: "ns-wind-1",
    type: "NATURE_SOUND",
    title: "Gentle Wind",
    url: "https://pixabay.com/sound-effects/wind-gentle-1-6773/",
    description: "Soft wind through trees",
    feeling: "FRUSTRATION",
    tags: ["wind", "trees", "peaceful"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
    durationSeconds: 90,
  },
];

// Calming Images
const images: ContentItem[] = [
  {
    id: "img-sunset-1",
    type: "IMAGE",
    title: "Peaceful Sunset",
    url: "https://pixabay.com/photos/sunset-beach-sea-ocean-dusk-1807524/",
    description: "Beautiful sunset over calm waters",
    feeling: "STRESS",
    tags: ["sunset", "peaceful", "ocean"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
  },
  {
    id: "img-mountains-1",
    type: "IMAGE",
    title: "Mountain Serenity",
    url: "https://pixabay.com/photos/mountains-lake-nature-landscape-3959204/",
    description: "Majestic mountains reflected in still water",
    feeling: "ANXIETY",
    tags: ["mountains", "lake", "reflection"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
  },
  {
    id: "img-flowers-1",
    type: "IMAGE",
    title: "Spring Blooms",
    url: "https://pixabay.com/photos/flowers-spring-nature-bloom-garden-3407104/",
    description: "Vibrant flowers in bloom",
    feeling: "DEPRESSION",
    tags: ["flowers", "spring", "hope", "beauty"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
  },
  {
    id: "img-forest-1",
    type: "IMAGE",
    title: "Forest Path",
    url: "https://pixabay.com/photos/forest-path-trees-nature-woods-1072828/",
    description: "Peaceful path through a green forest",
    feeling: "FRUSTRATION",
    tags: ["forest", "path", "trees", "green"],
    license: {
      type: "PIXABAY",
      requiresAttribution: false,
      commercialUse: true,
      source: "Pixabay",
      sourceUrl: "https://pixabay.com",
    },
  },
];

// Text Prompts for grounding and reflection
const textPrompts: Record<Feeling, string[]> = {
  STRESS: [
    "Take a deep breath. Notice how the air feels entering your nose.",
    "Your body is safe right now. Let your shoulders drop and relax.",
    "One thing at a time. What is the single most important thing right now?",
    "This moment will pass. You've handled difficult moments before.",
    "Ground yourself: Notice 5 things you can see, 4 you can touch, 3 you can hear.",
  ],
  ANXIETY: [
    "You are here, right now, and you are safe.",
    "Breathe in for 4 counts, hold for 4, breathe out for 6.",
    "Anxiety is temporary. It will pass like clouds in the sky.",
    "What would you say to a friend feeling this way? Say it to yourself.",
    "Name your feeling: 'I notice I'm feeling anxious.' This creates distance.",
  ],
  DEPRESSION: [
    "You don't have to feel better right now. Just be present.",
    "Small steps count. Getting here today was a step forward.",
    "This feeling is not permanent, even when it feels endless.",
    "You are worthy of care and compassion, especially from yourself.",
    "Notice one small thing of beauty around you. Let yourself feel it.",
  ],
  FRUSTRATION: [
    "Pause. Take three slow breaths before you react.",
    "What is within your control right now? Focus there.",
    "It's okay to feel frustrated. The feeling is valid.",
    "Sometimes the best response is to step away and return later.",
    "Ask yourself: Will this matter in a week? A month? A year?",
  ],
};

// Export consolidated library
export const contentLibrary = {
  natureVideos,
  music,
  natureSounds,
  images,
  textPrompts,
};

// Helper functions to retrieve content by feeling
export function getNatureVideosForFeeling(feeling: Feeling): ContentItem[] {
  return natureVideos.filter((item) => item.feeling === feeling);
}

export function getMusicForFeeling(feeling: Feeling): ContentItem[] {
  const feelingMusic = music.filter((item) => item.feeling === feeling);
  
  // Fallback: If no music for this feeling, use any available music
  // This helps when user hasn't added all 4 files yet
  if (feelingMusic.length === 0 && music.length > 0) {
    return [music[0]]; // Return first available music
  }
  
  return feelingMusic;
}

export function getNatureSoundsForFeeling(feeling: Feeling): ContentItem[] {
  return natureSounds.filter((item) => item.feeling === feeling);
}

export function getImagesForFeeling(feeling: Feeling): ContentItem[] {
  return images.filter((item) => item.feeling === feeling);
}

export function getTextPromptsForFeeling(feeling: Feeling): string[] {
  return textPrompts[feeling];
}

// Get all content items for seeding
export function getAllContentItems(): ContentItem[] {
  return [...natureVideos, ...music, ...natureSounds, ...images];
}

