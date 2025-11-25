/**
 * Verification script for Phase 2 implementation
 * Tests the relaxation engine with sample inputs
 */

import { generateRelaxationExperience, getBreathingExercise } from "../lib/relaxation-engine";
import type { Feeling } from "../types/domain";

console.log("🔍 Verifying Phase 2 Implementation...\n");

// Test all feelings with different severities
const feelings: Feeling[] = ["STRESS", "ANXIETY", "DEPRESSION", "FRUSTRATION"];
const severities = [3, 6, 9];

let testsPass = 0;
let totalTests = 0;

feelings.forEach((feeling) => {
  severities.forEach((severity) => {
    totalTests++;
    try {
      console.log(`Testing: ${feeling} (severity: ${severity})`);
      
      const experience = generateRelaxationExperience({
        feeling,
        severity: severity as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
      });

      // Verify output structure
      if (!experience.primaryType) throw new Error("Missing primaryType");
      if (!Array.isArray(experience.items)) throw new Error("items is not an array");
      if (!Array.isArray(experience.textPrompts)) throw new Error("textPrompts is not an array");
      if (typeof experience.includeBreathingAnimation !== "boolean") {
        throw new Error("includeBreathingAnimation is not a boolean");
      }
      if (typeof experience.sessionDurationMinutes !== "number") {
        throw new Error("sessionDurationMinutes is not a number");
      }

      console.log(`  ✓ Primary Type: ${experience.primaryType}`);
      console.log(`  ✓ Content Items: ${experience.items.length}`);
      console.log(`  ✓ Text Prompts: ${experience.textPrompts.length}`);
      console.log(`  ✓ Breathing: ${experience.includeBreathingAnimation}`);
      console.log(`  ✓ Duration: ${experience.sessionDurationMinutes} min\n`);

      testsPass++;
    } catch (error) {
      console.error(`  ✗ FAILED: ${error}\n`);
    }
  });
});

// Test breathing exercises
console.log("Testing breathing exercises...");
feelings.forEach((feeling) => {
  totalTests++;
  try {
    const exercise = getBreathingExercise(feeling, 7);
    
    if (typeof exercise.inhaleSeconds !== "number") throw new Error("Invalid inhale");
    if (typeof exercise.holdSeconds !== "number") throw new Error("Invalid hold");
    if (typeof exercise.exhaleSeconds !== "number") throw new Error("Invalid exhale");
    if (typeof exercise.cycles !== "number") throw new Error("Invalid cycles");
    if (typeof exercise.totalDurationSeconds !== "number") throw new Error("Invalid total");

    console.log(`  ✓ ${feeling}: ${exercise.inhaleSeconds}s-${exercise.holdSeconds}s-${exercise.exhaleSeconds}s × ${exercise.cycles} cycles`);
    testsPass++;
  } catch (error) {
    console.error(`  ✗ ${feeling} FAILED: ${error}`);
  }
});

console.log(`\n${"=".repeat(50)}`);
console.log(`✅ Passed: ${testsPass}/${totalTests} tests`);
console.log(`${"=".repeat(50)}\n`);

if (testsPass === totalTests) {
  console.log("🎉 Phase 2 verification complete! All systems operational.\n");
  process.exit(0);
} else {
  console.error("❌ Some tests failed. Please review the implementation.\n");
  process.exit(1);
}

