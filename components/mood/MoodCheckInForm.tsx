'use client';

/**
 * MoodCheckInForm - Client component for mood check-in
 * Allows user to select feeling and optional notes
 * Submits to /api/mood then fetches experience from /api/experience
 */

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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
  const [severity, setSeverity] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setSeverity(5);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              How are you feeling?
            </h2>
            <p className="text-sm text-slate-500">
              Share your current state, and we&apos;ll create a personalized relaxation experience.
            </p>
          </div>

          {/* Feeling selection buttons - 2x2 grid */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Select your feeling
            </label>
            <div className="grid grid-cols-2 gap-3">
            {feelings.map((feeling) => (
              <button
                key={feeling.value}
                type="button"
                onClick={() => handleFeelingSelect(feeling.value)}
                className={`
                  flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-3 hover:bg-purple-50 hover:border-purple-300 text-sm font-medium transition
                  ${selectedFeeling === feeling.value 
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 text-purple-700' 
                    : 'text-slate-700'
                  }
                `}
              >
                <span className="text-2xl">{feeling.emoji}</span>
                <span>{feeling.label}</span>
              </button>
            ))}
            </div>
          </div>

          {/* Intensity selector */}
          <div className="space-y-3 mt-6">
            <p className="text-sm font-medium text-slate-700">Intensity</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => {
                  const value = i + 1;
                  const isActive = value === severity;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSeverity(value)}
                      disabled={isSubmitting}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                        isActive
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-slate-500">{severity}/10</span>
            </div>
          </div>

          {/* Optional notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Notes (optional)
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional context about how you're feeling..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-300 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-xl p-3 bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-purple-600 text-white font-medium py-3 mt-6 hover:bg-purple-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
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
                <span>Generating your experience...</span>
              </span>
            ) : (
              'Create Relaxation Experience'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

