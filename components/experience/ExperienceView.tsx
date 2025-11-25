'use client';

/**
 * ExperienceView - Displays the generated relaxation experience
 * Includes video/music player, ambient sounds, prompts, and breathing animation
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RelaxationSession, SessionItem } from '@/types/domain';

interface ExperienceViewProps {
  session: RelaxationSession | null;
  items: SessionItem[];
}

/**
 * Breathing animation component - circle that expands/contracts
 */
function BreathingAnimation() {
  const [isInhaling, setIsInhaling] = useState(true);

  useEffect(() => {
    // 4 seconds inhale, 4 seconds exhale
    const interval = setInterval(() => {
      setIsInhaling((prev) => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
        {/* Animated circle */}
        <div
          className={`
            absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-60 transition-transform duration-[4000ms] ease-in-out
            ${isInhaling ? 'scale-100' : 'scale-50'}
          `}
        />
        {/* Center text */}
        <span className="relative z-10 text-sm font-medium text-white sm:text-base">
          {isInhaling ? 'Breathe In' : 'Breathe Out'}
        </span>
      </div>
      <p className="text-xs text-gray-600 sm:text-sm">
        Follow the circle to regulate your breathing
      </p>
    </div>
  );
}

/**
 * Media player component for video or music
 */
function MediaPlayer({ item }: { item: SessionItem }) {
  if (item.contentType === 'NATURE_VIDEO' && item.url) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
        <iframe
          src={item.url}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  if (item.contentType === 'MUSIC' && item.url) {
    return (
      <div className="w-full rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-6 sm:p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md sm:h-14 sm:w-14">
              <svg
                className="h-6 w-6 text-purple-600 sm:h-7 sm:w-7"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
            </div>
          </div>
          <audio controls className="w-full" src={item.url}>
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Text prompt display
 */
function TextPrompt({ item }: { item: SessionItem }) {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
            {item.description}
          </p>
        )}
      </div>
    </Card>
  );
}

/**
 * Background image component
 */
function BackgroundImage({ item }: { item: SessionItem }) {
  if (!item.url) return null;

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-64">
      <img
        src={item.url}
        alt={item.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-sm font-medium text-white sm:text-base">
          {item.title}
        </p>
      </div>
    </div>
  );
}

/**
 * Empty state when no experience is loaded
 */
function EmptyState() {
  return (
    <Card className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center sm:p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 sm:h-20 sm:w-20">
        <svg
          className="h-8 w-8 text-purple-600 sm:h-10 sm:w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 sm:text-xl">
        Ready to relax?
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-600 sm:text-base">
        Complete the mood check-in form to receive your personalized relaxation
        experience.
      </p>
    </Card>
  );
}

/**
 * Loading state
 */
function LoadingState() {
  return (
    <Card className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center sm:p-8">
      <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
        <svg
          className="h-12 w-12 animate-spin text-purple-600 sm:h-14 sm:w-14"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 sm:text-xl">
        Creating your experience...
      </h3>
      <p className="mt-2 text-sm text-gray-600 sm:text-base">
        Curating the perfect relaxation content for you
      </p>
    </Card>
  );
}

/**
 * Main ExperienceView component
 */
export function ExperienceView({ session, items }: ExperienceViewProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Show empty state if no session
  if (!session) {
    return <EmptyState />;
  }

  // Find different content types
  const primaryContent = items.find(
    (item) => item.contentType === 'NATURE_VIDEO' || item.contentType === 'MUSIC'
  );
  const ambientSound = items.find((item) => item.contentType === 'NATURE_SOUND');
  const backgroundImage = items.find((item) => item.contentType === 'IMAGE');
  const textPrompts = items.filter((item) => item.contentType === 'TEXT');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with session info */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Your Relaxation Experience
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {session.durationMinutes} minutes • {session.feeling.toLowerCase()} relief
            </p>
          </div>
          
          {/* Ambient sound toggle */}
          {ambientSound && (
            <Button
              variant={soundEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full sm:w-auto"
            >
              {soundEnabled ? (
                <>
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sound On
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Nature Sounds
                </>
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Primary content (video or music) */}
      {primaryContent && (
        <Card className="overflow-hidden p-0">
          <MediaPlayer item={primaryContent} />
        </Card>
      )}

      {/* Background image */}
      {backgroundImage && <BackgroundImage item={backgroundImage} />}

      {/* Breathing animation */}
      <Card>
        <BreathingAnimation />
      </Card>

      {/* Text prompts */}
      {textPrompts.length > 0 && (
        <div className="space-y-3">
          {textPrompts.map((prompt) => (
            <TextPrompt key={prompt.id} item={prompt} />
          ))}
        </div>
      )}

      {/* Hidden audio element for ambient sound */}
      {ambientSound && soundEnabled && ambientSound.url && (
        <audio autoPlay loop src={ambientSound.url} className="hidden">
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

