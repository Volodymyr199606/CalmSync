# Vercel Deployment Checklist - Fix Current Errors

Your application is showing two critical errors. Follow this checklist to fix them.

## Current Errors

1. ❌ **500 Error**: `api/auth/session` - Authentication configuration problem
2. ❌ **503 Error**: `api/experience` - Database connection error

## Step-by-Step Fix

### Step 1: Check Vercel Environment Variables

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: CalmSync
3. **Go to Settings** → **Environment Variables**
4. **Verify these variables exist** (case-sensitive):

#### Required Variables:

```
✅ DATABASE_URL
✅ AUTH_SECRET (or NEXTAUTH_SECRET)
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Step 2: Verify DATABASE_URL

**Format should be:**
```
postgresql://user:password@host:port/database?sslmode=require
```

**For Supabase:**
- Get from: Supabase Dashboard → Project Settings → Database
- Use **Connection Pooling** URL (port 6543) if available
- Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`

**For Neon:**
- Get from: Neon Dashboard → Your Project → Connection String
- Format: `postgresql://user:password@host.neon.tech/database?sslmode=require`

**Common Issues:**
- ❌ Missing `?sslmode=require` at the end
- ❌ Password not URL-encoded (special characters need encoding)
- ❌ Wrong hostname/port
- ❌ Database is paused (Supabase free tier)

### Step 3: Verify AUTH_SECRET

**Generate a secret** (choose one method):

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or use any random 32+ character string**

**Add to Vercel:**
- Name: `AUTH_SECRET`
- Value: Your generated secret
- Environments: ✅ Production ✅ Preview ✅ Development

### Step 4: Verify Supabase Variables

**Get from Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Add to Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`: `https://xxxxx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 5: Check Database Status

**For Supabase:**
1. Go to Supabase Dashboard → Your Project
2. Check if database shows "Active" status
3. If paused (free tier), click "Resume"
4. Verify you can connect to the database

**For Neon:**
1. Go to Neon Dashboard
2. Check project status
3. Verify database is not suspended

### Step 6: Verify Environment Variables Are Set

After adding/updating variables in Vercel:

1. **Save all variables** in Vercel
2. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger deployment

3. **Check deployment logs**:
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Go to **Logs** tab
   - Look for errors related to:
     - `[AUTH] Missing AUTH_SECRET`
     - `[PRISMA] DATABASE_URL environment variable is not set`
     - Database connection errors

### Step 7: Test Database Connection Locally

Create a test file to verify your connection string works:

```javascript
// test-connection.js
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
    
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
    const userCount = await prisma.user.count();
    console.log(`✅ Query successful! Found ${userCount} users`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes("Can't reach database server")) {
      console.error('\n💡 Tips:');
      console.error('  - Check if database is paused/resumed');
      console.error('  - Verify hostname and port are correct');
      console.error('  - Check network/firewall settings');
    }
    process.exit(1);
  }
}

test();
```

Run:
```bash
node test-connection.js
```

### Step 8: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. **Deployments** → Latest deployment
3. **Functions** tab
4. Click on `api/auth/[...nextauth]` function
5. Check **Logs** for:
   - Missing secret errors
   - Database connection errors
   - Any other errors

### Step 9: Verify Variables Are Actually Set

**Check in Vercel CLI** (if installed):
```bash
vercel env ls
```

**Or check in deployment logs:**
- Look for: `[AUTH] Missing AUTH_SECRET` warnings
- Look for: `[PRISMA] DATABASE_URL environment variable is not set` errors

### Step 10: Common Mistakes Checklist

- [ ] Variable name has typos (case-sensitive!)
- [ ] Variable value has extra spaces
- [ ] Forgot to click "Save" after adding variable
- [ ] Variable is set only for Development, not Production
- [ ] Forgot to redeploy after adding variables
- [ ] Database connection string missing `?sslmode=require`
- [ ] Database password has special characters not URL-encoded
- [ ] Database is paused (Supabase free tier)
- [ ] Wrong environment (checking Production vs Preview)

## Quick Diagnostic

Run this in your local terminal to check your `.env.local`:

```bash
# Check if variables are set (Windows PowerShell)
$env:DATABASE_URL -ne $null
$env:AUTH_SECRET -ne $null
$env:NEXT_PUBLIC_SUPABASE_URL -ne $null

# Check if variables are set (Mac/Linux)
echo $DATABASE_URL
echo $AUTH_SECRET
echo $NEXT_PUBLIC_SUPABASE_URL
```

## After Fixing

1. ✅ All environment variables are set in Vercel
2. ✅ Database is running and accessible
3. ✅ Redeployed application
4. ✅ Checked deployment logs - no errors
5. ✅ Test the application:
   - Try to sign in
   - Try to create a mood check-in
   - Try to create a relaxation experience

## Still Having Issues?

1. **Check Vercel Deployment Logs**:
   - Look for specific error messages
   - Check function logs for detailed errors

2. **Test Database Connection**:
   - Use the test script above
   - Try connecting with a PostgreSQL client

3. **Verify Supabase Configuration**:
   - Check Supabase project is active
   - Verify API keys are correct
   - Check redirect URLs are set correctly

4. **Review Previous Fixes**:
   - See `docs/DATABASE_CONFIGURATION.md`
   - See `docs/RLS_CONFIGURATION.md`

## Support Resources

- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Supabase Connection Strings**: https://supabase.com/docs/guides/database/connecting-to-postgres
- **Neon Connection Strings**: https://neon.tech/docs/connect/connect-from-any-app
