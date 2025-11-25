# Google OAuth Setup Guide

## Step-by-Step Instructions

### 1. Go to Google Cloud Console

Visit: [https://console.cloud.google.com/](https://console.cloud.google.com/)

### 2. Create or Select a Project

1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it "CalmSync" (or any name you prefer)
4. Click "Create"
5. Wait for the project to be created, then select it

### 3. Enable Google+ API (if required)

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for "Google+ API" (though this may not be required for newer setups)
3. If found, click it and enable it

### 4. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**

**Fill in the required fields:**
- **App name**: CalmSync
- **User support email**: Your email
- **Developer contact information**: Your email
- Leave other fields as default
4. Click **"Save and Continue"**

**Scopes:**
- Click **"Add or Remove Scopes"**
- Select these scopes:
  - `userinfo.email`
  - `userinfo.profile`
  - `openid`
- Click **"Update"**
- Click **"Save and Continue"**

**Test users (for development):**
- Click **"Add Users"**
- Add your Google email address
- Click **"Save and Continue"**

5. Review and click **"Back to Dashboard"**

### 5. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: "CalmSync Web Client"

**Authorized JavaScript origins:**
```
http://localhost:3000
```
(For production, add your production URL like `https://calmsync.vercel.app`)

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
```
(For production, add `https://calmsync.vercel.app/api/auth/callback/google`)

5. Click **"Create"**

### 6. Copy Your Credentials

A popup will appear with your credentials:
- **Client ID**: Something like `xxxxx.apps.googleusercontent.com`
- **Client Secret**: A random string

**IMPORTANT:** Copy both of these values immediately!

### 7. Update Your .env.local File

1. Open your `.env.local` file (create it if it doesn't exist by copying `env.example`)
2. Paste your credentials:

```env
GOOGLE_CLIENT_ID="your-actual-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-actual-client-secret"
```

### 8. Restart Your Development Server

Stop the dev server (Ctrl+C) and restart it:
```bash
pnpm dev
```

### 9. Test Authentication

1. Go to http://localhost:3000
2. Click "Continue with Google"
3. You should now be redirected to Google's login page
4. Sign in with the email you added as a test user
5. You'll be redirected back to your dashboard

## Common Issues

### "Access blocked: This app's request is invalid"
- Make sure you added your email as a test user in the OAuth consent screen
- Verify the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`

### "Error 401: invalid_client"
- Double-check your Client ID and Client Secret in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your dev server after updating `.env.local`

### "redirect_uri_mismatch"
- The redirect URI in Google Console must exactly match what NextAuth is using
- Check for trailing slashes - don't include them
- Make sure it's `http://localhost:3000/api/auth/callback/google`

## Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Never share your Client Secret publicly
- For production, use environment variables in Vercel/your hosting platform
- Regularly rotate your Client Secret if you suspect it's been compromised

## Production Setup

When deploying to production:

1. Add your production URL to **Authorized JavaScript origins**:
   ```
   https://your-domain.com
   ```

2. Add your production callback to **Authorized redirect URIs**:
   ```
   https://your-domain.com/api/auth/callback/google
   ```

3. Set the same environment variables in your hosting platform (Vercel):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (should be your production URL)
   - `DATABASE_URL`


