'use client';

/**
 * MoodCheckInForm - Client component for mood check-in
 * Allows user to select feeling, severity, and optional notes
 * Submits to /api/mood then fetches experience from /api/experience
 */

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  const [severity, setSeverity] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intensityLabelId = useId();

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
      setSeverity(5);
      setNotes('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            How are you feeling?
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Share your current state, and we&apos;ll create a personalized relaxation experience.
          </p>
        </div>

        {/* Feeling selection buttons */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select your feeling
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {feelings.map((feeling) => (
              <button
                key={feeling.value}
                type="button"
                onClick={() => handleFeelingSelect(feeling.value)}
                className={`
                  flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all sm:p-4
                  ${selectedFeeling === feeling.value 
                    ? `${feeling.color} ring-2 ring-offset-2 ring-gray-900` 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <span className="text-2xl sm:text-3xl">{feeling.emoji}</span>
                <span className="mt-2 text-xs font-medium text-gray-900 sm:text-sm">
                  {feeling.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label id={intensityLabelId} className="block text-sm font-medium text-gray-700">
              Intensity level
            </label>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900">
              {severity}/10
            </span>
          </div>
          <Slider
            aria-label="Intensity level"
            aria-labelledby={intensityLabelId}
            value={[severity]}
            onValueChange={(values) => setSeverity(values[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        {/* Optional notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional context about how you're feeling..."
            rows={3}
            className="w-full resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-md bg-red-50 p-3 sm:p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
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
              Generating your experience...
            </span>
          ) : (
            'Create Relaxation Experience'
          )}
        </Button>
      </form>
    </Card>
  );
}

