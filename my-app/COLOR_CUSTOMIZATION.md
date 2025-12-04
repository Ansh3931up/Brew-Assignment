toke# 🎨 Color Customization Guide

This guide explains how to customize colors in the ECOVA project. All colors are managed through a centralized system that ensures consistency across light and dark modes.

## 📋 Table of Contents

- [Color System Architecture](#color-system-architecture)
- [How to Change Colors](#how-to-change-colors)
- [Color Flow](#color-flow)
- [Examples](#examples)
- [Dark Mode](#dark-mode)

---

## 🏗️ Color System Architecture

The color system follows this hierarchy:

```
theme.ts (Source of Truth)
    ↓
tokens.css (Generated CSS Variables)
    ↓
globals.css (@theme block)
    ↓
Tailwind Utilities (bg-primary, text-foreground, etc.)
    ↓
Components
```

### Key Files

1. **`styles/theme.ts`** - Single source of truth for all colors
2. **`styles/tokens.css`** - Auto-generated CSS variables (DO NOT EDIT MANUALLY)
3. **`app/globals.css`** - Maps tokens to Tailwind theme via `@theme` block
4. **`tailwind.config.ts`** - Additional color aliases (optional, mainly for backward compatibility)

---

## 🎯 How to Change Colors

### Step 1: Edit `styles/theme.ts`

Open `styles/theme.ts` and modify the color values:

```typescript
export const theme = {
  colors: {
    brand: {
      primary: '#10b981',        // Change this to your brand color
      primaryLight: '#6ee7b7',
      primaryDark: '#047857',
      // ... other brand colors
    },
    status: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    },
    background: {
      default: '#ffffff',
      muted: '#f8fafc',
      dark: '#0f172a',           // Dark mode background
      surface: '#f1f5f9',
      card: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8'
    },
    // ... other color categories
  }
} as const
```

### Step 2: Regenerate `tokens.css`

After editing `theme.ts`, regenerate the CSS tokens:

```bash
npm run generate:tokens
```

This command:
- Reads colors from `theme.ts`
- Generates CSS variables in `tokens.css`
- Creates variables like `--color-brand-primary`, `--color-background-default`, etc.

### Step 3: Verify Changes

1. **Restart your dev server** (if running):
   ```bash
   npm run dev
   ```

2. **Check the test page**: Navigate to `/test` to see all colors in action

3. **Test dark mode**: Toggle dark mode to ensure colors work in both themes

---

## 🔄 Color Flow

### Example: Changing Primary Brand Color

1. **Edit `theme.ts`**:
   ```typescript
   brand: {
     primary: '#3b82f6',  // Changed from #10b981 to blue
   }
   ```

2. **Regenerate tokens**:
   ```bash
   npm run generate:tokens
   ```

3. **Result**: 
   - `tokens.css` now has `--color-brand-primary: #3b82f6`
   - `globals.css` `@theme` block references this variable
   - Tailwind utilities (`bg-primary`, `text-primary`, etc.) automatically use the new color
   - All components using `bg-primary` will show the new color

---

## 📝 Examples

### Example 1: Change Brand Primary Color

**Goal**: Change the primary brand color from green (`#10b981`) to blue (`#3b82f6`)

1. Edit `styles/theme.ts`:
   ```typescript
   brand: {
     primary: '#3b82f6',  // Blue instead of green
   }
   ```

2. Run:
   ```bash
   npm run generate:tokens
   ```

3. Done! All `bg-primary` classes now use blue.

### Example 2: Change Background Colors

**Goal**: Use a custom background color

1. Edit `styles/theme.ts`:
   ```typescript
   background: {
     default: '#fafafa',  // Light gray instead of white
     dark: '#1a1a1a',     // Custom dark mode background
   }
   ```

2. Run:
   ```bash
   npm run generate:tokens
   ```

3. Done! All backgrounds update automatically.

### Example 3: Add a New Color

**Goal**: Add a new accent color (e.g., orange)

1. Edit `styles/theme.ts`:
   ```typescript
   accent: {
     blue: '#3b82f6',
     yellow: '#facc15',
     purple: '#8b5cf6',
     pink: '#ec4899',
     green: '#22c55e',
     orange: '#f97316',  // New color
   }
   ```

2. Run:
   ```bash
   npm run generate:tokens
   ```

3. Use in components:
   ```tsx
   <div className="bg-accent-theme-orange">
     Orange accent
   </div>
   ```

---

## 🌙 Dark Mode

Dark mode colors are automatically handled:

1. **Background colors** switch to dark variants (defined in `theme.ts`)
2. **Text colors** invert for readability
3. **Component colors** adapt automatically

### Customizing Dark Mode Colors

Dark mode overrides are defined in `app/globals.css`:

```css
.dark {
  --color-background: var(--color-background-dark);
  --color-foreground: #ffffff;
  --color-card: #1e293b;
  /* ... other dark mode overrides */
}
```

To customize dark mode:

1. **Edit background colors in `theme.ts`**:
   ```typescript
   background: {
     dark: '#0a0a0a',  // Your custom dark background
   }
   ```

2. **Or override in `globals.css`**:
   ```css
   .dark {
     --color-background: #0a0a0a;  // Direct override
   }
   ```

---

## 🎨 Available Color Categories

### Brand Colors
- `brand.primary` → `bg-brand-primary`
- `brand.secondary` → `bg-brand-secondary`
- Light/dark variants available

### Status Colors
- `status.success` → `bg-status-success`
- `status.error` → `bg-status-error`
- `status.warning` → `bg-status-warning`
- `status.info` → `bg-status-info`

### Background Colors
- `background.default` → `bg-background`
- `background.muted` → `bg-muted`
- `background.dark` → Used in dark mode
- `background.card` → `bg-card`

### Text Colors
- `text.primary` → `text-foreground`
- `text.secondary` → `text-muted-foreground`
- `text.disabled` → `text-disabled`

### Accent Colors
- `accent.blue` → `bg-accent-theme-blue`
- `accent.yellow` → `bg-accent-theme-yellow`
- `accent.purple` → `bg-accent-theme-purple`
- `accent.pink` → `bg-accent-theme-pink`
- `accent.green` → `bg-accent-theme-green`

### ShadCN UI Colors
These are automatically mapped from tokens:
- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-accent`, `text-accent-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `border-border`

---

## ✅ Best Practices

1. **Always edit `theme.ts`** - Never edit `tokens.css` directly (it's auto-generated)

2. **Regenerate after changes** - Run `npm run generate:tokens` after editing `theme.ts`

3. **Use semantic names** - Use names like `primary`, `success`, `error` instead of color names like `blue`, `red`

4. **Test both themes** - Always test your changes in both light and dark mode

5. **Use Tailwind utilities** - Use classes like `bg-primary` instead of inline styles

6. **Check the test page** - Visit `/test` to see all colors in action

---

## 🐛 Troubleshooting

### Colors not updating?

1. **Regenerate tokens**:
   ```bash
   npm run generate:tokens
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Clear browser cache** - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

4. **Check `tokens.css`** - Verify the CSS variables were generated correctly

### Dark mode not working?

1. **Check `globals.css`** - Ensure `.dark` class overrides are present

2. **Verify theme toggle** - Check that `ThemeToggle` component is working

3. **Check browser console** - Look for any CSS errors

---

## 📚 Additional Resources

- **Test Page**: `/test` - See all colors in action
- **Theme File**: `styles/theme.ts` - Edit colors here
- **Generated Tokens**: `styles/tokens.css` - Auto-generated (don't edit)
- **Tailwind Config**: `tailwind.config.ts` - Additional color aliases

---

## 🎯 Quick Reference

```bash
# Change colors in theme.ts, then:
npm run generate:tokens

# Restart dev server:
npm run dev

# Test colors:
# Visit http://localhost:3000/test
```

---

**Remember**: All colors flow from `theme.ts` → `tokens.css` → `globals.css` → Tailwind utilities → Components. Edit `theme.ts` and regenerate tokens to change colors system-wide!

