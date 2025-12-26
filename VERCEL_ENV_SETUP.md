# Vercel Environment Variables Setup Guide

## Quick Fix for Database Connection Error

If you're seeing "Database connection error" on your Vercel deployment, it means the environment variables are not configured in Vercel.

## Steps to Fix

### 1. Go to Vercel Dashboard
1. Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **CalmSync** project
3. Go to **Settings** → **Environment Variables**

### 2. Add Required Environment Variables

Add these variables one by one, copying values from your `.env.local` file:

#### Required Variables (Must Have):

```bash
# Database - Copy from .env.local
DATABASE_URL=postgresql://postgres:Vova.developer123!@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres?sslmode=require

# NextAuth - Copy from .env.local
NEXTAUTH_SECRET=MHhfJCd2zgIrnj+v3rl06pmQDdnvzYfI0HokS29CNiw=
NEXTAUTH_URL=https://calmsync.vercel.app

# Resend Email - Copy from .env.local
RESEND_API_KEY=re_NHwNur1v_KtFJzkcMdakgrEETRMru1ozL
EMAIL_FROM=onboarding@resend.dev

# Supabase - Copy from .env.local
NEXT_PUBLIC_SUPABASE_URL=https://kkhunvnulyzohtmdsrub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ckOAF9IofJZvA-zmn6dBEQ_SV6Szcxc
```

#### Optional Variables:

```bash
# App URL - Update with your production URL
NEXT_PUBLIC_APP_URL=https://calmsync.vercel.app

# Unsplash (for dashboard backgrounds)
UNSPLASH_ACCESS_KEY=K-mGdIeCS6TOhjzSmDI_7BiPpw9QqFYP3shJTE3cJGc

# Sentry (if you have it configured)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### 3. Important Notes

#### For `NEXTAUTH_URL`:
- **Development**: `http://localhost:3000`
- **Production (Vercel)**: `https://calmsync.vercel.app` (use your actual domain)
- **Preview deployments**: Vercel automatically sets this, but you can use a wildcard like `https://*.vercel.app`

#### For `NEXT_PUBLIC_APP_URL`:
- Should match your production domain: `https://calmsync.vercel.app`

#### For `DATABASE_URL`:
- Make sure it includes `?sslmode=require` at the end
- If using Supabase, you might want to use a **pooled connection** for better serverless performance
- Supabase pooled URL format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
- However, the direct connection should work fine

### 4. Set Environment for Each Variable

When adding variables in Vercel, you can set them for:
- **Production** ✅ (required)
- **Preview** ✅ (recommended for testing)
- **Development** (optional, for local Vercel CLI)

For most variables, select both **Production** and **Preview**.

### 5. Redeploy Your Application

After adding all environment variables:

1. Go to **Deployments** tab
2. Click the **⋯** menu on your latest deployment
3. Click **Redeploy**

Or push a new commit to trigger a new deployment.

### 6. Verify the Fix

After redeployment:

1. Visit your production URL: `https://calmsync.vercel.app`
2. Try to sign in or access the dashboard
3. Check Vercel function logs:
   - Go to **Deployments** → Select deployment → **Functions** tab
   - Look for any errors

## Troubleshooting

### Still Getting Database Connection Error?

1. **Verify DATABASE_URL is correct**:
   - Check that it's copied correctly (no extra spaces)
   - Ensure `?sslmode=require` is included
   - Test the connection string locally

2. **Check Vercel Logs**:
   - Go to your deployment → **Functions** tab
   - Look for `[PRISMA]` error messages
   - Check if `DATABASE_URL` is being read (it won't show the value, but should show if it's missing)

3. **Verify Environment Variables Are Set**:
   - In Vercel dashboard → Settings → Environment Variables
   - Make sure variables are assigned to **Production**
   - Check that there are no typos in variable names

4. **Test Database Connection**:
   ```bash
   # Locally, test if your DATABASE_URL works
   pnpm prisma studio
   # If this works locally, the URL is correct
   ```

5. **Connection Pooling for Serverless**:
   - If you're getting "too many connections" errors, consider using Supabase's pooled connection
   - Check Supabase dashboard → Settings → Database → Connection Pooling
   - Use the connection pooler URL if available

### Missing Other Errors?

If you see errors about:
- **NEXTAUTH_SECRET**: Make sure it's set (generate a new one if needed: `openssl rand -base64 32`)
- **RESEND_API_KEY**: Required for magic link authentication
- **EMAIL_FROM**: Should match your Resend domain

## Security Best Practices

✅ **DO**:
- Use Vercel's environment variables for secrets (never commit `.env.local` to git)
- Use different secrets for production vs development
- Rotate secrets regularly

❌ **DON'T**:
- Commit `.env.local` to git
- Share environment variables in screenshots or messages
- Use the same `NEXTAUTH_SECRET` for production and development

## Quick Reference

**Your current values from `.env.local`** (use these in Vercel):
- `DATABASE_URL`: `postgresql://postgres:Vova.developer123!@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres?sslmode=require`
- `NEXTAUTH_SECRET`: `MHhfJCd2zgIrnj+v3rl06pmQDdnvzYfI0HokS29CNiw=`
- `RESEND_API_KEY`: `re_NHwNur1v_KtFJzkcMdakgrEETRMru1ozL`
- `EMAIL_FROM`: `onboarding@resend.dev`
- `NEXT_PUBLIC_SUPABASE_URL`: `https://kkhunvnulyzohtmdsrub.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_ckOAF9IofJZvA-zmn6dBEQ_SV6Szcxc`

**Important**: Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to use `https://calmsync.vercel.app` instead of `http://localhost:3000`

