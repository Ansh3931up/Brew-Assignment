import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif']
      },
      colors: {
        /**
         * Color System Architecture:
         *
         * In Tailwind CSS v4, colors are primarily defined in @theme block (globals.css)
         * This config provides additional color mappings for backward compatibility
         * and nested color structures that @theme doesn't support directly.
         *
         * All colors reference tokens.css variables (single source of truth)
         */

        // ShadCN UI color aliases - these work with @theme colors
        // Use: bg-background, text-foreground, bg-primary, text-primary-foreground, etc.
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)'
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)'
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)'
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)'
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',

        // Direct tokens.css colors (from styles/tokens.css, generated from theme.ts)
        // Use: bg-brand-primary, text-status-success, bg-accent-theme-blue, etc.
        brand: {
          primary: 'var(--color-brand-primary)',
          'primary-light': 'var(--color-brand-primary-light)',
          'primary-dark': 'var(--color-brand-primary-dark)',
          secondary: 'var(--color-brand-secondary)',
          'secondary-light': 'var(--color-brand-secondary-light)',
          'secondary-dark': 'var(--color-brand-secondary-dark)'
        },
        status: {
          success: 'var(--color-status-success)',
          error: 'var(--color-status-error)',
          warning: 'var(--color-status-warning)',
          info: 'var(--color-status-info)'
        },
        'accent-theme': {
          blue: 'var(--color-accent-theme-blue)',
          yellow: 'var(--color-accent-theme-yellow)',
          purple: 'var(--color-accent-theme-purple)',
          pink: 'var(--color-accent-theme-pink)',
          green: 'var(--color-accent-theme-green)'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  }
} satisfies Config
