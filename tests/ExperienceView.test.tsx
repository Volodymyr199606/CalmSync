import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExperienceView } from "@/components/experience/ExperienceView";
import type { RelaxationSession, SessionItem } from "@/types/domain";

const baseSession: RelaxationSession = {
  id: "session-1",
  userId: "user-1",
  moodCheckInId: null,
  feeling: "STRESS",
  severity: 6,
  primaryContentType: "MUSIC",
  durationMinutes: 7,
  completedAt: null,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
};

const baseItems: SessionItem[] = [
  {
    id: "item-music",
    sessionId: "session-1",
    contentType: "MUSIC",
    contentId: "music-1",
    title: "Calm Waves",
    url: "https://example.com/music.mp3",
    description: "Gentle background music",
    duration: 180,
    orderIndex: 0,
  },
  {
    id: "item-text",
    sessionId: "session-1",
    contentType: "TEXT",
    contentId: "text-1",
    title: "Grounding Prompt",
    description: "Notice five things you can see.",
    duration: null,
    orderIndex: 1,
  },
  {
    id: "item-image",
    sessionId: "session-1",
    contentType: "IMAGE",
    contentId: "image-1",
    title: "Forest Canopy",
    url: "https://example.com/forest.jpg",
    description: null,
    duration: null,
    orderIndex: 2,
  },
  {
    id: "item-sound",
    sessionId: "session-1",
    contentType: "NATURE_SOUND",
    contentId: "sound-1",
    title: "Rainfall",
    url: "https://example.com/rain.mp3",
    description: null,
    duration: 120,
    orderIndex: 3,
  },
];

describe("ExperienceView", () => {
  it("renders empty state when no session is provided", () => {
    render(<ExperienceView session={null} items={[]} />);

    expect(screen.getByText(/Ready to relax/i)).toBeInTheDocument();
  });

  it("renders session details and toggles ambient sound", () => {
    render(<ExperienceView session={baseSession} items={baseItems} />);

    expect(
      screen.getByText(/Your Relaxation Experience/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Calm Waves")).toBeInTheDocument();

    const toggleButton = screen.getByRole("button", {
      name: /Add Nature Sounds/i,
    });
    fireEvent.click(toggleButton);

    expect(
      screen.getByRole("button", { name: /Sound On/i })
    ).toBeInTheDocument();
  });
});

