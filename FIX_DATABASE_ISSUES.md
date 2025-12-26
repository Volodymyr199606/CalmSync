# 🔧 Fix Database Connection & Auth Issues

## Two Issues Identified:

### Issue #1: Database Connection Error (503)
**Symptom:** "Database connection error. Please check your database configuration."

**Root Cause:** `DATABASE_URL` environment variable is NOT set in Vercel.

**Fix:** Add `DATABASE_URL` to Vercel environment variables.

---

### Issue #2: Supabase Redirect URL Mismatch
**Symptom:** Auth callbacks might fail, users can't complete sign-in.

**Root Cause:** `NEXT_PUBLIC_APP_URL` needs to match Supabase's allowed redirect URLs.

**Fix:** 
1. Set `NEXT_PUBLIC_APP_URL` in Vercel
2. Ensure Supabase redirect URLs include the callback URL

---

## 🚀 Complete Fix Instructions

### Step 1: Add Environment Variables to Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these **8 REQUIRED** variables:

#### 1. DATABASE_URL (CRITICAL - Fixes Issue #1)
```
Variable: DATABASE_URL
Value: postgresql://postgres:Vova.developer123!@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres?sslmode=require
Environments: ✅ Production ✅ Preview
```

#### 2. NEXT_PUBLIC_APP_URL (CRITICAL - Fixes Issue #2)
```
Variable: NEXT_PUBLIC_APP_URL
Value: https://calmsync.vercel.app
Environments: ✅ Production ✅ Preview
```

#### 3. NEXTAUTH_SECRET
```
Variable: NEXTAUTH_SECRET
Value: MHhfJCd2zgIrnj+v3rl06pmQDdnvzYfI0HokS29CNiw=
Environments: ✅ Production ✅ Preview
```

#### 4. NEXTAUTH_URL
```
Variable: NEXTAUTH_URL
Value: https://calmsync.vercel.app
Environments: ✅ Production ✅ Preview
```

#### 5. RESEND_API_KEY
```
Variable: RESEND_API_KEY
Value: re_NHwNur1v_KtFJzkcMdakgrEETRMru1ozL
Environments: ✅ Production ✅ Preview
```

#### 6. EMAIL_FROM
```
Variable: EMAIL_FROM
Value: onboarding@resend.dev
Environments: ✅ Production ✅ Preview
```

#### 7. NEXT_PUBLIC_SUPABASE_URL
```
Variable: NEXT_PUBLIC_SUPABASE_URL
Value: https://kkhunvnulyzohtmdsrub.supabase.co
Environments: ✅ Production ✅ Preview
```

#### 8. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Variable: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_ckOAF9IofJZvA-zmn6dBEQ_SV6Szcxc
Environments: ✅ Production ✅ Preview
```

---

### Step 2: Configure Supabase Redirect URLs

1. Go to **Supabase Dashboard** → Your Project → **Authentication** → **URL Configuration**

2. Under **Redirect URLs**, make sure these URLs are added:

   ```
   https://calmsync.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

3. Under **Site URL**, set:
   ```
   https://calmsync.vercel.app
   ```

4. Click **Save**

---

### Step 3: Redeploy Your Application

1. In Vercel Dashboard, go to **Deployments** tab
2. Find your latest deployment
3. Click **⋯** (three dots) menu
4. Click **Redeploy**
5. Wait for deployment to complete (2-3 minutes)

---

### Step 4: Verify the Fix

1. Visit: `https://calmsync.vercel.app/dashboard`
2. Try to:
   - Sign in with email
   - Submit a mood check-in
   - Generate an experience

If you still see errors:
- Check Vercel function logs: Deployments → Select deployment → Functions tab
- Look for `[PRISMA]` or `[AUTH]` error messages
- Verify all 8 environment variables are set correctly

---

## 📋 Quick Checklist

Before redeploying, verify:

- [ ] `DATABASE_URL` is set in Vercel (exact value from .env.local)
- [ ] `NEXT_PUBLIC_APP_URL` is set to `https://calmsync.vercel.app` (NOT localhost)
- [ ] `NEXTAUTH_URL` is set to `https://calmsync.vercel.app` (NOT localhost)
- [ ] All 8 variables have ✅ Production and ✅ Preview checked
- [ ] Supabase redirect URLs include `https://calmsync.vercel.app/auth/callback`
- [ ] You clicked "Save" after adding each variable
- [ ] You redeployed the application

---

## 🔍 Troubleshooting

### Still seeing "Database connection error"?

1. **Double-check DATABASE_URL in Vercel:**
   - Go to Settings → Environment Variables
   - Find `DATABASE_URL`
   - Verify the value matches exactly (including `?sslmode=require`)
   - Make sure it's enabled for **Production**

2. **Check Vercel logs:**
   - Look for: `[PRISMA] DATABASE_URL environment variable is not set`
   - This confirms the variable is missing

3. **Test database connection:**
   ```bash
   # Locally, test if your DATABASE_URL works:
   pnpm prisma studio
   ```

### Auth callbacks not working?

1. **Verify NEXT_PUBLIC_APP_URL:**
   - Must be `https://calmsync.vercel.app` (not localhost)
   - Check in Vercel environment variables

2. **Verify Supabase redirect URLs:**
   - Must include: `https://calmsync.vercel.app/auth/callback`
   - Check in Supabase Dashboard → Authentication → URL Configuration

3. **Check auth logs:**
   - Look for errors about redirect URLs
   - Check if magic link emails are being sent

---

## 🎯 Expected Result

After completing these steps:
- ✅ Database connection works (no more 503 errors)
- ✅ Users can sign in with magic links
- ✅ Mood check-ins save successfully
- ✅ Experiences generate correctly

