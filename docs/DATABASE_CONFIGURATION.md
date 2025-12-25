# Database Configuration Guide

This guide will help you verify and configure your database connection for CalmSync.

## Quick Checklist

- [ ] `DATABASE_URL` is set in Vercel environment variables
- [ ] Database connection string format is correct
- [ ] Database server is running and accessible
- [ ] Network/firewall allows connections from Vercel
- [ ] Database credentials are correct

## 1. Check Vercel Environment Variables

### Steps:
1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project (CalmSync)
3. Go to **Settings** → **Environment Variables**
4. Look for `DATABASE_URL` variable

### What to verify:
- Variable name is exactly `DATABASE_URL` (case-sensitive)
- Value is not empty
- Format is: `postgresql://user:password@host:port/database?sslmode=require`

### If missing:
- Add it: Click **Add New** → Enter `DATABASE_URL` → Enter your connection string → Save
- Redeploy: Go to **Deployments** → Click **...** on latest deployment → **Redeploy**

## 2. Database Connection String Format

### For Supabase:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

### For Neon:
```
postgresql://[USER]:[PASSWORD]@[HOST].neon.tech/[DATABASE]?sslmode=require
```

### Format breakdown:
- `postgresql://` - Protocol
- `user:password` - Credentials (URL-encoded if needed)
- `@host:port` - Database server address
- `/database` - Database name
- `?sslmode=require` - SSL requirement

## 3. Verify Database is Running

### Supabase:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Check if database shows as "Active" or "Running"
4. Free tier databases may pause - click "Resume" if needed

### Neon:
1. Go to https://console.neon.tech/
2. Select your project
3. Check project status
4. Verify the database is not suspended

## 4. Test Database Connection Locally

### Using psql (if installed):
```bash
psql "your-database-url-here"
```

### Using Node.js:
Create a test file `test-db.js`:
```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

test();
```

Run: `DATABASE_URL="your-url" node test-db.js`

## 5. Common Issues & Solutions

### Issue: "Can't reach database server"
**Causes:**
- Database is paused (Supabase free tier)
- Incorrect hostname/port
- Firewall blocking connections
- Database credentials expired

**Solutions:**
1. Resume database if paused
2. Double-check connection string format
3. Verify credentials are correct
4. Check database provider status page

### Issue: "Connection timeout"
**Causes:**
- Network issues
- Database server overloaded
- Incorrect port number
- IP restrictions

**Solutions:**
1. Try using connection pooling URL (if available)
2. Check if database provider has status issues
3. Verify port is correct (5432 for direct, 6543 for Supabase pooler)
4. Check database provider's IP allowlist

### Issue: "Authentication failed"
**Causes:**
- Wrong password
- User doesn't exist
- Password contains special characters not URL-encoded

**Solutions:**
1. Reset database password
2. URL-encode special characters in password (e.g., `@` → `%40`)
3. Verify username is correct

## 6. Generate Connection String

### Supabase:
1. Go to Project Settings → Database
2. Copy the "Connection string" under "Connection pooling"
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. Add `?sslmode=require` at the end if not present

### Neon:
1. Go to your project dashboard
2. Click on your database
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with your actual password

## 7. Vercel Environment Variables Setup

### Required Variables:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
AUTH_SECRET=your-generated-secret-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Adding Variables:
1. **Settings** → **Environment Variables**
2. Click **Add New**
3. Enter variable name and value
4. Select environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application

## 8. Verify After Configuration

After setting up environment variables:

1. **Redeploy** your application in Vercel
2. Check deployment logs for connection errors
3. Test the application:
   - Try to create an account/login
   - Try to create a mood check-in
   - Check if data is being saved

## 9. Monitoring & Debugging

### Check Vercel Logs:
1. Go to **Deployments** tab
2. Click on latest deployment
3. Go to **Functions** tab
4. Check for database-related errors

### Check Application Logs:
Errors will appear in Vercel's function logs with prefixes:
- `[PRISMA]` - Database connection issues
- `[AUTH]` - Authentication issues
- `[API]` - API route errors

## 10. Support Resources

- **Supabase Docs**: https://supabase.com/docs/guides/database/connecting-to-postgres
- **Neon Docs**: https://neon.tech/docs/connect/connect-from-any-app
- **Prisma Docs**: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables

## Quick Health Check Script

Add this to your project to test database connectivity:

```typescript
// scripts/check-db.ts
import { prisma } from '../lib/prisma';

async function checkDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful (${userCount} users)`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  }
}

checkDatabase();
```

Run with: `npx tsx scripts/check-db.ts`
