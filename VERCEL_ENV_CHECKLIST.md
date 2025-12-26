# Vercel Environment Variables - Complete Checklist

## ⚠️ CRITICAL: Copy these EXACT values to Vercel

Use this checklist to ensure ALL variables are set correctly in Vercel Dashboard → Settings → Environment Variables.

### ✅ Required Variables (MUST be set for Production)

| Variable Name | Value from .env.local | Notes |
|--------------|----------------------|-------|
| `DATABASE_URL` | `postgresql://postgres:Vova.developer123!@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres?sslmode=require` | **CRITICAL** - Must match exactly |
| `NEXTAUTH_SECRET` | `MHhfJCd2zgIrnj+v3rl06pmQDdnvzYfI0HokS29CNiw=` | **CRITICAL** - Must match exactly |
| `NEXTAUTH_URL` | `https://calmsync.vercel.app` | **CHANGE THIS** - Use production URL, NOT localhost |
| `RESEND_API_KEY` | `re_NHwNur1v_KtFJzkcMdakgrEETRMru1ozL` | **CRITICAL** - For magic link emails |
| `EMAIL_FROM` | `onboarding@resend.dev` | Required for email sending |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kkhunvnulyzohtmdsrub.supabase.co` | Must match exactly |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_ckOAF9IofJZvA-zmn6dBEQ_SV6Szcxc` | Must match exactly |
| `NEXT_PUBLIC_APP_URL` | `https://calmsync.vercel.app` | **CHANGE THIS** - Use production URL |

### ⚠️ Important Changes for Production

**DO NOT copy these as-is from .env.local:**
- ❌ `NEXTAUTH_URL="http://localhost:3000"` (local only)
- ✅ `NEXTAUTH_URL="https://calmsync.vercel.app"` (production)

- ❌ `NEXT_PUBLIC_APP_URL="http://localhost:3000"` (local only)
- ✅ `NEXT_PUBLIC_APP_URL="https://calmsync.vercel.app"` (production)

### 📋 Optional Variables (can add later)

| Variable Name | Value | Purpose |
|--------------|-------|---------|
| `UNSPLASH_ACCESS_KEY` | `K-mGdIeCS6TOhjzSmDI_7BiPpw9QqFYP3shJTE3cJGc` | Dashboard background images |
| `GOOGLE_CLIENT_ID` | `1065479782709-43gu4hfbgtbtvft42bc1r24058gji0qm.apps.googleusercontent.com` | If using Google OAuth |
| `GOOGLE_CLIENT_SECRET` | `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` | If using Google OAuth |

### 🔍 Common Issues to Check

1. **Missing DATABASE_URL**
   - Symptom: "Database connection error" (503)
   - Fix: Add `DATABASE_URL` with exact value from .env.local

2. **Wrong NEXTAUTH_URL**
   - Symptom: Auth callbacks fail, can't sign in
   - Fix: Use `https://calmsync.vercel.app` (not localhost)

3. **Missing RESEND_API_KEY**
   - Symptom: Magic link emails don't send
   - Fix: Add `RESEND_API_KEY` from .env.local

4. **Typo in Variable Name**
   - Check: Exact spelling, case-sensitive
   - Common mistakes: `NEXTAUTH_URL` vs `NEXT_AUTH_URL`, extra spaces

5. **Environment Scope**
   - Make sure variables are enabled for: ✅ Production ✅ Preview
   - Don't just enable for Development

### 📝 Step-by-Step Setup

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. For each variable above:
   - Click "Add New" (or edit if exists)
   - Paste exact variable name (case-sensitive)
   - Paste exact value (watch for quotes - Vercel handles quotes automatically)
   - Check ✅ Production and ✅ Preview
   - Click "Save"
3. After adding ALL variables:
   - Go to Deployments tab
   - Click ⋯ on latest deployment
   - Click "Redeploy"
4. Wait for deployment to complete
5. Test your app: https://calmsync.vercel.app

### 🔒 Security Notes

- Never commit `.env.local` to git
- These values are safe to put in Vercel (they're encrypted)
- Rotate secrets if they're ever exposed

