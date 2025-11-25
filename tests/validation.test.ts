import { describe, it, expect } from "vitest";
import {
  moodCheckInSchema,
  EngineInputSchema,
  validateInput,
  FeelingSchema,
  SeveritySchema,
} from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("moodCheckInSchema", () => {
    it("accepts valid mood check-in data", () => {
      const data = {
        feeling: "STRESS",
        severity: 7,
        notes: "Feeling tense before a presentation",
      };

      const parsed = moodCheckInSchema.parse(data);
      expect(parsed).toEqual(data);
    });

    it("rejects invalid severity values", () => {
      expect(() =>
        moodCheckInSchema.parse({ feeling: "ANXIETY", severity: 12 })
      ).toThrow();
    });

    it("limits note length", () => {
      const longNotes = "a".repeat(1001);
      expect(() =>
        moodCheckInSchema.parse({ feeling: "STRESS", severity: 5, notes: longNotes })
      ).toThrow(/1000/);
    });
  });

  describe("EngineInputSchema", () => {
    it("requires valid feeling and severity", () => {
      const result = EngineInputSchema.safeParse({
        feeling: "FRUSTRATION",
        severity: 4,
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid payloads", () => {
      const result = EngineInputSchema.safeParse({
        feeling: "JOY",
        severity: 0,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("validateInput helper", () => {
    it("returns success object for valid data", () => {
      const input = {
        feeling: "ANXIETY",
        severity: 6,
      };

      const result = validateInput(moodCheckInSchema, input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(input);
      }
    });

    it("returns error object for invalid data", () => {
      const input = {
        feeling: "STRESS",
        severity: 0,
      };

      const result = validateInput(moodCheckInSchema, input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("severity");
      }
    });
  });

  describe("primitive schemas", () => {
    it("validates feeling values", () => {
      expect(FeelingSchema.safeParse("ANXIETY").success).toBe(true);
      expect(FeelingSchema.safeParse("JOY").success).toBe(false);
    });

    it("validates severity range", () => {
      expect(SeveritySchema.safeParse(1).success).toBe(true);
      expect(SeveritySchema.safeParse(11).success).toBe(false);
    });
  });
});

