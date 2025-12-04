'use client'

import { useTheme, themeColors, type ThemeColor } from '@/providers/theme-provider'
import { Check } from 'lucide-react'

export function ThemeColorPicker() {
  const { color, setColor } = useTheme()

  const colorNames: Record<ThemeColor, string> = {
    blue: 'Blue',
    purple: 'Purple',
    green: 'Green',
    pink: 'Pink',
    orange: 'Orange',
    red: 'Red',
    teal: 'Teal',
    indigo: 'Indigo',
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-foreground dark:text-text-primaryDark uppercase tracking-wider">
        Theme Color
      </div>
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(themeColors) as ThemeColor[]).map((colorOption) => (
          <button
            key={colorOption}
            onClick={() => setColor(colorOption)}
            className={`relative group w-10 h-10 rounded-lg transition-all hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-offset-background dark:hover:ring-offset-background-dark hover:ring-brand-primary ${
              color === colorOption
                ? 'ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background-dark ring-brand-primary scale-105'
                : ''
            }`}
            style={{
              backgroundColor: themeColors[colorOption].primary,
            }}
            aria-label={`Select ${colorNames[colorOption]} theme`}
            title={colorNames[colorOption]}
          >
            {color === colorOption && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="h-4 w-4 text-white drop-shadow-lg" strokeWidth={3} />
              </div>
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-xs text-foreground dark:text-text-mutedDark whitespace-nowrap">
                {colorNames[colorOption]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

