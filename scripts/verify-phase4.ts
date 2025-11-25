/**
 * Phase 4 Verification Script
 * Validates that React UI components are properly implemented
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail';
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, message: string): void {
  results.push({
    name,
    status: condition ? 'pass' : 'fail',
    message,
  });
}

console.log('🔍 Verifying Phase 4: React UI\n');

// Check 1: AppShell layout component
try {
  const appShellPath = join(process.cwd(), 'components', 'layout', 'AppShell.tsx');
  const appShellContent = readFileSync(appShellPath, 'utf-8');
  
  check(
    'AppShell - Component exists',
    true,
    'AppShell layout component exists'
  );
  
  check(
    'AppShell - Navigation',
    appShellContent.includes('Navigation') && appShellContent.includes('Link'),
    'AppShell has navigation with links'
  );
  
  check(
    'AppShell - User menu',
    appShellContent.includes('UserMenu') && appShellContent.includes('signOut'),
    'AppShell has user menu with sign out'
  );
  
  check(
    'AppShell - Gradient background',
    appShellContent.includes('bg-gradient') || appShellContent.includes('gradient'),
    'AppShell has warm gradient background'
  );
  
  check(
    'AppShell - Responsive',
    appShellContent.includes('sm:') || appShellContent.includes('md:'),
    'AppShell uses responsive design classes'
  );
} catch {
  check('AppShell', false, 'components/layout/AppShell.tsx not found');
}

// Check 2: Dashboard layout wrapper
try {
  const dashLayoutPath = join(process.cwd(), 'app', 'dashboard', 'layout.tsx');
  const dashLayoutContent = readFileSync(dashLayoutPath, 'utf-8');
  
  check(
    'Dashboard Layout',
    dashLayoutContent.includes('AppShell'),
    'Dashboard layout wraps pages with AppShell'
  );
} catch {
  check('Dashboard Layout', false, 'app/dashboard/layout.tsx not found');
}

// Check 3: MoodCheckInForm component
try {
  const moodFormPath = join(process.cwd(), 'components', 'mood', 'MoodCheckInForm.tsx');
  const moodFormContent = readFileSync(moodFormPath, 'utf-8');
  
  check(
    'MoodForm - Client component',
    moodFormContent.startsWith("'use client'") || moodFormContent.startsWith('"use client"'),
    'MoodCheckInForm is a client component'
  );
  
  check(
    'MoodForm - Feeling selection',
    moodFormContent.includes('feeling') && moodFormContent.includes('button'),
    'MoodCheckInForm has feeling selection buttons'
  );
  
  check(
    'MoodForm - Severity slider',
    moodFormContent.includes('Slider') && moodFormContent.includes('severity'),
    'MoodCheckInForm has severity slider'
  );
  
  check(
    'MoodForm - Optional notes',
    moodFormContent.includes('Textarea') || moodFormContent.includes('notes'),
    'MoodCheckInForm has optional notes field'
  );
  
  check(
    'MoodForm - API calls',
    moodFormContent.includes('/api/mood') && moodFormContent.includes('/api/experience'),
    'MoodCheckInForm calls both /api/mood and /api/experience'
  );
  
  check(
    'MoodForm - Loading state',
    moodFormContent.includes('isSubmitting') || moodFormContent.includes('loading'),
    'MoodCheckInForm has loading state'
  );
  
  check(
    'MoodForm - Error handling',
    moodFormContent.includes('error') && moodFormContent.includes('catch'),
    'MoodCheckInForm has error handling'
  );
} catch {
  check('MoodCheckInForm', false, 'components/mood/MoodCheckInForm.tsx not found');
}

// Check 4: ExperienceView component
try {
  const expViewPath = join(process.cwd(), 'components', 'experience', 'ExperienceView.tsx');
  const expViewContent = readFileSync(expViewPath, 'utf-8');
  
  check(
    'ExperienceView - Client component',
    expViewContent.startsWith("'use client'") || expViewContent.startsWith('"use client"'),
    'ExperienceView is a client component'
  );
  
  check(
    'ExperienceView - Media player',
    expViewContent.includes('MediaPlayer') || (expViewContent.includes('video') || expViewContent.includes('audio')),
    'ExperienceView has media player for video/music'
  );
  
  check(
    'ExperienceView - Ambient sound',
    expViewContent.includes('NATURE_SOUND') || expViewContent.includes('soundEnabled'),
    'ExperienceView has ambient sound toggle'
  );
  
  check(
    'ExperienceView - Background image',
    expViewContent.includes('IMAGE') || expViewContent.includes('BackgroundImage'),
    'ExperienceView displays background images'
  );
  
  check(
    'ExperienceView - Text prompts',
    expViewContent.includes('TEXT') || expViewContent.includes('prompt'),
    'ExperienceView displays text prompts'
  );
  
  check(
    'ExperienceView - Breathing animation',
    expViewContent.includes('BreathingAnimation') || expViewContent.includes('Breathe'),
    'ExperienceView has breathing animation'
  );
  
  check(
    'ExperienceView - Empty state',
    expViewContent.includes('EmptyState') || expViewContent.includes('no session'),
    'ExperienceView has graceful empty state'
  );
  
  check(
    'ExperienceView - Loading state',
    expViewContent.includes('LoadingState') || expViewContent.includes('loading'),
    'ExperienceView has loading state'
  );
} catch {
  check('ExperienceView', false, 'components/experience/ExperienceView.tsx not found');
}

// Check 5: Dashboard page
try {
  const dashPagePath = join(process.cwd(), 'app', 'dashboard', 'page.tsx');
  const dashPageContent = readFileSync(dashPagePath, 'utf-8');
  
  check(
    'Dashboard Page - Server component',
    !dashPageContent.startsWith("'use client'") && !dashPageContent.startsWith('"use client"'),
    'Dashboard page is a server component'
  );
  
  check(
    'Dashboard Page - Auth',
    dashPageContent.includes('auth()'),
    'Dashboard page authenticates user'
  );
  
  check(
    'Dashboard Page - Load user',
    dashPageContent.includes('prisma.user.findUnique'),
    'Dashboard page loads user from database'
  );
  
  check(
    'Dashboard Page - Load session',
    dashPageContent.includes('relaxationSession') || dashPageContent.includes('lastSession'),
    'Dashboard page optionally loads last session'
  );
} catch {
  check('Dashboard Page', false, 'app/dashboard/page.tsx not found');
}

// Check 6: DashboardClient component
try {
  const dashClientPath = join(process.cwd(), 'app', 'dashboard', 'DashboardClient.tsx');
  const dashClientContent = readFileSync(dashClientPath, 'utf-8');
  
  check(
    'DashboardClient - Client component',
    dashClientContent.startsWith("'use client'") || dashClientContent.startsWith('"use client"'),
    'DashboardClient is a client component'
  );
  
  check(
    'DashboardClient - Renders both components',
    dashClientContent.includes('MoodCheckInForm') && dashClientContent.includes('ExperienceView'),
    'DashboardClient renders both MoodCheckInForm and ExperienceView'
  );
  
  check(
    'DashboardClient - Responsive layout',
    dashClientContent.includes('grid') && (dashClientContent.includes('md:grid-cols-2') || dashClientContent.includes('md:')),
    'DashboardClient uses responsive grid layout (single-column mobile, two-column md+)'
  );
} catch {
  check('DashboardClient', false, 'app/dashboard/DashboardClient.tsx not found');
}

// Print results
console.log('Results:');
console.log('--------');

let passCount = 0;
let failCount = 0;

results.forEach(result => {
  const icon = result.status === 'pass' ? '✅' : '❌';
  console.log(`${icon} ${result.name}`);
  if (result.status === 'pass') {
    passCount++;
  } else {
    failCount++;
    console.log(`   ${result.message}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Total: ${passCount} passed, ${failCount} failed`);
console.log('='.repeat(50));

if (failCount > 0) {
  console.log('\n❌ Phase 4 verification failed!');
  process.exit(1);
} else {
  console.log('\n✅ Phase 4 verification passed!');
  console.log('\nReact UI Summary:');
  console.log('- AppShell layout with navigation and gradient background');
  console.log('- Dashboard layout wrapper');
  console.log('- MoodCheckInForm with feeling buttons, slider, and API integration');
  console.log('- ExperienceView with media player, animations, and graceful states');
  console.log('- Dashboard page with server-side data loading');
  console.log('- Fully responsive design (mobile-first, single-column → two-column)');
  process.exit(0);
}

