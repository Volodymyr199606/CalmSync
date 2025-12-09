# Dashboard Page - Behavior & Implementation

## Overview

The dashboard page (`/dashboard`) is the main authenticated user interface for CalmSync. It serves as the central hub where users can check in with their mood, receive personalized relaxation experiences, and engage with curated calming content.

According to the project plan, the dashboard enables users to:
- **Select feeling** (stress/anxiety/depression/frustration) and severity (1–10)
- **Generate personalized relaxation experiences** using curated, commercially-safe content
- **Engage with experiences** including music, nature videos, sounds, images, text prompts, and breathing animations

## Purpose

The dashboard page is responsible for:
1. **Mood Check-In Interface**: Allows users to express their current emotional state
2. **Experience Generation**: Creates personalized relaxation experiences based on mood input
3. **Content Display**: Presents multi-media relaxation content in an immersive interface
4. **Session Management**: Tracks and displays relaxation sessions in the database
5. **User Engagement**: Provides interactive tools (breathing animation, media players) for active relaxation

## User Flow & Behavior

### Initial Load (Server-Side Rendering)

When an authenticated user navigates to `/dashboard`:

1. **Authentication Check**:
   - Server component (`app/dashboard/page.tsx`) checks for valid session
   - If no session → Redirects to `/api/auth/signin`
   - If session exists → Proceeds to load user data

2. **User Data Loading**:
   - Fetches user from database (id, email, name)
   - If user not found → Redirects to sign-in

3. **Last Session Loading** (Optional):
   - Attempts to load most recent `RelaxationSession` for the user
   - Includes associated `SessionItem`s (content items)
   - If found → Pre-populates experience view
   - If not found or error → Starts with empty state
   - Errors are logged but don't prevent page render

4. **Initial Render**:
   - Passes user data and last session to `DashboardClient` (client component)
   - Displays welcome message with user's name (if available)

### Page Layout

The dashboard uses a **responsive layout**:

- **Mobile (< 768px)**: Single-column layout, stacked vertically
- **Desktop (≥ 768px)**: Two-column grid layout
  - Left column: Mood check-in form (sticky positioning)
  - Right column: Experience view (scrollable)

### Initial State (No Experience)

When first loaded or when no previous session exists:

1. **Welcome Header**:
   - "Welcome back, [Name]" (or "Welcome back" if no name)
   - Subtitle: "Take a moment to check in with yourself"

2. **Mood Check-In Form**:
   - Visible and ready for input
   - Four feeling options displayed as emoji buttons
   - Optional notes textarea
   - "Create Relaxation Experience" button

3. **Experience View (Empty State)**:
   - Large icon (smiley face in purple circle)
   - Heading: "Ready to relax?"
   - Message: "Complete the mood check-in form to receive your personalized relaxation experience."

### Mood Check-In Flow

When a user interacts with the mood check-in form:

#### Step 1: Feeling Selection

1. **User selects a feeling**:
   - Four options available:
     - 😰 **Stress** (red theme)
     - 😟 **Anxiety** (yellow theme)
     - 😔 **Depression** (blue theme)
     - 😤 **Frustration** (orange theme)
   - Clicking a feeling button:
     - Highlights the button with color theme
     - Adds ring effect for visual feedback
     - Clears any previous error messages

2. **Optional Notes**:
   - User can type additional context in textarea
   - Placeholder: "Add any additional context about how you're feeling..."
   - Not required for submission

#### Step 2: Form Submission

When user clicks "Create Relaxation Experience":

1. **Client-Side Validation**:
   - Checks if feeling is selected
   - If not selected → Shows error: "Please select how you're feeling"
   - Prevents submission if validation fails

2. **Loading State**:
   - Button changes to: "Generating your experience..." with spinner
   - Form inputs are disabled
   - Previous errors are cleared

3. **API Call 1: Save Mood Check-In** (`POST /api/mood`):
   - Sends: `{ feeling, severity: 5, notes? }`
   - Server validates input (Zod schema)
   - Creates `MoodCheckIn` record in database
   - Returns: `{ success: true, data: { id, ... } }`
   - If error → Displays error message, stops flow

4. **API Call 2: Generate Experience** (`POST /api/experience`):
   - Sends: `{ moodCheckInId }` (from step 1)
   - Server loads mood check-in from database
   - Calls relaxation engine with `feeling` and `severity`
   - Engine generates personalized experience
   - Creates `RelaxationSession` record
   - Creates `SessionItem` records for each content piece
   - Ensures `ContentItem` records exist (creates if needed)
   - Returns: `{ success: true, data: { session, items } }`
   - If error → Displays error message, stops flow

5. **Success State**:
   - Form resets (feeling deselected, notes cleared)
   - Button returns to normal state
   - Experience view updates with new session and items
   - `DashboardClient` updates state via `handleExperienceGenerated` callback

### Experience View States

The experience view has three main states:

#### 1. Empty State

- Shown when `session === null`
- Displays friendly message encouraging mood check-in
- No interactive elements

#### 2. Loading State (Future)

- Could be shown during experience generation
- Currently, loading is handled in the form button

#### 3. Active Experience State

When a session exists, displays content in order:

1. **Primary Content** (Video or Music):
   - **Nature Video**: Embedded iframe player (YouTube/Pexels)
     - Autoplay enabled
     - Fullscreen capable
     - Responsive aspect ratio
   - **Music**: HTML5 audio player
     - Attempts autoplay (browser-dependent)
     - Shows play button if autoplay blocked
     - Loop enabled
     - Error handling for missing files

2. **Nature Images Carousel**:
   - Pinterest-style horizontal scrolling carousel
   - Always displayed (uses defaults from Unsplash if no session images)
   - Auto-advances every 5 seconds
   - Manual navigation with previous/next buttons
   - Navigation dots for direct access
   - 6 default calming nature images:
     - Peaceful Forest
     - Calm Ocean
     - Mountain Vista
     - Blooming Garden
     - Serene Lake
     - Sunset Sky

3. **Breathing Animation**:
   - Animated circle that expands/contracts
   - 4-second inhale, 4-second exhale cycle
   - Text indicator: "Breathe In" / "Breathe Out"
   - Instruction text: "Follow the circle to regulate your breathing"
   - Visual gradient (blue to purple)

4. **Text Prompts**:
   - Calming, therapeutic text messages
   - Displayed as cards with gradient backgrounds
   - Typically 3 prompts per session
   - Content tailored to selected feeling:
     - **ANXIETY**: Breathing-focused, grounding prompts
     - **STRESS**: Actionable, perspective-shifting prompts
     - **DEPRESSION**: Hope-focused, gentle prompts
     - **FRUSTRATION**: Grounding, perspective prompts

### Experience Generation Logic

The relaxation engine (`lib/relaxation-engine.ts`) uses deterministic rules:

#### Severity-Based Content Selection

- **High Severity (8-10)**:
  - Primary: Nature Video
  - Includes: Nature video + breathing animation + ambient sound + grounding text
  - May include: Secondary music track (layered)

- **Medium Severity (4-7)**:
  - Primary: Music or Video
  - Includes: Music/video + breathing animation + text prompts
  - May include: Ambient nature sound (if severity ≥ 5)

- **Low Severity (1-3)**:
  - Primary: Music
  - Includes: Music + text prompts
  - No breathing animation

#### Feeling-Specific Adjustments

- **ANXIETY**: Focus on breathing exercises, nature videos, rhythmic sounds
- **STRESS**: Lofi music, forest sounds, actionable prompts
- **DEPRESSION**: Uplifting content, hope-focused prompts, gentle music
- **FRUSTRATION**: Grounding exercises, nature sounds, perspective prompts

#### Session Duration

Calculated based on severity:
- Higher severity → Longer suggested duration
- Typically 10-30 minutes

### Responsive Behavior

#### Mobile (< 768px)

- **Layout**: Single-column, stacked
- **Form**: Full width, not sticky
- **Experience View**: Full width, below form
- **Images**: Smaller carousel, touch-friendly navigation
- **Buttons**: Full-width, larger touch targets
- **Typography**: Responsive font sizes (xs/sm)

#### Desktop (≥ 768px)

- **Layout**: Two-column grid
- **Form**: Left column, sticky (stays visible while scrolling)
- **Experience View**: Right column, scrollable
- **Images**: Larger carousel with hover effects
- **Buttons**: Standard width, compact
- **Typography**: Larger font sizes (base/lg)

### Error Handling

1. **Form Validation Errors**:
   - Displayed in red error box above submit button
   - Client-side: "Please select how you're feeling"
   - Server-side: API error messages passed through

2. **API Errors**:
   - Caught and displayed in form error area
   - User-friendly messages (e.g., "Failed to save mood check-in")
   - Detailed errors logged server-side for debugging

3. **Media Loading Errors**:
   - Audio files: Error message shown if file not found
   - Video embeds: Browser handles iframe errors
   - Images: Fallback to default Unsplash images

4. **Session Loading Errors**:
   - Logged but don't prevent page render
   - User sees empty state instead of last session

### Data Flow

```
User Input
    ↓
MoodCheckInForm (Client)
    ↓
POST /api/mood (Server Action)
    ↓
MoodCheckIn created in DB
    ↓
POST /api/experience (Server Action)
    ↓
Relaxation Engine generates content
    ↓
RelaxationSession + SessionItems created in DB
    ↓
Response with session + items
    ↓
DashboardClient updates state
    ↓
ExperienceView renders content
```

## Technical Implementation

### Component Architecture

```
app/dashboard/page.tsx (Server Component)
├── Authenticates user
├── Loads user data
├── Loads last session (optional)
└── Renders DashboardClient

app/dashboard/DashboardClient.tsx (Client Component)
├── Manages experience state
├── Coordinates form and view
└── Handles responsive layout

components/mood/MoodCheckInForm.tsx (Client Component)
├── Feeling selection UI
├── Form submission logic
└── API calls to /api/mood and /api/experience

components/experience/ExperienceView.tsx (Client Component)
├── EmptyState
├── MediaPlayer (Music/Video)
├── NatureImagesCarousel
├── BreathingAnimation
└── TextPrompt
```

### Key Files

1. **`app/dashboard/page.tsx`**:
   - Server component for data fetching
   - Authentication and authorization
   - Database queries for user and sessions
   - Error handling with redirects

2. **`app/dashboard/DashboardClient.tsx`**:
   - Client component wrapper
   - State management for current session/items
   - Responsive layout grid
   - Callback handlers

3. **`components/mood/MoodCheckInForm.tsx`**:
   - Form UI with feeling buttons
   - Client-side validation
   - Sequential API calls (mood → experience)
   - Loading and error states

4. **`components/experience/ExperienceView.tsx`**:
   - Content rendering components
   - Media players with autoplay logic
   - Interactive carousel
   - Breathing animation with state management

5. **`app/api/mood/route.ts`**:
   - POST endpoint for mood check-ins
   - Validation (Zod schema)
   - Database insertion
   - Error handling and logging

6. **`app/api/experience/route.ts`**:
   - POST endpoint for experience generation
   - Calls relaxation engine
   - Creates session and items in database
   - Content library integration

7. **`lib/relaxation-engine.ts`**:
   - Deterministic experience generation
   - Content selection algorithms
   - Severity and feeling-based rules

8. **`lib/content-library.ts`**:
   - Curated content repository
   - Feeling-specific content retrieval
   - Commercial-safe content sources

### State Management

- **Server State**: User data, last session (loaded on page load)
- **Client State**: Current session, current items (updated after form submission)
- **Form State**: Selected feeling, notes, loading, errors (local to form component)
- **Media State**: Play/pause, loading errors (local to media components)

### Database Schema

- **User**: Basic user information
- **MoodCheckIn**: User's mood input (feeling, severity, notes, timestamp)
- **RelaxationSession**: Generated session (linked to mood check-in, duration, content type)
- **SessionItem**: Individual content pieces in a session (ordered, linked to ContentItem)
- **ContentItem**: Reusable content library items (music, videos, sounds, images, text)

### API Endpoints

1. **POST `/api/mood`**:
   - Input: `{ feeling: Feeling, severity: number, notes?: string }`
   - Output: `{ success: boolean, data: MoodCheckIn }`
   - Creates mood check-in record

2. **POST `/api/experience`**:
   - Input: `{ moodCheckInId: string }` OR `{ feeling: Feeling, severity: number }`
   - Output: `{ success: boolean, data: { session: RelaxationSession, items: SessionItem[] } }`
   - Generates and saves relaxation experience

## Project Requirements Compliance

✅ **Mood Selection**: Users select feeling (stress/anxiety/depression/frustration) and severity  
✅ **Experience Generation**: Backend generates relaxation experience based on mood  
✅ **Curated Content**: Uses commercially-safe content sources (music, videos, sounds, images, text)  
✅ **Multi-Media Experience**: Includes primary content, nature sounds, text prompts, breathing animation  
✅ **Database Persistence**: Saves mood check-ins and relaxation sessions  
✅ **Responsive Design**: Mobile-first, single-column on mobile, two-column on desktop  
✅ **Authentication Required**: Protected route, redirects unauthenticated users  
✅ **Server Components**: Uses Next.js App Router patterns (server + client components)  
✅ **Type Safety**: Strong TypeScript typing throughout  
✅ **Error Handling**: Comprehensive error handling with user-friendly messages  

## UI/UX Design Principles

1. **Calming Aesthetic**: Soft colors, rounded corners, gentle animations
2. **Clear Hierarchy**: Welcome header → Form → Experience
3. **Progressive Disclosure**: Experience appears after form submission
4. **Immersive Content**: Full-width media, carousel images, breathing animation
5. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
6. **Responsive**: Adapts seamlessly from mobile to desktop
7. **Feedback**: Loading states, error messages, visual selections
8. **Engagement**: Interactive elements (breathing, carousel, media controls)

## Testing Coverage

E2E tests (Cypress) verify:
- Dashboard loads for authenticated users
- Mood check-in form submission
- Experience generation and display
- Empty, loading, and populated states
- Responsive layout (mobile and desktop)
- Redirect behavior for unauthenticated users

## Future Considerations

- **Severity Selection**: Allow users to choose severity 1-10 (currently defaults to 5)
- **Session History**: View past relaxation sessions
- **Experience Customization**: Allow users to modify generated experiences
- **Progress Tracking**: Track session completion and effectiveness
- **Personalization**: Learn from user preferences over time
- **Social Features**: Share experiences (with privacy controls)
- **Analytics**: Track which content types are most effective for each feeling
