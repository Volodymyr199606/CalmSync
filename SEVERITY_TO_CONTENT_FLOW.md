# Severity-to-Content Flow Documentation

## Current Implementation ✅

Your app **already implements** the severity-based content routing! Here's how it works:

---

## 🎯 Current Behavior

### Content Selection Logic

Based on the severity level selected, the app automatically routes to:

**High Severity (7-10)**: → **Nature Videos** 🌿
- Peaceful nature scenes (ocean, forest, mountains)
- Includes breathing animation
- Ambient nature sounds
- Grounding text prompts
- Longer session duration (7-10 minutes)

**Low-Medium Severity (1-6)**: → **Lo-Fi Music** 🎵
- Calming music tracks
- Text prompts (no breathing animation for very low severity)
- Shorter session duration (3-5 minutes)

**Threshold**: Severity >= 7 = Nature Video, < 7 = Music

---

## 📍 Where It's Implemented

### 1. Relaxation Engine (`lib/relaxation-engine.ts`)

```typescript
// Line 36: Decision logic
const primaryType = severity >= 7 ? "NATURE_VIDEO" : "MUSIC";
```

### 2. Current Flow

1. User selects feeling (Stress/Anxiety/Depression/Frustration)
2. User sets severity (1-10 slider)
3. User submits form
4. **Backend generates experience** based on severity:
   - High (7-10) → Nature video experience
   - Low (1-6) → Lo-fi music experience
5. Experience appears in ExperienceView (same page, right column on desktop)

---

## 💡 Suggested UX Improvements

While the functionality works, here are enhancements to make the flow clearer:

### 1. **Visual Feedback During Selection**

**Current**: User selects severity without knowing what they'll get  
**Improved**: Show preview/hint as they adjust severity

```tsx
// Show what content type they'll receive
{severity >= 7 ? (
  <div className="text-sm text-purple-600">
    🌿 You'll receive a nature video experience
  </div>
) : (
  <div className="text-sm text-blue-600">
    🎵 You'll receive peaceful lo-fi music
  </div>
)}
```

### 2. **Auto-Scroll to Experience** (Mobile)

**Current**: Experience appears but user might miss it  
**Improved**: Smooth scroll to experience view on mobile

```tsx
// In DashboardClient.tsx
const experienceRef = useRef<HTMLDivElement>(null);

const handleExperienceGenerated = (data) => {
  setCurrentSession(data.session);
  setCurrentItems(data.items);
  
  // Smooth scroll to experience on mobile
  if (window.innerWidth < 768 && experienceRef.current) {
    setTimeout(() => {
      experienceRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
  }
};
```

### 3. **Content Type Indicator**

**Current**: User doesn't know what type of content they're getting until it loads  
**Improved**: Show clear indicator during loading

```tsx
<LoadingState>
  <p>Preparing your {severity >= 7 ? 'nature video' : 'lo-fi music'} experience...</p>
</LoadingState>
```

### 4. **Smooth Transition Animation**

**Current**: Experience suddenly appears  
**Improved**: Fade-in animation when experience loads

```css
.experience-enter {
  animation: fade-in-up 0.6s ease-out;
}
```

### 5. **Severity-Based Preview**

Show users what they'll get before submitting:

```tsx
{selectedFeeling && (
  <div className="mt-2 p-3 rounded-lg bg-purple-50">
    <p className="text-sm">
      {severity >= 7 ? (
        <>🌿 <strong>Nature Video Experience</strong> - Peaceful visuals with guided breathing</>
      ) : severity >= 4 ? (
        <>🎵 <strong>Lo-Fi Music</strong> - Calming sounds with breathing exercises</>
      ) : (
        <>🎵 <strong>Lo-Fi Music</strong> - Gentle music for relaxation</>
      )}
    </p>
  </div>
)}
```

---

## 🎨 Recommended Enhancements

### Priority 1: Make Content Type Clear

1. **Add Content Preview in Form**
   - Show what they'll get based on current severity selection
   - Update dynamically as slider moves

2. **Visual Indicator in Experience Header**
   - Badge/icon showing "Nature Video" or "Lo-Fi Music"
   - Color-coded for quick recognition

### Priority 2: Improve Experience Reveal

3. **Auto-Scroll on Mobile**
   - Smoothly scroll to experience when generated
   - Only on mobile (desktop side-by-side layout works fine)

4. **Loading State Enhancement**
   - Show "Preparing your nature video..." or "Loading lo-fi music..."
   - More specific messaging based on severity

### Priority 3: Enhanced Feedback

5. **Smooth Animations**
   - Fade-in when experience appears
   - Highlight experience card briefly
   - Success feedback animation

---

## 🔧 Implementation Examples

### Example 1: Content Type Preview in Form

```tsx
// In MoodCheckInForm.tsx
{selectedFeeling && (
  <div className="mt-4 p-3 rounded-lg border-2 border-purple-200 bg-purple-50/50">
    <div className="flex items-center gap-2">
      {severity >= 7 ? (
        <>
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-sm font-semibold text-purple-900">
              Nature Video Experience
            </p>
            <p className="text-xs text-purple-700">
              Peaceful visuals + breathing exercises + ambient sounds
            </p>
          </div>
        </>
      ) : (
        <>
          <span className="text-2xl">🎵</span>
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Lo-Fi Music Experience
            </p>
            <p className="text-xs text-blue-700">
              Calming music{severity >= 4 ? ' + breathing exercises' : ''}
            </p>
          </div>
        </>
      )}
    </div>
  </div>
)}
```

### Example 2: Enhanced Experience Header

```tsx
// In ExperienceView.tsx
<div className="flex items-center gap-2 mb-2">
  {session.primaryContentType === 'NATURE_VIDEO' ? (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
      🌿 Nature Video
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
      🎵 Lo-Fi Music
    </span>
  )}
  <span className="text-xs text-gray-500">
    Based on your severity level ({session.severity}/10)
  </span>
</div>
```

### Example 3: Auto-Scroll on Mobile

```tsx
// In DashboardClient.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

export function DashboardClient({ user, initialSession, initialItems }) {
  const [currentSession, setCurrentSession] = useState(initialSession);
  const [currentItems, setCurrentItems] = useState(initialItems);
  const experienceRef = useRef<HTMLDivElement>(null);

  const handleExperienceGenerated = (data) => {
    setCurrentSession(data.session);
    setCurrentItems(data.items);

    // Auto-scroll to experience on mobile after a brief delay
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        experienceRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 500); // Wait for animation to complete
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ... existing code ... */}
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <MoodCheckInForm onExperienceGenerated={handleExperienceGenerated} />
        
        {/* Experience View with ref for scrolling */}
        <div ref={experienceRef}>
          <ExperienceView session={currentSession} items={currentItems} />
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 Current Severity Breakdown

| Severity Range | Content Type | Features Included |
|---------------|--------------|-------------------|
| **1-3** (Low) | 🎵 Lo-Fi Music | Music only + Text prompts |
| **4-6** (Medium) | 🎵 Lo-Fi Music | Music + Breathing (if >= 6) + Text |
| **7-10** (High) | 🌿 Nature Video | Video + Breathing + Ambient sounds + Grounding text |

---

## ✅ What's Working Well

1. ✅ **Logic is correct** - Severity properly routes to content
2. ✅ **Content library has both types** - Videos and music available
3. ✅ **Experience displays correctly** - Shows appropriate content
4. ✅ **Responsive layout** - Works on mobile and desktop

---

## 🎯 Suggested Next Steps

1. **Add Content Preview** - Show users what they'll get before submitting
2. **Auto-Scroll Enhancement** - Smooth scroll to experience on mobile
3. **Visual Indicators** - Badges/icons for content type
4. **Smoother Transitions** - Fade-in animations when experience appears
5. **Loading Messages** - More specific "Preparing..." messages

---

## 🚀 Quick Win: Content Preview Component

Want me to implement a quick preview component that shows users what content type they'll receive based on their current severity selection? This would make the flow much clearer!

---

*Last Updated: 2025-11-26*  
*Status: Functionality Complete ✅ - UX Enhancements Recommended*

