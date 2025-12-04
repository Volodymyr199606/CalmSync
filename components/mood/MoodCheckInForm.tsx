'use client';

/**
 * MoodCheckInForm - Client component for mood check-in
 * Allows user to select feeling and optional notes
 * Submits to /api/mood then fetches experience from /api/experience
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import type { Feeling } from '@/types/domain';

interface MoodCheckInFormProps {
  onExperienceGenerated?: (data: any) => void;
}

const feelings: Array<{
  value: Feeling;
  label: string;
  emoji: string;
  color: string;
}> = [
  { value: 'STRESS', label: 'Stress', emoji: '😰', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { value: 'ANXIETY', label: 'Anxiety', emoji: '😟', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { value: 'DEPRESSION', label: 'Depression', emoji: '😔', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { value: 'FRUSTRATION', label: 'Frustration', emoji: '😤', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
];

export function MoodCheckInForm({ onExperienceGenerated }: MoodCheckInFormProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default severity value (backend requires it)
  const severity = 5;

  const handleFeelingSelect = (feeling: Feeling) => {
    setSelectedFeeling(feeling);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFeeling) {
      setError('Please select how you\'re feeling');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Submit mood check-in
      const moodResponse = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeling: selectedFeeling,
          severity,
          notes: notes.trim() || undefined,
        }),
      });

      if (!moodResponse.ok) {
        const errorData = await moodResponse.json();
        throw new Error(errorData.error || 'Failed to save mood check-in');
      }

      const moodData = await moodResponse.json();

      // Step 2: Generate relaxation experience
      const experienceResponse = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodCheckInId: moodData.data.id,
        }),
      });

      if (!experienceResponse.ok) {
        const errorData = await experienceResponse.json();
        throw new Error(errorData.error || 'Failed to generate experience');
      }

      const experienceData = await experienceResponse.json();

      // Notify parent component
      if (onExperienceGenerated) {
        onExperienceGenerated(experienceData.data);
      }

      // Reset form
      setSelectedFeeling(null);
      setNotes('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold sm:text-2xl" style={{ color: 'rgb(17, 24, 39)' }}>
            How are you feeling?
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'rgb(75, 85, 99)' }}>
            Share your current state, and we&apos;ll create a personalized relaxation experience.
          </p>
        </div>

        {/* Feeling selection buttons */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: 'rgb(55, 65, 81)' }}>
            Select your feeling
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {feelings.map((feeling) => (
              <button
                key={feeling.value}
                type="button"
                onClick={() => handleFeelingSelect(feeling.value)}
                style={{
                  backgroundColor: selectedFeeling === feeling.value ? undefined : 'white',
                  borderColor: selectedFeeling === feeling.value ? undefined : 'rgb(229, 231, 235)',
                }}
                className={`
                  flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all sm:p-4
                  ${selectedFeeling === feeling.value 
                    ? `${feeling.color} ring-2 ring-offset-2 ring-gray-900` 
                    : 'hover:border-gray-300'
                  }
                `}
              >
                <span className="text-2xl sm:text-3xl">{feeling.emoji}</span>
                <span className="mt-2 text-xs font-medium sm:text-sm" style={{ color: 'rgb(17, 24, 39)' }}>
                  {feeling.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium" style={{ color: 'rgb(55, 65, 81)' }}>
            Notes (optional)
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional context about how you're feeling..."
            rows={3}
            className="w-full resize-none bg-white"
            disabled={isSubmitting}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-md p-3 sm:p-4" style={{ backgroundColor: 'rgb(254, 242, 242)' }}>
            <p className="text-sm" style={{ color: 'rgb(153, 27, 27)' }}>{error}</p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-sm sm:text-base text-white"
          style={{
            backgroundColor: 'rgb(147, 51, 234)',
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
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
              <span className="text-xs sm:text-sm">Generating your experience...</span>
            </span>
          ) : (
            'Create Relaxation Experience'
          )}
        </Button>
      </form>
    </Card>
  );
}

