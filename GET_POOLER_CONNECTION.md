# 🔍 How to Get Supabase Connection Pooler URL

## Current View (Direct Connection - ❌ Wrong for Vercel)

You're currently seeing:
```
postgresql://postgres:[YOUR-PASSWORD]@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres
```

**This is the DIRECT connection:**
- ❌ Port: `5432`
- ❌ Host: `db.kkhunvnulyzohtmdsrub.supabase.co` (NO "pooler" in name)
- ❌ Username: `postgres`
- ❌ Not IPv4 compatible (won't work on Vercel)

---

## What You Need (Pooler Connection - ✅ Correct for Vercel)

After clicking "Pooler settings", you'll see:
```
postgresql://postgres.kkhunvnulyzohtmdsrub:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**This is the POOLER connection:**
- ✅ Port: `6543`
- ✅ Host: `aws-0-[region].pooler.supabase.com` (CONTAINS "pooler")
- ✅ Username: `postgres.kkhunvnulyzohtmdsrub` (includes project ref)
- ✅ IPv4 compatible (works on Vercel)

---

## Step-by-Step Instructions

### Step 1: Click "Pooler settings" Button

In the Supabase modal you're currently viewing:
1. Look for the **red warning** that says "Not IPv4 compatible"
2. Click the button **"Pooler settings"** (next to "IPv4 add-on")
3. This will switch the view to show Connection Pooling options

### Step 2: Select Session Mode

After clicking "Pooler settings":
1. You'll see different modes: **Session Mode** or **Transaction Mode**
2. Choose **Session Mode** (recommended for most applications)
3. Copy the connection string shown

### Step 3: Replace Password

The connection string will have `[YOUR-PASSWORD]` placeholder:
- Replace it with your actual password: `Vova.developer123!`

### Step 4: Final Format Should Be

```
postgresql://postgres.kkhunvnulyzohtmdsrub:Vova.developer123!@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**Key differences from direct connection:**
- ✅ Port `6543` (not `5432`)
- ✅ Host contains `pooler` (not `db.xxx`)
- ✅ Username is `postgres.kkhunvnulyzohtmdsrub` (not just `postgres`)
- ✅ Has `?pgbouncer=true` parameter

---

## Quick Checklist

Before using the connection string, verify it has:
- [ ] Port `6543` (not `5432`)
- [ ] Hostname contains word "pooler"
- [ ] Username includes your project ref (like `postgres.kkhunvnulyzohtmdsrub`)
- [ ] Password is replaced (not `[YOUR-PASSWORD]`)
- [ ] Has `?pgbouncer=true` parameter

---

## Alternative: Find It in Dashboard

If the "Pooler settings" button doesn't work:

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** (gear icon in sidebar)
3. Click **Database**
4. Scroll down to **Connection Pooling** section
5. Look for **"Connection String"** under **Session Mode**
6. Copy that string

---

## Summary

**Current (Direct - Wrong for Vercel):**
```
db.kkhunvnulyzohtmdsrub.supabase.co:5432
```

**Needed (Pooler - Correct for Vercel):**
```
aws-0-[region].pooler.supabase.com:6543
```

The hostname MUST contain "pooler" and port MUST be 6543! ✅

