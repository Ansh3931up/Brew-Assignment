export const theme = {
  colors: {
    brand: {
      // Changed: Primary from green to blue
      primary: '#3b82f6', // Blue (was #10b981 green)
      primaryLight: '#60a5fa', // Light blue (was #6ee7b7)
      primaryDark: '#2563eb', // Dark blue (was #047857)

      // Changed: Secondary from dark green to purple
      secondary: '#7c3aed', // Purple (was #064e3b dark green)
      secondaryLight: '#a78bfa', // Light purple (was #0f8b63)
      secondaryDark: '#5b21b6' // Dark purple (was #033222)
    },
    status: {
      success: '#10b981', // Green - success
      error: '#ef4444', // Red - error
      warning: '#f59e0b', // Orange - warning
      info: '#3b82f6' // Blue - info
    },
    background: {
      default: '#ffffff', // White background
      muted: '#f8fafc', // Very light gray
      dark: '#0a0f1c', // Enhanced: Richer dark background (was #0f172a)
      surface: '#f1f5f9', // Light surface
      card: '#ffffff', // White card background
      // Enhanced dark mode specific colors
      cardDark: '#1a2332', // Enhanced: Slightly lighter card for better contrast (was #1e293b)
      mutedDark: '#1e2a3a', // Enhanced: Darker muted background for better hierarchy (was #334155)
      surfaceDark: '#151b26', // Enhanced: Darker surface for depth (was #1e293b)
      overlayDark: '#0d1117' // New: Overlay background for modals/dropdowns
    },
    text: {
      primary: '#0f172a', // Dark text
      secondary: '#475569', // Medium gray text
      disabled: '#94a3b8', // Light gray disabled text
      // Enhanced dark mode specific text colors
      primaryDark: '#f1f5f9', // Enhanced: Softer white for better readability (was #ffffff)
      secondaryDark: '#cbd5e1', // Light gray text for dark mode
      disabledDark: '#64748b', // Medium gray disabled text for dark mode
      mutedDark: '#94a3b8' // New: Muted text color for dark mode
    },
    accent: {
      blue: '#3b82f6', // Blue accent
      yellow: '#facc15', // Yellow accent
      purple: '#8b5cf6', // Purple accent
      pink: '#ec4899', // Pink accent
      green: '#22c55e' // Green accent
    },
    border: {
      default: '#e2e8f0', // Light border
      dark: '#94a3b8', // Medium border
      // Enhanced dark mode specific borders
      darkMode: '#2d3748', // Enhanced: Better contrast border (was #334155)
      darkModeSubtle: '#1e293b', // New: Subtle border for cards
      darkModeStrong: '#475569' // New: Strong border for focus states
    }
  }
} as const
