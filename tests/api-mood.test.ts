import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import { POST as moodPost } from "@/app/api/mood/route";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    moodCheckIn: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/auth", () => ({
  auth: () => mocks.auth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma,
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  extractErrorInfo: (error: unknown) => error,
}));

const createRequest = (body: Record<string, unknown>): NextRequest =>
  ({
    json: async () => body,
  } as NextRequest);

describe("POST /api/mood", () => {
  const mockAuth = mocks.auth;
  const mockPrisma = mocks.prisma;
  beforeEach(() => {
    mockAuth.mockReset();
    mockPrisma.user.findUnique.mockReset();
    mockPrisma.moodCheckIn.create.mockReset();
  });

  it("returns 401 when user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const response = await moodPost(createRequest({}));

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error).toMatch(/Unauthorized/i);
  });

  it("creates a mood check-in for authenticated users", async () => {
    const email = "calm@example.com";
    mockAuth.mockResolvedValue({
      user: { email },
    });

    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email,
      name: "Calm User",
    });

    mockPrisma.moodCheckIn.create.mockResolvedValue({
      id: "mood-1",
      userId: "user-1",
      feeling: "STRESS",
      severity: 5,
      notes: null,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
    });

    const response = await moodPost(
      createRequest({ feeling: "STRESS", severity: 5 })
    );

    expect(response.status).toBe(201);

    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.id).toBe("mood-1");
    expect(mockPrisma.moodCheckIn.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        feeling: "STRESS",
        severity: 5,
        notes: null,
      },
    });
  });
});

