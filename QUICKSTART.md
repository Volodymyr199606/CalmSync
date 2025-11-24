# CalmSync Quick Start - Fix "invalid_client" Error

You're seeing the "Error 401: invalid_client" because Google OAuth isn't set up yet. Follow these steps:

## Quick Fix (5 minutes)

### Step 1: Check Your .env.local File

Do you have a `.env.local` file in your project root? 

**No?** → Copy the example:
```bash
cp env.example .env.local
```

### Step 2: Set Up Google OAuth (Required)

You **must** create Google OAuth credentials. Here's the fast track:

1. **Go to**: https://console.cloud.google.com/
2. **Create a project** (top dropdown → New Project → name it "CalmSync")
3. **Go to**: APIs & Services → OAuth consent screen
   - Choose "External"
   - Fill in app name: "CalmSync"
   - Add your email
   - Click through the steps (you can skip optional fields)
   
4. **Go to**: APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Type: "Web application"
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"
   
5. **Copy the credentials** that appear (Client ID and Client Secret)

### Step 3: Update .env.local

Open `.env.local` and paste your credentials:

```env
# Your actual Google OAuth credentials
GOOGLE_CLIENT_ID="paste-your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="paste-your-client-secret-here"

# Generate this: openssl rand -base64 32
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Your database URL (from Neon or local PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database"
```

### Step 4: Generate NEXTAUTH_SECRET

Run this command and copy the output to your `.env.local`:

```bash
openssl rand -base64 32
```

Or use any random 32+ character string.

### Step 5: Set Up Database

If you haven't already, run the migration:

```bash
pnpm prisma migrate dev --name init
```

### Step 6: Restart Dev Server

Stop the server (Ctrl+C) and restart:

```bash
pnpm dev
```

### Step 7: Test Again

Go to http://localhost:3000 and click "Continue with Google"

## Still Having Issues?

### Make sure:
- ✅ Your `.env.local` file is in the project root (same folder as `package.json`)
- ✅ The Client ID ends with `.apps.googleusercontent.com`
- ✅ There are no extra spaces or quotes around the values
- ✅ You restarted the dev server after changing `.env.local`
- ✅ The redirect URI in Google Console is exactly: `http://localhost:3000/api/auth/callback/google`

### Check your .env.local format:

```env
GOOGLE_CLIENT_ID="123456789.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefg123456"
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://..."
```

## Need More Help?

See the detailed guide: `docs/GOOGLE_OAUTH_SETUP.md`

## Common Errors

| Error | Solution |
|-------|----------|
| "invalid_client" | Double-check Client ID and Secret in `.env.local` |
| "redirect_uri_mismatch" | Add `http://localhost:3000/api/auth/callback/google` to Google Console |
| "Access blocked" | Add your email as a test user in OAuth consent screen |
| Cannot find module | Restart dev server |

