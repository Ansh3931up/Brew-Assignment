# 🎨 How to Change Colors - Step by Step Guide

This guide shows you exactly how to change colors in your theme.

## 📍 Quick Steps

1. **Edit `styles/theme.ts`** - Change color values
2. **Run `npm run generate:tokens`** - Generate CSS variables
3. **Restart dev server** - See changes immediately

---

## 🎯 Example: Changing Primary Brand Color

### Step 1: Open `styles/theme.ts`

```typescript
export const theme = {
  colors: {
    brand: {
      primary: '#3b82f6',        // ← Change this color
      primaryLight: '#60a5fa',   // ← And this (lighter version)
      primaryDark: '#2563eb',    // ← And this (darker version)
      // ...
    }
  }
}
```

### Step 2: Change the Color

**Before (Green):**
```typescript
primary: '#10b981',  // Green
```

**After (Blue):**
```typescript
primary: '#3b82f6',  // Blue
```

### Step 3: Regenerate Tokens

Run this command in your terminal:

```bash
npm run generate:tokens
```

You should see:
```
✅ tokens.css generated from theme.ts
```

### Step 4: Restart Dev Server

If your dev server is running, restart it:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: See Changes

All components using `bg-primary`, `text-primary`, `border-primary`, etc. will now use the new color!

---

## 🎨 What We Just Changed

I've updated your theme to demonstrate:

### Before (Green Theme):
- Primary: `#10b981` (Green)
- Secondary: `#064e3b` (Dark Green)

### After (Blue/Purple Theme):
- Primary: `#3b82f6` (Blue) ✨
- Secondary: `#7c3aed` (Purple) ✨

**All buttons, links, and primary-colored elements now use blue instead of green!**

---

## 📝 Common Color Changes

### Change Primary Color

```typescript
brand: {
  primary: '#YOUR_COLOR',        // Main color
  primaryLight: '#LIGHTER',      // 20-30% lighter
  primaryDark: '#DARKER',        // 20-30% darker
}
```

**Examples:**
- Blue: `#3b82f6` / `#60a5fa` / `#2563eb`
- Green: `#10b981` / `#6ee7b7` / `#047857`
- Purple: `#8b5cf6` / `#a78bfa` / `#6d28d9`
- Red: `#ef4444` / `#f87171` / `#dc2626`
- Orange: `#f59e0b` / `#fbbf24` / `#d97706`

### Change Background Colors

```typescript
background: {
  default: '#ffffff',    // Main background
  muted: '#f8fafc',      // Muted/sidebar background
  dark: '#0f172a',       // Dark mode background
  card: '#ffffff',       // Card background
}
```

### Change Text Colors

```typescript
text: {
  primary: '#0f172a',     // Main text (dark)
  secondary: '#475569',   // Secondary text (gray)
  disabled: '#94a3b8',    // Disabled text (light gray)
}
```

### Change Status Colors

```typescript
status: {
  success: '#10b981',  // Green
  error: '#ef4444',    // Red
  warning: '#f59e0b',  // Orange
  info: '#3b82f6'      // Blue
}
```

---

## 🔄 Complete Workflow

```bash
# 1. Edit theme.ts
# (Make your color changes)

# 2. Generate tokens
npm run generate:tokens

# 3. Restart dev server (if running)
# Ctrl+C to stop, then:
npm run dev

# 4. Check your changes
# Visit http://localhost:3000/test to see all colors
```

---

## 🎯 Where Colors Are Used

After changing colors in `theme.ts` and regenerating tokens:

- **`bg-primary`** → Uses `brand.primary`
- **`text-primary`** → Uses `brand.primary`
- **`bg-status-success`** → Uses `status.success`
- **`bg-background`** → Uses `background.default`
- **`text-foreground`** → Uses `text.primary`

All Tailwind utilities automatically use the new colors!

---

## 💡 Pro Tips

1. **Use a color picker** - Tools like [Coolors](https://coolors.co) or [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors) help pick colors
2. **Keep contrast** - Ensure text is readable on backgrounds (WCAG AA)
3. **Test dark mode** - Always check how colors look in dark mode
4. **Use the test page** - Visit `/test` to see all colors at once

---

## 🧪 Test Your Changes

After changing colors:

1. Visit `/test` page
2. Check the Color Palette section
3. Toggle dark mode to see both themes
4. Verify buttons, cards, and text use new colors

---

## 📚 Color Reference

### Current Theme (After Demo Change):
- **Primary**: Blue (`#3b82f6`)
- **Secondary**: Purple (`#7c3aed`)
- **Success**: Green (`#10b981`)
- **Error**: Red (`#ef4444`)
- **Warning**: Orange (`#f59e0b`)
- **Info**: Blue (`#3b82f6`)

### To Revert to Green Theme:
Change `brand.primary` back to `#10b981` and run `npm run generate:tokens`

---

## ✅ Summary

1. ✅ Edit `styles/theme.ts`
2. ✅ Run `npm run generate:tokens`
3. ✅ Restart dev server
4. ✅ See changes everywhere!

**That's it!** Your entire app's color scheme updates automatically. 🎉

