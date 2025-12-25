#!/usr/bin/env node

/**
 * Environment Variables Checker
 * 
 * This script checks if all required environment variables are set
 * and provides helpful error messages if they're missing.
 */

const requiredEnvVars = {
  // Database
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL connection string',
    example: 'postgresql://user:password@host:port/database?sslmode=require',
    check: (value) => {
      if (!value) return { valid: false, error: 'Missing DATABASE_URL' };
      if (!value.startsWith('postgresql://')) {
        return { valid: false, error: 'DATABASE_URL should start with postgresql://' };
      }
      if (!value.includes('?sslmode=require')) {
        return { valid: false, error: 'DATABASE_URL should include ?sslmode=require' };
      }
      return { valid: true };
    },
  },
  
  // Authentication
  AUTH_SECRET: {
    required: true,
    description: 'NextAuth secret key (32+ characters)',
    example: 'generated-with-openssl-rand-base64-32',
    check: (value) => {
      if (!value) {
        // Check fallback
        if (process.env.NEXTAUTH_SECRET) {
          return { valid: true, note: 'Using NEXTAUTH_SECRET as fallback' };
        }
        return { valid: false, error: 'Missing AUTH_SECRET or NEXTAUTH_SECRET' };
      }
      if (value.length < 32) {
        return { valid: false, error: 'AUTH_SECRET should be at least 32 characters' };
      }
      return { valid: true };
    },
  },
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
    check: (value) => {
      if (!value) return { valid: false, error: 'Missing NEXT_PUBLIC_SUPABASE_URL' };
      if (!value.startsWith('https://')) {
        return { valid: false, error: 'NEXT_PUBLIC_SUPABASE_URL should start with https://' };
      }
      return { valid: true };
    },
  },
  
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    description: 'Supabase anonymous/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    check: (value) => {
      if (!value) return { valid: false, error: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY' };
      if (!value.startsWith('eyJ')) {
        return { valid: false, error: 'NEXT_PUBLIC_SUPABASE_ANON_KEY should be a JWT token' };
      }
      return { valid: true };
    },
  },
};

// Optional variables
const optionalEnvVars = {
  NEXTAUTH_URL: {
    description: 'NextAuth base URL',
    example: 'https://calmsync.vercel.app',
  },
  NEXT_PUBLIC_APP_URL: {
    description: 'Public app URL',
    example: 'https://calmsync.vercel.app',
  },
  RESEND_API_KEY: {
    description: 'Resend API key for emails',
    example: 're_xxxxx',
  },
  EMAIL_FROM: {
    description: 'Email sender address',
    example: 'onboarding@resend.dev',
  },
};

function checkEnvironment() {
  console.log('🔍 Checking environment variables...\n');
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Check required variables
  console.log('📋 Required Variables:');
  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];
    const check = config.check ? config.check(value) : { valid: !!value };
    
    if (check.valid) {
      console.log(`  ✅ ${varName}`);
      if (check.note) {
        console.log(`     ℹ️  ${check.note}`);
      }
    } else {
      hasErrors = true;
      console.log(`  ❌ ${varName}`);
      console.log(`     Error: ${check.error || 'Not set'}`);
      console.log(`     Description: ${config.description}`);
      console.log(`     Example: ${config.example}\n`);
    }
  }
  
  // Check optional variables
  console.log('\n📋 Optional Variables:');
  for (const [varName, config] of Object.entries(optionalEnvVars)) {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}`);
    } else {
      hasWarnings = true;
      console.log(`  ⚠️  ${varName} (optional)`);
      console.log(`     Description: ${config.description}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ Some required environment variables are missing!');
    console.log('\n💡 Next steps:');
    console.log('   1. Check your .env.local file (for local development)');
    console.log('   2. Check Vercel Environment Variables (for production)');
    console.log('   3. See docs/VERCEL_SETUP_CHECKLIST.md for detailed instructions');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('✅ All required variables are set!');
    console.log('⚠️  Some optional variables are missing (this is okay)');
    process.exit(0);
  } else {
    console.log('✅ All environment variables are set correctly!');
    process.exit(0);
  }
}

// Load .env.local if it exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not available or .env.local doesn't exist
}

checkEnvironment();
