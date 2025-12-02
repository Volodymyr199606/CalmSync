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
  const [currentSession, setCurrentSession] = useState<RelaxationSession | null>(
    initialSession
  );
  const [currentItems, setCurrentItems] = useState<SessionItem[]>(initialItems);

  const handleExperienceGenerated = (data: {
    session: RelaxationSession;
    items: SessionItem[];
  }) => {
    setCurrentSession(data.session);
    setCurrentItems(data.items);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
          Welcome back{user.name ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm md:text-base">
          Take a moment to check in with yourself
        </p>
      </div>

      {/* Responsive layout: single-column on mobile, two-column on md+ */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Mood Check-In Form */}
        <div className="md:sticky md:top-20 md:self-start">
          <MoodCheckInForm onExperienceGenerated={handleExperienceGenerated} />
        </div>

        {/* Experience View */}
        <div>
          <ExperienceView session={currentSession} items={currentItems} />
        </div>
      </div>
    </div>
  );
}

