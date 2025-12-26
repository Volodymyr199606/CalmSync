# 🔍 Supabase Pooler: Session Mode vs Transaction Mode

## Two Types of Pooler Connections

Based on the Supabase documentation you're viewing, there are TWO pooler modes:

### 1. Pooler Session Mode
- **Port:** `5432`
- **Best for:** Persistent servers when IPv4 is not supported
- **Hostname:** `aws-0-[REGION].pooler.supabase.com`
- **Example:** `postgres://postgres.xxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`

### 2. Pooler Transaction Mode ⭐ **USE THIS FOR VERCEL**
- **Port:** `6543`
- **Best for:** Serverless or edge functions (like Vercel!)
- **Hostname:** `aws-0-[REGION].pooler.supabase.com`
- **Example:** `postgres://postgres.xxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

---

## ✅ For Vercel: Use Transaction Mode (Port 6543)

Since Vercel is a **serverless platform**, you should use:
- ✅ **Transaction Mode** pooler
- ✅ Port **6543** (NOT 5432)
- ✅ Works perfectly with IPv4

---

## 📋 How to Get Your Actual Connection String

The documentation shows examples, but you need YOUR actual connection string:

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project

### Step 2: Get Pooler Connection String
1. Click **Settings** → **Database**
2. Scroll down to **Connection Pooling** section
3. You'll see two options:
   - **Session Mode** (port 5432) - for persistent servers
   - **Transaction Mode** (port 6543) - for serverless ⭐ **Use this one!**

### Step 3: Copy Transaction Mode Connection String
1. Under **Transaction Mode**, copy the connection string
2. It will look like:
   ```
   postgresql://postgres.kkhunvnulyzohtmdsrub:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
3. Replace `[YOUR-PASSWORD]` with: `Vova.developer123!`

### Step 4: Final Format for Vercel
```
postgresql://postgres.kkhunvnulyzohtmdsrub:Vova.developer123!@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

---

## 🎯 Key Points

1. **Documentation shows examples** - You need YOUR actual connection string from Dashboard
2. **Vercel = Serverless** - Use **Transaction Mode** (port 6543)
3. **Hostname must contain "pooler"** - Like `aws-0-[region].pooler.supabase.com`
4. **Username includes project ref** - Like `postgres.kkhunvnulyzohtmdsrub`

---

## ✅ Checklist for Vercel DATABASE_URL

Your connection string should have:
- [ ] Port **6543** (Transaction Mode for serverless)
- [ ] Hostname contains **"pooler"**
- [ ] Username is **postgres.kkhunvnulyzohtmdsrub** (includes project ref)
- [ ] Password is your actual password (not placeholder)
- [ ] Has `?pgbouncer=true` parameter

---

## Summary

- **Documentation:** ✅ Explains the concept (this page)
- **Actual connection string:** Get from Supabase Dashboard → Settings → Database → Connection Pooling → **Transaction Mode**
- **For Vercel:** Use **Transaction Mode** with port **6543** ⭐

