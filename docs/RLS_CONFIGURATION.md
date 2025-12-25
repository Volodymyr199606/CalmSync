# Row Level Security (RLS) Configuration Guide

## Overview

Your Supabase database is showing RLS warnings because Row Level Security is not enabled on several tables. This is a security best practice, especially when using Supabase's client libraries.

## Important Note: Prisma vs Supabase Client

**Your application uses Prisma** to access the database, not Supabase's client library directly. This means:

1. **RLS may not apply** - Prisma typically connects using a service role or direct connection, which bypasses RLS
2. **Your security is at the application layer** - Your API routes already check authentication via `getCurrentUser()` before database operations
3. **RLS is still recommended** - For defense-in-depth security, especially if you ever add direct Supabase client access

## Options

### Option 1: Enable RLS (Recommended for Defense-in-Depth)

Enable RLS even though Prisma uses service role. This protects against:
- Direct database access
- Future Supabase client integrations
- Admin panel access
- Accidental exposure

**However**, if you enable RLS, Prisma operations might fail unless:
- You use Supabase's connection pooling with user context (complex)
- You temporarily disable RLS for service operations (less secure)
- You use a service role that bypasses RLS (current setup)

### Option 2: Keep RLS Disabled (Current Setup)

Since you're using Prisma with application-level authentication, RLS might not be strictly necessary. Your security comes from:
- ✅ Server-side authentication checks in API routes
- ✅ User ID filtering in all queries (`where: { userId: user.id }`)
- ✅ No direct client-side database access

## How to Enable RLS

### Step 1: Run the SQL Migration

1. Go to your Supabase Dashboard → SQL Editor
2. Open the file: `prisma/migrations/enable_rls.sql`
3. Copy the SQL content
4. Paste into SQL Editor
5. Click "Run"

### Step 2: Test Your Application

After enabling RLS, test your application to ensure everything still works:

```bash
# Test locally
pnpm dev

# Test creating a mood check-in
# Test viewing history
# Test creating a relaxation session
```

### Step 3: If Prisma Operations Fail

If you see "permission denied" errors after enabling RLS, you have two options:

#### Option A: Use Service Role (Bypasses RLS)
- Your Prisma connection already uses service role
- RLS policies won't apply to service role connections
- This is acceptable if all access is through your authenticated API

#### Option B: Adjust RLS Policies for Service Role

Add policies that allow service role to bypass RLS:

```sql
-- Allow service role full access (for Prisma)
CREATE POLICY "Service role bypass"
  ON public.mood_check_ins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Repeat for other tables
```

## Recommended Setup

For your current architecture (Prisma + Application Auth):

1. **Enable RLS** on all tables (security best practice)
2. **Keep using service role** for Prisma connections (they bypass RLS)
3. **Maintain application-level auth** (your current `getCurrentUser()` checks)
4. **RLS acts as a safety net** if direct database access is ever exposed

## Verifying RLS is Enabled

Run this query in Supabase SQL Editor:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('accounts', 'sessions', 'mood_check_ins', 'relaxation_sessions', 'session_items', 'content_items')
ORDER BY tablename;
```

All tables should show `rowsecurity = true`.

## Troubleshooting

### Error: "new row violates row-level security policy"

**Cause**: Prisma is trying to insert/update without user context

**Solution**: Ensure your `DATABASE_URL` uses service role or add service role policies

### Error: "permission denied for table"

**Cause**: RLS is blocking service role operations

**Solution**: Add service role bypass policies (see Option B above)

### RLS Enabled but Prisma Still Works

**This is normal** - If you're using a service role connection string, RLS policies don't apply. The RLS is still valuable as a safety net.

## Security Recommendations

1. ✅ Enable RLS (defense-in-depth)
2. ✅ Keep application-level authentication (`getCurrentUser()` checks)
3. ✅ Use service role for Prisma (with RLS as backup)
4. ✅ Regularly audit API routes for proper auth checks
5. ✅ Never expose direct database access to client
6. ✅ Use environment variables for all secrets

## Questions?

- **Q: Do I need RLS if using Prisma?**
  - A: Not strictly required, but recommended for security

- **Q: Will RLS break my Prisma queries?**
  - A: No, if using service role connection. Service role bypasses RLS.

- **Q: Should I use user-specific connections?**
  - A: Not necessary with Prisma. Application-level auth is sufficient.

- **Q: What if RLS blocks legitimate operations?**
  - A: Add service role bypass policies or check your connection string

