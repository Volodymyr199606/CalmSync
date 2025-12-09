'use client';

/**
 * DashboardClient - Client component for dashboard state management
 * Manages experience state and coordinates between form and view
 * Implements responsive layout: single-column on mobile, two-column on md+
 */

import { useState } from 'react';
import { MoodCheckInForm } from '@/components/mood/MoodCheckInForm';
import { ExperienceView } from '@/components/experience/ExperienceView';
import type { RelaxationSession, SessionItem } from '@/types/domain';

interface DashboardClientProps {
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  initialSession: RelaxationSession | null;
  initialItems: SessionItem[];
}

export function DashboardClient({
  user,
  initialSession,
  initialItems,
}: DashboardClientProps) {
  // Start with null session - only show experience after user submits check-in
  const [currentSession, setCurrentSession] = useState<RelaxationSession | null>(null);
  const [currentItems, setCurrentItems] = useState<SessionItem[]>([]);

  const handleExperienceGenerated = (data: {
    session: RelaxationSession;
    items: SessionItem[];
  }) => {
    setCurrentSession(data.session);
    setCurrentItems(data.items);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 bg-gradient-to-b from-white to-slate-50 min-h-screen">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back{user.name ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Take a moment to check in with yourself
        </p>
      </div>

      {/* Responsive layout: single-column on mobile, two-column on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8">
        {/* Mood Check-In Form */}
        <div className="md:sticky md:top-8 md:self-start">
          <MoodCheckInForm onExperienceGenerated={handleExperienceGenerated} />
        </div>

        {/* Experience View - Only render if session exists */}
        {currentSession ? (
          <div>
            <ExperienceView session={currentSession} items={currentItems} />
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </div>
  );
}

