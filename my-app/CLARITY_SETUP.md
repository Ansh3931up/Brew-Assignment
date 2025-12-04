# 🎯 Microsoft Clarity Setup Guide

## ✅ Current Status

Your Clarity component is **already configured** and ready to use! It will automatically load once you add your Clarity ID.

---

## 📝 Step-by-Step Setup

### Step 1: Get Your Clarity Account & ID

1. **Sign up for Clarity** (Free):
   - Go to: https://clarity.microsoft.com/
   - Click **"Sign in"** → Use your Microsoft account (or create one)
   - Click **"Create Project"**

2. **Get Your Project ID**:
   - After creating a project, you'll see your **Project ID** (looks like: `abc123xyz`)
   - Copy this ID

### Step 2: Add Clarity ID to Environment Variables

Add this to your `.env.local` file:

```bash
NEXT_PUBLIC_CLARITY_ID=your_project_id_here
```

**Example:**
```bash
NEXT_PUBLIC_CLARITY_ID=abc123xyz
```

### Step 3: Restart Your Dev Server

```bash
npm run dev
```

That's it! Clarity will automatically start tracking.

---

## 🔧 How It Works

- **Without Clarity ID**: Component loads but does nothing (safe, no errors)
- **With Clarity ID**: Automatically injects Clarity script and starts tracking
- **Type-safe**: Uses Zod validation for environment variables
- **Server-safe**: Clarity component is a Client Component (no SSR issues)

---

## 📍 Files Modified

- ✅ `components/analytics/clarity.tsx` - Client component with env variable
- ✅ `lib/types/env.ts` - Added `NEXT_PUBLIC_CLARITY_ID` (optional)
- ✅ `lib/types/clarity.d.ts` - TypeScript declarations for `window.clarity`

---

## 🚀 Production Deployment

Make sure to add `NEXT_PUBLIC_CLARITY_ID` to your production environment variables:

- **Vercel**: Project Settings → Environment Variables
- **Other platforms**: Add to your production `.env` file

---

## ✅ Verification

After adding your ID and restarting:

1. Open your app in browser
2. Open DevTools → Network tab
3. Look for request to `clarity.ms/tag/YOUR_ID`
4. Check Clarity dashboard → Should show "Recording" status

---

**Need help?** Check Clarity docs: https://docs.microsoft.com/en-us/clarity/

