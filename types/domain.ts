// Domain types for CalmSync relaxation engine

export type Feeling = "STRESS" | "ANXIETY" | "DEPRESSION" | "FRUSTRATION";

export type ContentType =
  | "MUSIC"
  | "NATURE_VIDEO"
  | "NATURE_SOUND"
  | "IMAGE"
  | "TEXT"
  | "BREATHING_ANIMATION";

export type SeverityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Input to the relaxation engine
export interface EngineInput {
  feeling: Feeling;
  severity: SeverityLevel;
  userId?: string; // Optional for personalization
}

// Output from the relaxation engine
export interface EngineOutput {
  primaryType: "MUSIC" | "NATURE_VIDEO";
  items: ContentItem[];
  textPrompts: string[];
  includeBreathingAnimation: boolean;
  sessionDurationMinutes: number;
}

// Content item from the library
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url?: string; // URL for videos, music, images
  content?: string; // Text content for prompts
  description?: string;
  feeling: Feeling;
  tags: string[];
  license: ContentLicense;
  attribution?: string;
  durationSeconds?: number; // For music/video
}

// Licensing information for content
export interface ContentLicense {
  type: "CC0" | "CC-BY" | "PIXABAY" | "PEXELS" | "PUBLIC_DOMAIN";
  requiresAttribution: boolean;
  commercialUse: boolean;
  source: string; // e.g., "Pixabay", "Pexels", "FreePD"
  sourceUrl?: string;
}

// Mood check-in data
export interface MoodCheckIn {
  id: string;
  userId: string;
  feeling: Feeling;
  severity: SeverityLevel;
  createdAt: Date;
}

// Relaxation session data
export interface RelaxationSession {
  id: string;
  userId: string;
  moodCheckInId: string;
  startedAt: Date;
  completedAt?: Date;
  durationSec?: number;
  contentItems: ContentItem[];
}

// Session creation input
export interface CreateSessionInput {
  userId: string;
  moodCheckInId: string;
  engineOutput: EngineOutput;
}

// Breathing exercise parameters
export interface BreathingExercise {
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
  totalDurationSeconds: number;
}


