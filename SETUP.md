# CalmSync Setup Guide

This guide will help you set up CalmSync for local development.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- A PostgreSQL database (Neon recommended, or local PostgreSQL)

## Step 1: Database Setup

### Option A: Using Neon (Recommended)

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Create a new project called "calmsync"
4. Copy your connection string (it will look like: `postgresql://user:password@host.region.neon.tech/calmsync?sslmode=require`)

### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb calmsync`
3. Your connection string will be: `postgresql://postgres:password@localhost:5432/calmsync`

## Step 2: Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and fill in the values:

### Database URL
```env
DATABASE_URL="your-postgresql-connection-string-here"
```

### NextAuth Secret
Generate a secret with:
```bash
openssl rand -base64 32
```
Then add it to `.env.local`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-production-domain.com/api/auth/callback/google` (for production)
7. Copy your Client ID and Client Secret to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Sentry (Optional)
If you want error monitoring:
```env
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-auth-token"
```

## Step 3: Run Database Migrations

Generate the Prisma client and run migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

This will create all the necessary database tables.

## Step 4: Start Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Test Authentication

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected to the dashboard

## Prisma Studio (Optional)

To view and edit your database with a GUI:

```bash
pnpm prisma:studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

## Troubleshooting

### "Invalid `prisma.user.create()` invocation"
- Make sure your `DATABASE_URL` is correct in `.env.local`
- Run `pnpm prisma migrate dev` to ensure your database schema is up to date

### "OAuthCallback error"
- Verify your Google OAuth credentials are correct
- Make sure the redirect URI in Google Cloud Console matches: `http://localhost:3000/api/auth/callback/google`
- Check that `NEXTAUTH_URL` is set to `http://localhost:3000`

### "Invalid session"
- Clear your browser cookies and try again
- Regenerate your `NEXTAUTH_SECRET` and restart the dev server

## Next Steps

Phase 1 is complete! You can now:
- Sign in with Google
- Access the protected dashboard
- See your user profile

Phase 2 will add mood check-ins and relaxation experiences.




