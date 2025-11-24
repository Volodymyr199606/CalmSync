# Magic Link Authentication Setup Guide

CalmSync uses **passwordless authentication** via email magic links powered by Resend.

## How It Works

1. User enters their email address
2. They receive an email with a sign-in link
3. Click the link → automatically signed in
4. No passwords to remember! 🎉

---

## Setup Instructions

### Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get Your API Key

1. Go to [API Keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Name it "CalmSync Development"
4. Copy the API key (starts with `re_...`)

### Step 3: Configure Email Domain (Optional for Testing)

**For Development (Quick Start):**
- You can use the default `onboarding@resend.dev` sender
- This works immediately but has limitations
- Can only send to your verified email

**For Production:**
1. Go to [Domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Add your domain (e.g., `calmsync.com`)
4. Add the DNS records shown
5. Wait for verification (usually a few minutes)
6. Use `noreply@yourdomain.com` as your sender

### Step 4: Update .env.local

Open your `.env.local` file and add:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"

# Resend Email
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="onboarding@resend.dev"
```

**Important Notes:**
- Replace `re_your_actual_api_key_here` with your real Resend API key
- For development, `onboarding@resend.dev` works fine
- For production, use your verified domain: `EMAIL_FROM="noreply@yourdomain.com"`

### Step 5: Set Up Database

If you haven't already:

```bash
# Run Prisma migration
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### Step 6: Test the Magic Link Flow

1. **Start the dev server:**
   ```bash
   pnpm dev
   ```

2. **Go to** http://localhost:3000

3. **Enter your email** and click "Send Magic Link"

4. **Check your inbox** - you should receive an email within seconds

5. **Click the "Sign In to CalmSync" button** in the email

6. **You're in!** You should be redirected to the dashboard

---

## Testing Notes

### Free Tier Limitations (Resend)

With the free tier:
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ Perfect for development
- ⚠️ Using `onboarding@resend.dev` can only send to your verified email

### Testing with Different Email Addresses

**Option 1: Use Your Own Email**
- Just enter your email and test
- Works immediately with `onboarding@resend.dev`

**Option 2: Verify Additional Emails**
1. Go to [Audience](https://resend.com/audiences) in Resend
2. Add email addresses you want to test with
3. They'll receive a verification email
4. Once verified, you can send magic links to them

**Option 3: Use a Custom Domain (Production)**
- Set up your own domain
- Send to any email address
- No verification needed

---

## Troubleshooting

### "Email not sent" Error

**Check:**
- ✅ Your `RESEND_API_KEY` is correct in `.env.local`
- ✅ You restarted the dev server after adding the key
- ✅ Your Resend account is verified
- ✅ You haven't exceeded the free tier limits

### Email Not Arriving

**Check:**
- 📧 Spam/junk folder
- ⏱️ Wait 1-2 minutes (sometimes there's a delay)
- 📨 Check if the email address is verified (if using `onboarding@resend.dev`)
- 🔍 Check Resend dashboard "Emails" tab for delivery status

### Magic Link Not Working

**Check:**
- ⏰ Link expires after 24 hours
- 🔗 Make sure you clicked the correct link
- 🗄️ Database connection is working
- 🔄 Try requesting a new link

### "Configuration Error"

**Check your `.env.local`:**
```env
# Must have all of these
DATABASE_URL="..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_..."
EMAIL_FROM="onboarding@resend.dev"
```

---

## Production Deployment

### Environment Variables (Vercel)

Add these to your Vercel project settings:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="noreply@yourdomain.com"
```

### Custom Domain Email

1. Verify your domain in Resend
2. Update `EMAIL_FROM` to use your domain
3. Update email templates if needed

---

## Email Customization

The magic link email template is in `lib/email.ts`. You can customize:
- Colors and styling
- Logo/branding
- Email copy
- Footer content

---

## Security Notes

- 🔒 Magic links expire after 24 hours
- 🔐 Links are one-time use
- 🛡️ Never share magic links
- 📧 Emails are sent over secure SMTP
- 🔑 API keys are server-side only (never exposed to client)

---

## Support

- **Resend Docs**: https://resend.com/docs
- **NextAuth Email Provider**: https://next-auth.js.org/providers/email
- **CalmSync Issues**: File an issue in the repository

---

## Cost Estimate

**Free Tier (Resend):**
- 100 emails/day
- 3,000 emails/month
- Perfect for small projects

**Paid Plans (if needed):**
- Starts at $20/month for 50,000 emails
- See [Resend Pricing](https://resend.com/pricing)

