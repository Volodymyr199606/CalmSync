# 🔧 Fix IPv4 Connection Issue - Use Supabase Connection Pooler

## 🚨 The Problem

Vercel uses **IPv4-only networks**, but your current Supabase direct connection requires **IPv6**. That's why you're seeing:
- "Database connection error"
- 503 status codes
- Connection timeouts

## ✅ The Solution: Use Supabase Connection Pooler

Supabase provides a **Connection Pooler** specifically for serverless environments like Vercel. It:
- ✅ Works with IPv4 networks
- ✅ Handles connection pooling efficiently
- ✅ Prevents connection exhaustion
- ✅ Perfect for serverless/Vercel

---

## 📋 Step-by-Step Fix

### Step 1: Get Your Connection Pooler URL from Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll down to **Connection Pooling** section
4. Look for **"Connection String"** or **"Session Mode"** (Transaction mode also works)
5. Copy the connection string that looks like:

   ```
   postgresql://postgres.kkhunvnulyzohtmdsrub:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   **OR** if you see **"Transaction Mode"**, use that one.

6. Replace `[YOUR-PASSWORD]` with your actual password: `Vova.developer123!`

### Step 2: Update DATABASE_URL in Vercel

**Important differences in the pooled connection:**
- **Port changes:** `5432` → `6543`
- **Host changes:** `db.xxx.supabase.co` → `aws-0-[region].pooler.supabase.com`
- **Username changes:** `postgres` → `postgres.xxx` (your project reference)
- **Add parameter:** `?pgbouncer=true` (or it might already be in the URL)

**Your new DATABASE_URL should look like:**

```
postgresql://postgres.kkhunvnulyzohtmdsrub:Vova.developer123!@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**Note:** Replace `[region]` with your actual region (like `us-east-1`, `eu-west-1`, etc.)

### Step 3: Update Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Click to **Edit**
4. Replace the entire value with your new **pooled connection string**
5. Make sure **Production** and **Preview** are checked ✅
6. Click **Save**

### Step 4: Keep Local Development Using Direct Connection

**Don't change your `.env.local`** - keep using the direct connection locally:
```
DATABASE_URL="postgresql://postgres:Vova.developer123!@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres?sslmode=require"
```

This is fine because your local machine supports IPv6.

### Step 5: Redeploy

1. In Vercel Dashboard → **Deployments**
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Wait for completion (2-3 minutes)

---

## 🔍 How to Find Your Pooler Connection String

If you can't find it in Supabase Dashboard:

### Option A: From Connection String Modal
1. In Supabase Dashboard, click **"Connect to your project"** button
2. Click the **"Pooler settings"** button (from the IPv4 warning)
3. Copy the **Session Mode** connection string
4. Replace `[YOUR-PASSWORD]` with `Vova.developer123!`

### Option B: Construct It Manually
Based on your project reference `kkhunvnulyzohtmdsrub`, try:

```
postgresql://postgres.kkhunvnulyzohtmdsrub:Vova.developer123!@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

Common regions to try:
- `us-east-1`
- `us-west-1`
- `eu-west-1`
- `ap-southeast-1`

---

## ✅ Quick Checklist

Before redeploying:
- [ ] Got pooled connection string from Supabase Dashboard
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] Updated `DATABASE_URL` in Vercel (Production + Preview)
- [ ] Verified port is `6543` (not `5432`)
- [ ] Verified host contains `pooler` in the name
- [ ] Kept local `.env.local` unchanged (using direct connection)
- [ ] Redeployed the application

---

## 🧪 Test After Fix

1. Visit: `https://calmsync.vercel.app/dashboard`
2. Try to submit a mood check-in
3. Should work without "Database connection error"

---

## 📚 Reference

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- Your current direct connection: `postgresql://postgres:Vova.developer123!@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres?sslmode=require`
- Pooled connection will use port `6543` and `pooler` hostname

