import { describe, it, expect } from "vitest";
import {
  generateRelaxationExperience,
  getBreathingExercise,
  validateEngineInput,
} from "@/lib/relaxation-engine";
import type { EngineInput, Feeling } from "@/types/domain";

describe("Relaxation Engine", () => {
  describe("generateRelaxationExperience", () => {
    it("should generate nature video experience for high anxiety", () => {
      const input: EngineInput = {
        feeling: "ANXIETY",
        severity: 9,
      };

      const output = generateRelaxationExperience(input);

      expect(output.primaryType).toBe("NATURE_VIDEO");
      expect(output.includeBreathingAnimation).toBe(true);
      expect(output.items.length).toBeGreaterThan(0);
      expect(output.textPrompts.length).toBe(3);
      expect(output.sessionDurationMinutes).toBe(10);
    });

    it("should generate music experience for low stress", () => {
      const input: EngineInput = {
        feeling: "STRESS",
        severity: 3,
      };

      const output = generateRelaxationExperience(input);

      expect(output.primaryType).toBe("MUSIC");
      expect(output.includeBreathingAnimation).toBe(false);
      expect(output.items.length).toBeGreaterThan(0);
      expect(output.textPrompts.length).toBe(3);
      expect(output.sessionDurationMinutes).toBe(5);
    });

    it("should include breathing animation for severity >= 6", () => {
      const input: EngineInput = {
        feeling: "DEPRESSION",
        severity: 6,
      };

      const output = generateRelaxationExperience(input);

      expect(output.includeBreathingAnimation).toBe(true);
    });

    it("should not include breathing animation for severity < 6", () => {
      const input: EngineInput = {
        feeling: "FRUSTRATION",
        severity: 5,
      };

      const output = generateRelaxationExperience(input);

      expect(output.includeBreathingAnimation).toBe(false);
    });

    it("should generate appropriate content for all feelings", () => {
      const feelings: Feeling[] = [
        "STRESS",
        "ANXIETY",
        "DEPRESSION",
        "FRUSTRATION",
      ];

      feelings.forEach((feeling) => {
        const input: EngineInput = { feeling, severity: 7 };
        const output = generateRelaxationExperience(input);

        expect(output.items.length).toBeGreaterThan(0);
        expect(output.textPrompts.length).toBe(3);
        expect(output.primaryType).toBeDefined();
      });
    });
  });

  describe("getBreathingExercise", () => {
    it("should return longer exhale for anxiety", () => {
      const exercise = getBreathingExercise("ANXIETY", 7);

      expect(exercise.exhaleSeconds).toBeGreaterThan(exercise.inhaleSeconds);
      expect(exercise.cycles).toBeGreaterThan(0);
      expect(exercise.totalDurationSeconds).toBeGreaterThan(0);
    });

    it("should return box breathing for stress", () => {
      const exercise = getBreathingExercise("STRESS", 7);

      expect(exercise.inhaleSeconds).toBe(exercise.exhaleSeconds);
      expect(exercise.inhaleSeconds).toBe(exercise.holdSeconds);
    });

    it("should return energizing breath for depression", () => {
      const exercise = getBreathingExercise("DEPRESSION", 6);

      expect(exercise.inhaleSeconds).toBeGreaterThan(exercise.holdSeconds);
    });

    it("should adjust cycles based on severity", () => {
      const lowSeverity = getBreathingExercise("ANXIETY", 3);
      const highSeverity = getBreathingExercise("ANXIETY", 9);

      expect(highSeverity.cycles).toBeGreaterThan(lowSeverity.cycles);
    });
  });

  describe("validateEngineInput", () => {
    it("should validate correct input", () => {
      const input: EngineInput = {
        feeling: "ANXIETY",
        severity: 5,
      };

      expect(validateEngineInput(input)).toBe(true);
    });

    it("should reject invalid feeling", () => {
      const input = {
        feeling: "INVALID",
        severity: 5,
      };

      expect(validateEngineInput(input)).toBe(false);
    });

    it("should reject invalid severity (too low)", () => {
      const input = {
        feeling: "ANXIETY",
        severity: 0,
      };

      expect(validateEngineInput(input)).toBe(false);
    });

    it("should reject invalid severity (too high)", () => {
      const input = {
        feeling: "ANXIETY",
        severity: 11,
      };

      expect(validateEngineInput(input)).toBe(false);
    });

    it("should reject non-integer severity", () => {
      const input = {
        feeling: "ANXIETY",
        severity: 5.5,
      };

      expect(validateEngineInput(input)).toBe(false);
    });

    it("should accept optional userId", () => {
      const input: EngineInput = {
        feeling: "STRESS",
        severity: 7,
        userId: "user123",
      };

      expect(validateEngineInput(input)).toBe(true);
    });
  });
});

