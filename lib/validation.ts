import { z } from "zod";

// Feeling enum validation
export const FeelingSchema = z.enum([
  "STRESS",
  "ANXIETY",
  "DEPRESSION",
  "FRUSTRATION",
]);

// Severity level validation (1-10)
export const SeveritySchema = z.number().int().min(1).max(10);

// Content type validation
export const ContentTypeSchema = z.enum([
  "MUSIC",
  "NATURE_VIDEO",
  "NATURE_SOUND",
  "IMAGE",
  "TEXT",
  "BREATHING_ANIMATION",
]);

// Mood check-in creation input (for API)
export const moodCheckInSchema = z.object({
  feeling: FeelingSchema,
  severity: SeveritySchema,
  notes: z.string().max(1000, "Notes must be 1000 characters or less").optional(),
});

export type MoodCheckInInput = z.infer<typeof moodCheckInSchema>;

// Legacy mood check-in creation input (with userId)
export const CreateMoodCheckInInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  feeling: FeelingSchema,
  severity: SeveritySchema,
});

export type CreateMoodCheckInInput = z.infer<
  typeof CreateMoodCheckInInputSchema
>;

// Experience/session creation input
export const CreateExperienceInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  moodCheckInId: z.string().min(1, "Mood check-in ID is required"),
  feeling: FeelingSchema,
  severity: SeveritySchema,
});

export type CreateExperienceInput = z.infer<
  typeof CreateExperienceInputSchema
>;

// Engine input validation
export const EngineInputSchema = z.object({
  feeling: FeelingSchema,
  severity: SeveritySchema,
  userId: z.string().optional(),
});

export type EngineInputValidated = z.infer<typeof EngineInputSchema>;

// Content item validation
export const ContentItemSchema = z.object({
  id: z.string(),
  type: ContentTypeSchema,
  title: z.string(),
  url: z.string().url().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  feeling: FeelingSchema,
  tags: z.array(z.string()),
  license: z.object({
    type: z.enum(["CC0", "CC-BY", "PIXABAY", "PEXELS", "PUBLIC_DOMAIN"]),
    requiresAttribution: z.boolean(),
    commercialUse: z.boolean(),
    source: z.string(),
    sourceUrl: z.string().url().optional(),
  }),
  attribution: z.string().optional(),
  durationSeconds: z.number().optional(),
});

// Session completion input
export const CompleteSessionInputSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  durationSec: z.number().int().min(1, "Duration must be at least 1 second"),
});

export type CompleteSessionInput = z.infer<typeof CompleteSessionInputSchema>;

// Helper function to validate and parse data
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

