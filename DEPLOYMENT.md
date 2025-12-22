# Vercel Deployment Guide

This guide will help you deploy CalmSync to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. ✅ A GitHub account (your code is already on GitHub)
2. ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))
3. ✅ A Neon PostgreSQL database (get one at [neon.tech](https://neon.tech))
4. ✅ A Resend API key (get one at [resend.com](https://resend.com))
5. ✅ (Optional) OpenAI API key for image generation
6. ✅ (Optional) Sentry DSN for error monitoring

## Step-by-Step Deployment

### 1. Prepare Your Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project (or use existing)
3. Copy your connection string (it looks like: `postgresql://user:password@host.region.neon.tech/dbname?sslmode=require`)
4. **Important**: Run migrations on your production database:
   ```bash
   # Set your production DATABASE_URL temporarily
   export DATABASE_URL="your-production-connection-string"
   
   # Run migrations
   pnpm prisma migrate deploy
   ```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository (`Volodymyr199606/CalmSync`)
4. Vercel will auto-detect Next.js settings
5. Configure the following:

   **Build Settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)

   **Environment Variables:**
   Add all the following variables (click "Add" for each):

   ```
   DATABASE_URL=postgresql://user:password@host.region.neon.tech/dbname?sslmode=require
   NEXTAUTH_SECRET=your-super-secret-32-character-minimum-string
   NEXTAUTH_URL=https://your-app-name.vercel.app
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=onboarding@resend.dev
   ```

   **Optional Environment Variables:**
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here
   NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   SENTRY_AUTH_TOKEN=your-sentry-auth-token
   ```

6. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   pnpm add -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and add environment variables when asked

### 3. Configure Environment Variables

After initial deployment, you need to update `NEXTAUTH_URL`:

1. Go to your project settings on Vercel
2. Navigate to **Settings → Environment Variables**
3. Update `NEXTAUTH_URL` to your actual Vercel domain:
   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```
4. Redeploy the application

### 4. Run Database Migrations

After deployment, ensure your database is migrated:

1. **Option 1: Via Vercel CLI** (Recommended)
   ```bash
   # Set production DATABASE_URL
   export DATABASE_URL="your-production-connection-string"
   
   # Run migrations
   pnpm prisma migrate deploy
   ```

2. **Option 2: Via Neon Console**
   - Go to Neon Console → SQL Editor
   - Run the migration SQL files from `prisma/migrations/`

### 5. Verify Deployment

1. Visit your deployed URL: `https://your-app-name.vercel.app`
2. Test the magic link authentication
3. Test creating a mood check-in
4. Verify the experience generation works

## Important Notes

### Database Migrations

- **Always run migrations before or immediately after deployment**
- Use `prisma migrate deploy` for production (not `prisma migrate dev`)
- Migrations are in `prisma/migrations/`

### Environment Variables

- **Never commit `.env.local`** (already in `.gitignore`)
- All sensitive keys must be added in Vercel dashboard
- `NEXTAUTH_URL` must match your production domain exactly

### Build Process

- Vercel automatically runs `pnpm install` → `prisma generate` (via postinstall) → `pnpm build`
- The `postinstall` script ensures Prisma client is generated during build

### Custom Domain

1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable to match
4. Redeploy

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `DATABASE_URL` is correct and accessible
- Check that Prisma migrations have been run

### Authentication Not Working

- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Check `NEXTAUTH_SECRET` is set (32+ characters)
- Verify `RESEND_API_KEY` is correct
- Check email is being sent (check Resend dashboard)

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure migrations have been applied
- Check network connectivity from Vercel to Neon

### Images Not Generating

- Verify `OPENAI_API_KEY` or `UNSPLASH_ACCESS_KEY` is set
- Check API quotas/limits
- Review error logs in Vercel dashboard

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] All environment variables configured
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] Magic link authentication tested
- [ ] Mood check-in flow tested
- [ ] Experience generation tested
- [ ] Custom domain configured (if applicable)
- [ ] Sentry monitoring working (if configured)
- [ ] Error tracking verified

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:
- Push to `main` → Automatic deployment
- Create a branch → Preview deployment
- Merge PR → Production deployment

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Neon Docs: [neon.tech/docs](https://neon.tech/docs)

