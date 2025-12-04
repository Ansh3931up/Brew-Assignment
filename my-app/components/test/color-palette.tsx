'use client'

export function ColorPalette() {
  const colors = [
    // ShadCN UI Colors
    {
      name: 'Primary',
      class: 'bg-primary',
      textClass: 'text-primary-foreground',
      category: 'ShadCN'
    },
    {
      name: 'Secondary',
      class: 'bg-secondary',
      textClass: 'text-secondary-foreground',
      category: 'ShadCN'
    },
    {
      name: 'Card',
      class: 'bg-card',
      textClass: 'text-card-foreground',
      category: 'ShadCN'
    },
    {
      name: 'Muted',
      class: 'bg-muted',
      textClass: 'text-muted-foreground',
      category: 'ShadCN'
    },
    {
      name: 'Accent',
      class: 'bg-accent',
      textClass: 'text-accent-foreground',
      category: 'ShadCN'
    },
    {
      name: 'Destructive',
      class: 'bg-destructive',
      textClass: 'text-destructive-foreground',
      category: 'ShadCN'
    },
    // Status Colors from tokens.css
    {
      name: 'Success',
      class: 'bg-status-success',
      textClass: 'text-white',
      category: 'Status'
    },
    {
      name: 'Error',
      class: 'bg-status-error',
      textClass: 'text-white',
      category: 'Status'
    },
    {
      name: 'Warning',
      class: 'bg-status-warning',
      textClass: 'text-white',
      category: 'Status'
    },
    {
      name: 'Info',
      class: 'bg-status-info',
      textClass: 'text-white',
      category: 'Status'
    },
    // Brand Colors from tokens.css
    {
      name: 'Brand Primary',
      class: 'bg-brand-primary',
      textClass: 'text-white',
      category: 'Brand'
    },
    {
      name: 'Brand Secondary',
      class: 'bg-brand-secondary',
      textClass: 'text-white',
      category: 'Brand'
    },
    // Accent Colors from tokens.css
    {
      name: 'Accent Blue',
      class: 'bg-accent-theme-blue',
      textClass: 'text-white',
      category: 'Accent'
    },
    {
      name: 'Accent Green',
      class: 'bg-accent-theme-green',
      textClass: 'text-white',
      category: 'Accent'
    },
    {
      name: 'Accent Purple',
      class: 'bg-accent-theme-purple',
      textClass: 'text-white',
      category: 'Accent'
    },
    {
      name: 'Accent Yellow',
      class: 'bg-accent-theme-yellow',
      textClass: 'text-foreground',
      category: 'Accent'
    },
    {
      name: 'Accent Pink',
      class: 'bg-accent-theme-pink',
      textClass: 'text-white',
      category: 'Accent'
    },
    // Background Colors
    {
      name: 'Background',
      class: 'bg-background',
      textClass: 'text-foreground',
      category: 'Background'
    },
    {
      name: 'Border',
      class: 'bg-border',
      textClass: 'text-foreground',
      category: 'Background'
    }
  ]

  const categories = ['ShadCN', 'Status', 'Brand', 'Accent', 'Background']

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-2xl font-semibold">Theme Colors</h3>
        <p className="text-muted-foreground text-sm">
          All colors from tokens.css - centralized theme system
        </p>
      </div>
      {categories.map((category) => {
        const categoryColors = colors.filter((c) => c.category === category)
        if (categoryColors.length === 0) return null
        return (
          <div key={category} className="space-y-3">
            <h4 className="text-foreground text-lg font-medium">{category} Colors</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {categoryColors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    className={`border-border h-24 rounded-lg border ${color.class} ${color.textClass} flex items-center justify-center font-medium shadow-sm`}
                  >
                    {color.name}
                  </div>
                  <p className="text-foreground text-center text-sm font-medium">
                    {color.name}
                  </p>
                  <p className="text-muted-foreground text-center font-mono text-xs">
                    {color.class}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
