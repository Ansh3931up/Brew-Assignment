'use client'

import { useTheme, themeColors, type ThemeColor } from '@/providers/theme-provider'
import { Check } from 'lucide-react'

export function SimpleColorPicker() {
  const { color, setColor } = useTheme()

  return (
    <div className="flex items-center gap-2">
      {(Object.keys(themeColors) as ThemeColor[]).map((colorOption) => (
        <button
          key={colorOption}
          onClick={() => setColor(colorOption)}
          className={`relative w-6 h-6 rounded-full transition-all hover:scale-110 ${
            color === colorOption
              ? 'ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background-dark ring-brand-primary scale-110'
              : ''
          }`}
          style={{
            backgroundColor: themeColors[colorOption].primary,
          }}
          aria-label={`Select ${colorOption} theme`}
          title={colorOption.charAt(0).toUpperCase() + colorOption.slice(1)}
        >
          {color === colorOption && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="h-3 w-3 text-white drop-shadow-lg" strokeWidth={3} />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

