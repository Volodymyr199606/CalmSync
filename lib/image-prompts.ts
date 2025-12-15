/**
 * Utility functions for generating nature image prompts
 * Used for AI image generation in the dashboard
 */

const NATURE_IMAGE_PROMPTS = [
  "foggy forest morning mist peaceful nature",
  "mountain peaks with clouds serene landscape",
  "rain drops on green leaves nature close-up",
  "peaceful zen garden with stones and sand",
  "bamboo in rain calming green nature",
  "moss covered stones peaceful forest floor",
  "soft pine tree fog atmosphere misty morning",
  "calm water ripples zen peaceful reflection",
  "peaceful meadow with wildflowers",
  "serene lake at sunset",
  "misty mountain valley",
  "gentle stream in forest",
  "bamboo forest sunlight filtering through",
  "rocky beach with calm waves",
  "cherry blossom petals falling",
] as const;

/**
 * Get a random nature image prompt
 */
export function getRandomNaturePrompt(): string {
  return NATURE_IMAGE_PROMPTS[
    Math.floor(Math.random() * NATURE_IMAGE_PROMPTS.length)
  ];
}

/**
 * Get a specific nature image prompt by index
 */
export function getNaturePrompt(index: number): string {
  return NATURE_IMAGE_PROMPTS[index % NATURE_IMAGE_PROMPTS.length];
}

/**
 * Get multiple unique nature prompts
 */
export function getMultipleNaturePrompts(count: number): string[] {
  const prompts: string[] = [];
  const usedIndices = new Set<number>();

  while (prompts.length < count && prompts.length < NATURE_IMAGE_PROMPTS.length) {
    let index = Math.floor(Math.random() * NATURE_IMAGE_PROMPTS.length);
    
    // Find an unused index
    let attempts = 0;
    while (usedIndices.has(index) && attempts < NATURE_IMAGE_PROMPTS.length) {
      index = (index + 1) % NATURE_IMAGE_PROMPTS.length;
      attempts++;
    }
    
    usedIndices.add(index);
    prompts.push(NATURE_IMAGE_PROMPTS[index]);
  }

  return prompts;
}