# ✅ Corrected Vercel Environment Variables

## Your Current Vercel Environment Variables

✅ All variables are correctly set EXCEPT the `DATABASE_URL` needs to use **Connection Pooler** for IPv4 compatibility.

---

## ❌ Current DATABASE_URL (IPv6 - Won't work on Vercel)

```
DATABASE_URL=postgresql://postgres:Vova.developer123!@db.kkhunvnulyzohtmdsrub.supabase.co:5432/postgres?sslmode=require
```

**Problem:** This direct connection requires IPv6, but Vercel uses IPv4-only networks.

---

## ✅ Fixed DATABASE_URL (IPv4 Compatible - Use This)

You need to get the **pooled connection string** from Supabase Dashboard:

1. Go to **Supabase Dashboard** → Settings → Database → **Connection Pooling**
2. Copy the **Session Mode** connection string
3. Replace `[YOUR-PASSWORD]` with `Vova.developer123!`

**It should look like:**
```
DATABASE_URL=postgresql://postgres.kkhunvnulyzohtmdsrub:Vova.developer123!@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**Key differences:**
- Port: `5432` → `6543`
- Host: `db.xxx.supabase.co` → `aws-0-[region].pooler.supabase.com`
- Username: `postgres` → `postgres.kkhunvnulyzohtmdsrub`
- Added: `?pgbouncer=true&`

---

## ✅ All Other Variables (Correct - Keep These)

These are all correct in Vercel:

| Variable | Current Value | Status |
|----------|---------------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://calmsync.vercel.app` | ✅ Correct |
| `NEXTAUTH_SECRET` | `MHhfJCd2zgIrnj+v3rl06pmQDdnvzYfI0HokS29CNiw=` | ✅ Correct |
| `NEXTAUTH_URL` | `https://calmsync.vercel.app` | ✅ Correct |
| `RESEND_API_KEY` | `re_NHwNur1v_KtFJzkcMdakgrEETRMru1ozL` | ✅ Correct |
| `EMAIL_FROM` | `onboarding@resend.dev` | ✅ Correct |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kkhunvnulyzohtmdsrub.supabase.com` | ✅ Correct |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_ckOAF9IofJZvA-zmn6dBEQ_SV6Szcxc` | ✅ Correct |

---

## 🔍 Supabase Configuration Check

From your screenshots, Supabase is correctly configured:

✅ **Site URL:** `https://calmsync.vercel.app/`  
✅ **Redirect URLs:**
- `http://localhost:3000/auth/callback`
- `https://calmsync.vercel.app/auth/callback`

---

## 🎯 Action Required

**ONLY ONE CHANGE NEEDED:**

1. Update `DATABASE_URL` in Vercel to use **Connection Pooler**
2. Get the pooled connection string from Supabase Dashboard
3. Replace the current `DATABASE_URL` value
4. Redeploy

**That's it!** All other variables are correct.

---

## 📝 Summary

| Issue | Status | Fix |
|-------|--------|-----|
| Database connection (503 error) | ❌ Needs fix | Use Supabase Connection Pooler |
| Environment variables | ✅ All correct | No changes needed |
| Supabase redirect URLs | ✅ Correct | No changes needed |
| NEXTAUTH_URL | ✅ Correct | No changes needed |
| NEXT_PUBLIC_APP_URL | ✅ Correct | No changes needed |

