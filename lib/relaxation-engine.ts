import type {
  EngineInput,
  EngineOutput,
  ContentItem,
  Feeling,
  SeverityLevel,
} from "@/types/domain";
import {
  getNatureVideosForFeeling,
  getMusicForFeeling,
  getNatureSoundsForFeeling,
  getTextPromptsForFeeling,
} from "./content-library";

/**
 * Relaxation Engine - Deterministic content selection based on mood
 *
 * Rules:
 * - High severity (8-10): Nature video + breathing + ambient sound + grounding text
 * - Medium severity (4-7): Music or video + breathing + text
 * - Low severity (1-3): Music + text prompts
 *
 * Feeling-specific adjustments:
 * - ANXIETY: Focus on breathing, nature videos, rhythmic sounds
 * - STRESS: Lofi music, forest sounds, actionable prompts
 * - DEPRESSION: Uplifting content, hope-focused prompts, gentle music
 * - FRUSTRATION: Grounding exercises, nature sounds, perspective prompts
 */

export function generateRelaxationExperience(
  input: EngineInput
): EngineOutput {
  const { feeling, severity } = input;

  // Determine primary content type based on severity
  const primaryType = severity >= 7 ? "NATURE_VIDEO" : "MUSIC";

  // Get content items
  const items = selectContentItems(feeling, severity, primaryType);

  // Get text prompts (select 3 most relevant)
  const allPrompts = getTextPromptsForFeeling(feeling);
  const textPrompts = selectTextPrompts(allPrompts, severity);

  // Determine if breathing animation should be included
  const includeBreathingAnimation = severity >= 6;

  // Calculate session duration based on severity
  const sessionDurationMinutes = calculateSessionDuration(severity);

  return {
    primaryType,
    items,
    textPrompts,
    includeBreathingAnimation,
    sessionDurationMinutes,
  };
}

/**
 * Select appropriate content items based on feeling, severity, and primary type
 */
function selectContentItems(
  feeling: Feeling,
  severity: SeverityLevel,
  primaryType: "MUSIC" | "NATURE_VIDEO"
): ContentItem[] {
  const items: ContentItem[] = [];

  // Add primary content
  if (primaryType === "NATURE_VIDEO") {
    const videos = getNatureVideosForFeeling(feeling);
    if (videos.length > 0) {
      items.push(videos[0]); // Select first matching video
    }
  } else {
    const musicTracks = getMusicForFeeling(feeling);
    if (musicTracks.length > 0) {
      items.push(musicTracks[0]); // Select first matching music
    }
  }

  // Add ambient nature sound for medium-high severity
  if (severity >= 5) {
    const sounds = getNatureSoundsForFeeling(feeling);
    if (sounds.length > 0) {
      items.push(sounds[0]); // Add ambient sound
    }
  }

  // Add secondary music for very high severity (layered approach)
  if (severity >= 8 && primaryType === "NATURE_VIDEO") {
    const musicTracks = getMusicForFeeling(feeling);
    if (musicTracks.length > 0) {
      items.push(musicTracks[0]); // Add music to accompany video
    }
  }

  return items;
}

/**
 * Select text prompts based on severity
 * Higher severity = more grounding prompts
 */
function selectTextPrompts(
  allPrompts: string[],
  severity: SeverityLevel
): string[] {
  // High severity: Use first 3 prompts (most grounding)
  if (severity >= 7) {
    return allPrompts.slice(0, 3);
  }

  // Medium severity: Use middle prompts (balanced)
  if (severity >= 4) {
    return allPrompts.slice(1, 4);
  }

  // Low severity: Use later prompts (more reflective)
  return allPrompts.slice(2, 5);
}

/**
 * Calculate recommended session duration based on severity
 * Higher severity = longer session for deeper relaxation
 */
function calculateSessionDuration(severity: SeverityLevel): number {
  if (severity >= 8) return 10; // 10 minutes for high severity
  if (severity >= 5) return 7; // 7 minutes for medium-high
  if (severity >= 3) return 5; // 5 minutes for medium
  return 3; // 3 minutes for low severity
}

/**
 * Get breathing exercise parameters based on feeling and severity
 */
export function getBreathingExercise(
  feeling: Feeling,
  severity: SeverityLevel
): {
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
  cycles: number;
  totalDurationSeconds: number;
} {
  // Anxiety benefits from longer exhales (activates parasympathetic)
  if (feeling === "ANXIETY") {
    const inhale = 4;
    const hold = 4;
    const exhale = 6; // Longer exhale for calm
    const cycles = severity >= 7 ? 8 : 6;
    return {
      inhaleSeconds: inhale,
      holdSeconds: hold,
      exhaleSeconds: exhale,
      cycles,
      totalDurationSeconds: (inhale + hold + exhale) * cycles,
    };
  }

  // Stress benefits from box breathing (equal counts)
  if (feeling === "STRESS") {
    const count = 4;
    const cycles = severity >= 7 ? 8 : 6;
    return {
      inhaleSeconds: count,
      holdSeconds: count,
      exhaleSeconds: count,
      cycles,
      totalDurationSeconds: count * 3 * cycles,
    };
  }

  // Depression benefits from energizing breath (longer inhale)
  if (feeling === "DEPRESSION") {
    const inhale = 5;
    const hold = 3;
    const exhale = 4;
    const cycles = severity >= 7 ? 6 : 5;
    return {
      inhaleSeconds: inhale,
      holdSeconds: hold,
      exhaleSeconds: exhale,
      cycles,
      totalDurationSeconds: (inhale + hold + exhale) * cycles,
    };
  }

  // Frustration benefits from calming breath
  const inhale = 4;
  const hold = 2;
  const exhale = 6;
  const cycles = severity >= 7 ? 7 : 5;
  return {
    inhaleSeconds: inhale,
    holdSeconds: hold,
    exhaleSeconds: exhale,
    cycles,
    totalDurationSeconds: (inhale + hold + exhale) * cycles,
  };
}

/**
 * Validate engine input
 */
export function validateEngineInput(input: unknown): input is EngineInput {
  if (typeof input !== "object" || input === null) return false;

  const { feeling, severity } = input as EngineInput;

  const validFeelings: Feeling[] = [
    "STRESS",
    "ANXIETY",
    "DEPRESSION",
    "FRUSTRATION",
  ];
  if (!validFeelings.includes(feeling)) return false;

  if (
    typeof severity !== "number" ||
    severity < 1 ||
    severity > 10 ||
    !Number.isInteger(severity)
  ) {
    return false;
  }

  return true;
}

