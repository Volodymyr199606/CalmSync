/**
 * Phase 3 Verification Script
 * Validates that API endpoints are properly structured and typed
 */

import { readFileSync } from 'fs';
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

console.log('🔍 Verifying Phase 3: API Layer\n');

// Check 1: Logger utility exists
try {
  const loggerPath = join(process.cwd(), 'lib', 'logger.ts');
  const loggerContent = readFileSync(loggerPath, 'utf-8');
  
  check(
    'Logger utility',
    loggerContent.includes('export const logger') && 
    loggerContent.includes('extractErrorInfo'),
    'Logger utility with structured logging exists'
  );
} catch {
  check('Logger utility', false, 'lib/logger.ts not found');
}

// Check 2: POST /api/mood endpoint
try {
  const moodPath = join(process.cwd(), 'app', 'api', 'mood', 'route.ts');
  const moodContent = readFileSync(moodPath, 'utf-8');
  
  check(
    'Mood API - Auth',
    moodContent.includes('auth()') || moodContent.includes('getServerSession'),
    'Mood endpoint requires authentication'
  );
  
  check(
    'Mood API - Validation',
    moodContent.includes('moodCheckInSchema') && moodContent.includes('safeParse'),
    'Mood endpoint validates input with zod'
  );
  
  check(
    'Mood API - Database',
    moodContent.includes('prisma.moodCheckIn.create'),
    'Mood endpoint creates MoodCheckIn in database'
  );
  
  check(
    'Mood API - Typed Response',
    moodContent.includes('MoodCheckInResponse') || moodContent.includes('ApiResponse'),
    'Mood endpoint returns typed response'
  );
  
  check(
    'Mood API - Error Handling',
    moodContent.includes('logger.error') && moodContent.includes('catch'),
    'Mood endpoint has error handling and logging'
  );
} catch {
  check('Mood API', false, 'app/api/mood/route.ts not found');
}

// Check 3: POST /api/experience endpoint
try {
  const expPath = join(process.cwd(), 'app', 'api', 'experience', 'route.ts');
  const expContent = readFileSync(expPath, 'utf-8');
  
  check(
    'Experience API - Auth',
    expContent.includes('auth()') || expContent.includes('getServerSession'),
    'Experience endpoint requires authentication'
  );
  
  check(
    'Experience API - Validation',
    expContent.includes('experienceRequestSchema') && 
    expContent.includes('moodCheckInId') &&
    expContent.includes('feeling'),
    'Experience endpoint accepts both moodCheckInId and feeling/severity'
  );
  
  check(
    'Experience API - Mood Loading',
    expContent.includes('prisma.moodCheckIn.findUnique'),
    'Experience endpoint loads mood from database when ID provided'
  );
  
  check(
    'Experience API - Relaxation Engine',
    expContent.includes('generateRelaxationExperience'),
    'Experience endpoint calls relaxation engine'
  );
  
  check(
    'Experience API - Session Creation',
    expContent.includes('prisma.relaxationSession.create') &&
    expContent.includes('prisma.sessionItem.createMany'),
    'Experience endpoint creates RelaxationSession and SessionItems'
  );
  
  check(
    'Experience API - Typed Response',
    expContent.includes('ExperienceResponse') && 
    expContent.includes('session:') &&
    expContent.includes('items:'),
    'Experience endpoint returns structured response with session and items'
  );
  
  check(
    'Experience API - Error Handling',
    expContent.includes('logger.error') && expContent.includes('catch'),
    'Experience endpoint has error handling and logging'
  );
} catch {
  check('Experience API', false, 'app/api/experience/route.ts not found');
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
  console.log('\n❌ Phase 3 verification failed!');
  process.exit(1);
} else {
  console.log('\n✅ Phase 3 verification passed!');
  console.log('\nAPI Layer Summary:');
  console.log('- Logger utility with structured logging');
  console.log('- POST /api/mood: Auth + validation + database creation');
  console.log('- POST /api/experience: Flexible input + relaxation engine + session storage');
  console.log('- Comprehensive error handling and typed responses');
  process.exit(0);
}

