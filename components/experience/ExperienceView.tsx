'use client';

/**
 * ExperienceView - Displays the generated relaxation experience
 * Includes video/music player, ambient sounds, prompts, and breathing animation
 */

import { useState, useEffect, useRef } from 'react';
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
    <div className="flex flex-col items-center justify-center space-y-4 py-6">
      <div className="relative flex h-40 w-40 items-center justify-center md:h-48 md:w-48">
        {/* Animated circle */}
        <div
          className={`
            h-40 w-40 md:h-48 md:w-48 rounded-full bg-gradient-to-br from-sky-300/70 via-purple-400/70 to-violet-400/70 shadow-lg ring-4 ring-white/50 transition-transform duration-[4000ms] ease-in-out
            ${isInhaling ? 'scale-100' : 'scale-50'}
          `}
        />
        {/* Center text */}
        <span className="absolute z-10 text-xl font-semibold text-slate-800">
          {isInhaling ? 'Breathe In' : 'Breathe Out'}
        </span>
      </div>
      <p className="text-sm text-slate-600 text-center">
        Follow the circle to regulate your breathing
      </p>
    </div>
  );
}

/**
 * Music player component with autoplay
 */
function MusicPlayer({ item }: { item: SessionItem }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  // Attempt autoplay when component mounts (after form submission = user interaction)
  useEffect(() => {
    if (audioRef.current && !hasAttemptedPlay && item.url) {
      setHasAttemptedPlay(true);
      
      const audio = audioRef.current;
      
      // First, verify the file can be loaded
      const checkFile = async () => {
        if (!item.url) return;
        try {
          const response = await fetch(item.url, { method: 'HEAD' });
          if (!response.ok) {
            setError(`Audio file not found: ${item.url}. Please check that the file exists in public/audio/`);
            return;
          }
        } catch (err) {
          console.warn('Could not verify file, but will try to load anyway:', err);
        }
      };
      
      checkFile();
      
      const tryPlay = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
          setError(null);
          setShowPlayButton(false);
        } catch (err) {
          // Autoplay blocked - show play button
          console.log('Autoplay prevented, showing play button');
          setShowPlayButton(true);
          setError(null); // Don't show error, just show play button
        }
      };

      // Wait for audio to be ready
      if (audio.readyState >= 2) {
        tryPlay();
      } else {
        // Set a timeout to detect if audio never loads
        const loadTimeout = setTimeout(() => {
          if (audio.readyState === 0) {
            console.error('Audio failed to load:', item.url);
            setError(`Audio file not loading: ${item.url}. Make sure the file exists and restart your dev server.`);
          }
        }, 5000);

        audio.addEventListener('canplay', () => {
          clearTimeout(loadTimeout);
          tryPlay();
        }, { once: true });
        
        audio.addEventListener('error', (e) => {
          clearTimeout(loadTimeout);
          const error = audio.error;
          let errorMsg = `Unable to load audio: ${item.url}`;
          if (error) {
            if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
              errorMsg += ' (File format not supported)';
            } else if (error.code === MediaError.MEDIA_ERR_NETWORK) {
              errorMsg += ' (Network error - check file path)';
            } else if (error.code === MediaError.MEDIA_ERR_DECODE) {
              errorMsg += ' (File corrupted or invalid)';
            }
          }
          console.error('Audio error:', error, 'URL:', item.url);
          setError(errorMsg + '. Please check that the file exists in public/audio/ and restart your dev server.');
        }, { once: true });
      }

      // Track playing state
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false));
    }
  }, [hasAttemptedPlay, item.url]);

  const handlePlayClick = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setShowPlayButton(false);
        setIsPlaying(true);
      } catch (err) {
        setError('Unable to play audio. Please check your browser settings.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
          <audio 
            ref={audioRef}
            controls 
            autoPlay
            loop
            preload="auto"
            className="w-full" 
            src={item.url || undefined}
            onError={(e) => {
              console.error('Audio element error:', e);
              setError('Failed to load audio file. Please check the file path and format.');
            }}
          >
            Your browser does not support the audio element.
          </audio>

          {error && (
            <div className="space-y-1">
              <p className="text-xs text-center" style={{ color: 'rgb(153, 27, 27)' }}>
                {error}
              </p>
              {error.includes('placeholder') && (
                <p className="text-xs text-center" style={{ color: 'rgb(75, 85, 99)' }}>
                  Download real music from <a href="https://freepd.com" target="_blank" rel="noopener noreferrer" className="underline">FreePD.com</a> or <a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" className="underline">Pixabay</a> and place in <code className="text-xs bg-gray-100 px-1 rounded">public/audio/</code>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
  );
}

/**
 * Media player component for video or music
 */
function MediaPlayer({ item }: { item: SessionItem }) {
  if (item.contentType === 'NATURE_VIDEO' && item.url) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
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
      <div className="space-y-2">
        {item.title && (
          <h3 className="text-sm font-medium text-slate-700">{item.title}</h3>
        )}
        <MusicPlayer item={item} />
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
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 text-sm text-slate-700">
      <div className="space-y-2">
        {item.title && (
          <h3 className="font-semibold text-slate-900">
            {item.title}
          </h3>
        )}
        {item.description && (
          <p className="leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Pinterest-style nature images carousel
 * Displays multiple calming nature images in a horizontal scrollable carousel
 * Always shows calming nature images to enhance the relaxation experience
 */
function NatureImagesCarousel({ images, feeling }: { images: SessionItem[]; feeling: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default calming nature images - always show these for inspiration
  // Using higher resolution images for better quality
  const defaultNatureImages = [
    {
      id: 'default-1',
      title: 'Peaceful Forest',
      description: 'Tranquil forest path surrounded by greenery',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&fit=crop',
    },
    {
      id: 'default-2',
      title: 'Calm Ocean',
      description: 'Gentle waves on a serene beach',
      url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=85&fit=crop',
    },
    {
      id: 'default-3',
      title: 'Mountain Vista',
      description: 'Majestic mountains under clear skies',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85&fit=crop',
    },
    {
      id: 'default-4',
      title: 'Blooming Garden',
      description: 'Beautiful flowers in a peaceful garden',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85&fit=crop',
    },
    {
      id: 'default-5',
      title: 'Serene Lake',
      description: 'Still waters reflecting the sky',
      url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=85&fit=crop',
    },
    {
      id: 'default-6',
      title: 'Sunset Sky',
      description: 'Peaceful evening colors',
      url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=85&fit=crop',
    },
  ];

  // Use session images if available, otherwise use default images
  const displayImages = images.length > 0 
    ? images.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        url: getImageUrlFromItem(item),
      }))
    : defaultNatureImages;

  // Get image URL from session item or use Unsplash defaults
  function getImageUrlFromItem(item: SessionItem): string {
    // If item has a valid image URL, use it
    if (item.url && item.url.startsWith('http')) {
      return item.url;
    }
    // Otherwise use Unsplash images based on feeling (higher resolution for better quality)
    const unsplashImages = [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&fit=crop', // Forest
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=85&fit=crop', // Ocean
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85&fit=crop', // Mountains
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85&fit=crop', // Garden
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=85&fit=crop', // Flowers
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=85&fit=crop', // Lake
    ];
    return unsplashImages[images.indexOf(item) % unsplashImages.length] || unsplashImages[0];
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <div className="space-y-4 w-full">
      {/* Carousel container */}
      <div className="relative w-full overflow-hidden rounded-2xl">
        {/* Images container with translateX */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className="w-full flex-shrink-0"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading={index === currentIndex ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <p className="text-base md:text-lg font-semibold text-white">
                    {image.title}
                  </p>
                  {image.description && (
                    <p className="text-sm text-white/90 mt-1">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous/Next navigation buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md rounded-full p-2 hover:bg-white transition-all"
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md rounded-full p-2 hover:bg-white transition-all"
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Navigation dots */}
        {displayImages.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-purple-500'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Empty state when no experience is loaded
 */
function EmptyState() {
  return (
    <Card className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center sm:p-8 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
      <div 
        className="flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20" 
        style={{ backgroundColor: 'rgb(243, 232, 255)' }}
      >
        <svg
          className="h-8 w-8 sm:h-10 sm:w-10"
          style={{ color: 'rgb(147, 51, 234)' }}
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
      <h3 className="mt-4 text-lg font-semibold sm:text-xl" style={{ color: 'rgb(17, 24, 39)' }}>
        Ready to relax?
      </h3>
      <p className="mt-2 max-w-sm text-sm sm:text-base" style={{ color: 'rgb(75, 85, 99)' }}>
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
    <Card className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center sm:p-8 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
      <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
        <svg
          className="h-12 w-12 animate-spin sm:h-14 sm:w-14"
          style={{ color: 'rgb(147, 51, 234)' }}
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
      <h3 className="mt-4 text-lg font-semibold sm:text-xl" style={{ color: 'rgb(17, 24, 39)' }}>
        Creating your experience...
      </h3>
      <p className="mt-2 text-sm sm:text-base" style={{ color: 'rgb(75, 85, 99)' }}>
        Curating the perfect relaxation content for you
      </p>
    </Card>
  );
}

/**
 * Main ExperienceView component
 */
export function ExperienceView({ session, items }: ExperienceViewProps) {
  // Guard: return null if no session (experience should only render after check-in)
  if (!session) {
    return null;
  }

  // Find different content types
  const primaryContent = items.find(
    (item) => item.contentType === 'NATURE_VIDEO' || item.contentType === 'MUSIC'
  );
  const ambientSound = items.find((item) => item.contentType === 'NATURE_SOUND');
  const backgroundImages = items.filter((item) => item.contentType === 'IMAGE');
  const textPrompts = items.filter((item) => item.contentType === 'TEXT');

  return (
    <div className="space-y-6">
      {/* Experience header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Your Personalized Experience</h2>
        <p className="mt-1 text-sm text-slate-500">
          Curated just for you based on your current state
        </p>
      </div>

      {/* Primary content (video or music) */}
      {primaryContent && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <MediaPlayer item={primaryContent} />
        </div>
      )}

      {/* Nature images carousel */}
      {backgroundImages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <NatureImagesCarousel images={backgroundImages} feeling={session.feeling} />
        </div>
      )}

      {/* Breathing animation */}
      <div className="bg-gradient-to-br from-sky-50 to-violet-50 rounded-2xl shadow-sm border border-slate-200 p-6">
        <BreathingAnimation />
      </div>

      {/* Text prompts */}
      {textPrompts.length > 0 && (
        <div className="space-y-4">
          {textPrompts.map((prompt) => (
            <TextPrompt key={prompt.id} item={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}

