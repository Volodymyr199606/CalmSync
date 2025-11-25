import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MoodCheckInForm } from "@/components/mood/MoodCheckInForm";

const originalFetch = global.fetch;

afterEach(() => {
  vi.restoreAllMocks();
  global.fetch = originalFetch;
});

describe("MoodCheckInForm", () => {
  it("renders feeling buttons and severity slider", () => {
    render(<MoodCheckInForm />);

    expect(screen.getByText("Stress")).toBeInTheDocument();
    expect(screen.getByText("Anxiety")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("shows validation error when submitting without a feeling", async () => {
    render(<MoodCheckInForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /Create Relaxation Experience/i })
    );

    expect(
      await screen.findByText(/Please select how you're feeling/i)
    ).toBeInTheDocument();
  });

  it("submits mood and experience data, invoking callback", async () => {
    const onExperienceGenerated = vi.fn();

    const moodResponse = {
      success: true,
      data: { id: "mood-123" },
    };

    const experienceResponse = {
      success: true,
      data: {
        session: {
          id: "session-1",
          userId: "user-1",
          moodCheckInId: "mood-123",
          feeling: "STRESS",
          severity: 5,
          primaryContentType: "MUSIC",
          durationMinutes: 7,
          completedAt: null,
          createdAt: new Date().toISOString(),
        },
        items: [],
      },
    };

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(moodResponse), { status: 201 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(experienceResponse), { status: 201 })
      );

    global.fetch = mockFetch as typeof fetch;

    render(<MoodCheckInForm onExperienceGenerated={onExperienceGenerated} />);

    fireEvent.click(screen.getByText("Stress"));
    fireEvent.click(
      screen.getByRole("button", { name: /Create Relaxation Experience/i })
    );

    await waitFor(() =>
      expect(onExperienceGenerated).toHaveBeenCalledWith(
        experienceResponse.data
      )
    );

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

