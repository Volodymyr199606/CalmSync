# Getting Started with CalmSync - Magic Link Authentication

## ✅ What's Been Implemented

CalmSync now uses **passwordless magic link authentication** instead of Google OAuth. Here's what changed:

### Authentication Flow

1. **User enters their email** on the landing page
2. **Receives a beautiful email** with a magic link
3. **Clicks the link** → Automatically signed in
4. **No passwords needed!** 🎉

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com) and sign up (free)
2. Go to [API Keys](https://resend.com/api-keys)
3. Click "Create API Key"
4. Copy the key (starts with `re_...`)

### Step 2: Get Your Database URL

1. Go to [https://console.neon.tech](https://console.neon.tech) and sign up (free)
2. Create a new project called "calmsync"
3. Copy the connection string

### Step 3: Configure Environment Variables

Your `.env.local` should already exist. Open it and update these values:

```env
# Database
DATABASE_URL="postgresql://user:pass@host.region.neon.tech/calmsync?sslmode=require"

# NextAuth - Use the secret you generated earlier
NEXTAUTH_SECRET="AKQRkJWyvbulmDtBX9YF1cEzpOG20x37"
NEXTAUTH_URL="http://localhost:3000"

# Resend Email (Add these new lines)
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="onboarding@resend.dev"
```

### Step 4: Run Database Migrations

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### Step 5: Start the Dev Server

```bash
pnpm dev
```

### Step 6: Test Magic Link Authentication

1. Go to http://localhost:3000
2. Enter your email address
3. Click "Send Magic Link"
4. Check your inbox
5. Click the "Sign In to CalmSync" button in the email
6. You're in! 🎉

---

## 📧 About the Email

The magic link email:
- ✅ Beautifully designed with CalmSync branding
- ✅ Includes the safety notice
- ✅ Has a clear call-to-action button
- ✅ Shows the full URL for manual copying
- ✅ Expires after 24 hours

---

## 🔧 Troubleshooting

### "Can't find RESEND_API_KEY"
- Make sure you added `RESEND_API_KEY=re_...` to your `.env.local`
- Restart the dev server after changing `.env.local`

### Email Not Arriving
- Check spam/junk folder
- With `onboarding@resend.dev`, emails only go to your verified Resend email
- Wait 1-2 minutes (sometimes there's a delay)
- Check the [Resend dashboard](https://resend.com/emails) for delivery status

### Database Error
- Make sure `DATABASE_URL` is set correctly
- Run `pnpm prisma generate` and `pnpm prisma migrate dev --name init`

---

## 📚 Documentation

- **Complete Setup Guide**: [MAGIC_LINK_SETUP.md](./MAGIC_LINK_SETUP.md)
- **Project Rules**: [project.mdc](./project.mdc)
- **Quick Reference**: [QUICKSTART.md](./QUICKSTART.md)

---

## 🎯 What's Next?

### You're Ready for Phase 2! 🚀

With authentication working, you can now proceed to Phase 2 which will add:
- Mood check-in form
- Relaxation content generation
- Session tracking
- User history

---

## 📝 Summary of Changes

**Removed:**
- ❌ Google OAuth
- ❌ Need for Google Cloud Console setup
- ❌ OAuth consent screen configuration

**Added:**
- ✅ Magic link email authentication
- ✅ Resend integration
- ✅ Beautiful email templates
- ✅ Verify request page
- ✅ Passwordless sign-in flow

**Benefits:**
- 🚀 Simpler setup (no OAuth configuration)
- 🔐 More secure (no password storage)
- 📧 Better UX (one-click sign-in after first time)
- 💰 Free tier is generous (100 emails/day)

---

## 🎉 You're All Set!

Once you've:
1. ✅ Added your Resend API key to `.env.local`
2. ✅ Added your database URL to `.env.local`
3. ✅ Run `pnpm prisma migrate dev --name init`
4. ✅ Started the dev server with `pnpm dev`

You can test the magic link flow and then proceed to **Phase 2**!

---

Need help? Check [MAGIC_LINK_SETUP.md](./MAGIC_LINK_SETUP.md) for detailed troubleshooting.

