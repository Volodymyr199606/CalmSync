# Vercel Deployment Steps - Quick Guide

## ✅ Step 1: Project is Already Deployed!

Your project has been deployed to Vercel, but the build failed due to missing environment variables.

**Your deployment URL:** https://calmsync-qws1brz2j-vovabehma-3461s-projects.vercel.app

## 🔧 Step 2: Add Environment Variables

You need to add the following environment variables in the Vercel dashboard:

### Required Environment Variables:

1. **DATABASE_URL**
   - Get from: https://console.neon.tech/
   - Format: `postgresql://user:password@host.region.neon.tech/dbname?sslmode=require`

2. **NEXTAUTH_SECRET**
   - Generate a random 32+ character string
   - You can use: `openssl rand -base64 32` or any secure random string generator

3. **NEXTAUTH_URL**
   - Set to: `https://calmsync-qws1brz2j-vovabehma-3461s-projects.vercel.app`
   - (Update this after you get your production domain)

4. **RESEND_API_KEY**
   - Get from: https://resend.com/api-keys
   - Format: `re_xxxxxxxxxxxxx`

5. **EMAIL_FROM**
   - Your verified Resend email address
   - Example: `onboarding@resend.dev` or your custom domain email

### Optional Environment Variables:

6. **OPENAI_API_KEY** (for image generation)
   - Get from: https://platform.openai.com/api-keys

7. **UNSPLASH_ACCESS_KEY** (alternative to OpenAI)
   - Get from: https://unsplash.com/developers

8. **NEXT_PUBLIC_SENTRY_DSN** (for error monitoring)
   - Get from: https://sentry.io/

9. **SENTRY_AUTH_TOKEN** (for Sentry source maps)
   - Get from: https://sentry.io/settings/account/api/auth-tokens/

10. **SENTRY_ORG** (for Sentry)
    - Your Sentry organization slug

11. **SENTRY_PROJECT** (for Sentry)
    - Your Sentry project name

## 📝 Step 3: How to Add Environment Variables in Vercel

1. Go to: https://vercel.com/vovabehma-3461s-projects/calmsync/settings/environment-variables
2. Click **"Add New"** for each environment variable
3. Enter the **Name** and **Value**
4. Select **Environment**: Production, Preview, and Development (or just Production)
5. Click **"Save"**
6. After adding all variables, go to **Deployments** tab
7. Click the **"..."** menu on the latest deployment
8. Click **"Redeploy"**

## 🗄️ Step 4: Run Database Migrations

After setting up your DATABASE_URL, you need to run migrations:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-connection-string"

# Run migrations
pnpm prisma migrate deploy
```

Or use the Neon Console SQL Editor to run the migration SQL files manually.

## ✅ Step 5: Verify Deployment

1. Visit your deployment URL
2. Test magic link authentication
3. Test creating a mood check-in
4. Verify the experience generation works

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/vovabehma-3461s-projects/calmsync
- **Deployment URL**: https://calmsync-qws1brz2j-vovabehma-3461s-projects.vercel.app
- **Neon Database**: https://console.neon.tech/
- **Resend**: https://resend.com/
- **Sentry**: https://sentry.io/

## 🐛 Troubleshooting

### Build Still Fails?
- Check that all required environment variables are set
- Verify DATABASE_URL is correct and accessible
- Ensure NEXTAUTH_URL matches your deployment URL exactly

### Authentication Not Working?
- Verify NEXTAUTH_URL matches your deployment URL
- Check RESEND_API_KEY is correct
- Verify EMAIL_FROM is a valid Resend email

### Database Connection Issues?
- Verify DATABASE_URL is correct
- Check Neon database is running
- Ensure migrations have been applied

