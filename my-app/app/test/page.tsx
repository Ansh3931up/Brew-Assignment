'use client'

import { useState } from 'react'
import { toastService } from '@/lib/utils/toast'
import { soundService } from '@/lib/utils/sound'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SoundSettings } from '@/components/sound-settings'
import { ColorPalette } from '@/components/test/color-palette'

export default function TestPage() {
  const [testInput, setTestInput] = useState('')

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-6xl space-y-12 p-8">
        <div className="space-y-2">
          <h1 className="font-heading text-foreground text-4xl font-bold">
            🧪 Component Test Page
          </h1>
          <p className="text-muted-foreground">
            Test all features, components, and implementations in one place
          </p>
        </div>

        {/* Toast Notifications Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Toast Notifications
          </h2>
          <p className="text-muted-foreground text-sm">
            Test different types of toast notifications
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                toastService.success('Success! Operation completed successfully.')
              }
              className="bg-status-success hover:bg-status-success/90 rounded-md px-4 py-2 font-medium text-white transition-colors"
            >
              Success Toast
            </button>
            <button
              onClick={() => toastService.error('Error! Something went wrong.')}
              className="bg-status-error hover:bg-status-error/90 rounded-md px-4 py-2 font-medium text-white transition-colors"
            >
              Error Toast
            </button>
            <button
              onClick={() => toastService.info('Info! Here is some information.')}
              className="bg-status-info hover:bg-status-info/90 rounded-md px-4 py-2 font-medium text-white transition-colors"
            >
              Info Toast
            </button>
            <button
              onClick={() => toastService.warning('Warning! Please be careful.')}
              className="bg-status-warning hover:bg-status-warning/90 rounded-md px-4 py-2 font-medium text-white transition-colors"
            >
              Warning Toast
            </button>
            <button
              onClick={() => toastService.default('Default notification message.')}
              className="bg-muted text-muted-foreground hover:bg-muted/90 rounded-md px-4 py-2 font-medium transition-colors"
            >
              Default Toast
            </button>
          </div>
        </section>

        {/* Sound Testing Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Sound Testing
          </h2>
          <p className="text-muted-foreground text-sm">
            Test sound notifications (requires user interaction)
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                soundService.success()
                toastService.success('Success sound played!')
              }}
              className="bg-status-success hover:bg-status-success/90 rounded-md px-4 py-2 font-medium text-white transition-colors"
            >
              Play Success Sound
            </button>
            <button
              onClick={() => {
                soundService.error()
                toastService.error('Error sound played!')
              }}
              className="bg-status-error hover:bg-status-error/90 rounded-md px-4 py-2 font-medium text-white transition-colors"
            >
              Play Error Sound
            </button>
            <button
              onClick={() => {
                soundService.notification()
                toastService.info('Notification sound played!')
              }}
              className="bg-status-info hover:bg-status-info/90 rounded-md px-4 py-2 font-medium text-white transition-colors"
            >
              Play Notification Sound
            </button>
          </div>
          <SoundSettings />
        </section>

        {/* Theme Testing Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Theme Testing
          </h2>
          <p className="text-muted-foreground text-sm">
            Toggle between light and dark themes
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <p className="text-muted-foreground text-sm">
              Or use keyboard shortcut:{' '}
              <kbd className="bg-muted text-muted-foreground border-border rounded border px-2 py-1 font-mono text-xs">
                Ctrl/Cmd + Shift + T
              </kbd>
            </p>
          </div>
        </section>

        {/* Dark Mode Testing Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Dark Mode Testing
          </h2>
          <p className="text-muted-foreground text-sm">
            Test how components look in dark mode. Toggle dark mode above to see the
            changes.
          </p>
          <div className="space-y-4">
            <div className="bg-muted border-border rounded-lg border p-4">
              <h3 className="font-heading text-foreground mb-2 text-lg font-semibold">
                Dark Mode Preview
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                All colors automatically adapt to dark mode. Toggle the theme to see the
                difference.
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="bg-background border-border rounded-md border p-3">
                  <p className="text-foreground mb-1 text-xs font-medium">Background</p>
                  <p className="text-muted-foreground font-mono text-xs">bg-background</p>
                </div>
                <div className="bg-card border-border rounded-md border p-3">
                  <p className="text-card-foreground mb-1 text-xs font-medium">Card</p>
                  <p className="text-muted-foreground font-mono text-xs">bg-card</p>
                </div>
                <div className="bg-muted border-border rounded-md border p-3">
                  <p className="text-muted-foreground mb-1 text-xs font-medium">Muted</p>
                  <p className="text-muted-foreground font-mono text-xs">bg-muted</p>
                </div>
                <div className="bg-primary border-border rounded-md border p-3">
                  <p className="text-primary-foreground mb-1 text-xs font-medium">
                    Primary
                  </p>
                  <p className="text-primary-foreground/70 font-mono text-xs">
                    bg-primary
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-background text-foreground border-border rounded-md border px-3 py-1 text-sm">
                Background
              </span>
              <span className="bg-card text-card-foreground border-border rounded-md border px-3 py-1 text-sm">
                Card
              </span>
              <span className="bg-muted text-muted-foreground border-border rounded-md border px-3 py-1 text-sm">
                Muted
              </span>
              <span className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm">
                Primary
              </span>
              <span className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm">
                Secondary
              </span>
              <span className="bg-accent text-accent-foreground border-border rounded-md border px-3 py-1 text-sm">
                Accent
              </span>
              <span className="bg-destructive text-destructive-foreground rounded-md px-3 py-1 text-sm">
                Destructive
              </span>
            </div>
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
              <p className="text-foreground text-sm">
                💡 <strong>Tip:</strong> Dark mode colors are automatically applied when
                you toggle the theme. All components use semantic color tokens that adapt
                to the current theme.
              </p>
            </div>

            {/* Enhanced Dark Mode Features */}
            <div className="bg-primary/5 border-primary/20 mt-6 rounded-lg border p-4">
              <h4 className="font-heading text-foreground mb-3 text-sm font-semibold">
                ✨ Enhanced Dark Mode Features
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Richer Backgrounds</strong> - Deeper, more comfortable dark
                    backgrounds (#0a0f1c)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Better Contrast</strong> - Enhanced card and surface colors
                    for better visual hierarchy
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Smooth Transitions</strong> - 0.3s ease transitions when
                    switching themes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Enhanced Borders</strong> - Better border contrast for
                    improved component separation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Optimized Text</strong> - Softer white (#f1f5f9) for better
                    readability and reduced eye strain
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Card Shadows</strong> - Subtle shadows for depth and visual
                    separation
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Glass Effect Section */}
        <section className="border-border bg-card relative space-y-4 overflow-hidden rounded-lg border p-6 shadow-sm">
          {/* Background pattern for glass effect demo */}
          <div className="from-primary/20 via-secondary/20 to-accent-theme-purple/20 absolute inset-0 -z-10 bg-linear-to-br opacity-50" />
          <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          <h2 className="font-heading text-foreground relative z-10 text-2xl font-semibold">
            ✨ Apple-Style Glass Effect
          </h2>
          <p className="text-muted-foreground relative z-10 text-sm">
            Frosted glass effects inspired by macOS Big Sur and iOS 15+. Works beautifully
            in both light and dark modes.
          </p>

          <div className="relative z-10 space-y-6">
            {/* Glass Effect Variants */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="glass rounded-lg p-4">
                <h3 className="font-heading text-foreground mb-2 text-sm font-semibold">
                  Standard Glass
                </h3>
                <p className="text-muted-foreground text-xs">Default glass effect</p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">.glass</p>
              </div>

              <div className="glass-light rounded-lg p-4">
                <h3 className="font-heading text-foreground mb-2 text-sm font-semibold">
                  Light Glass
                </h3>
                <p className="text-muted-foreground text-xs">Lighter, more transparent</p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  .glass-light
                </p>
              </div>

              <div className="glass-strong rounded-lg p-4">
                <h3 className="font-heading text-foreground mb-2 text-sm font-semibold">
                  Strong Glass
                </h3>
                <p className="text-muted-foreground text-xs">
                  More opaque, stronger blur
                </p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  .glass-strong
                </p>
              </div>

              <div className="glass-dark rounded-lg p-4">
                <h3 className="font-heading text-foreground mb-2 text-sm font-semibold">
                  Dark Glass
                </h3>
                <p className="text-muted-foreground text-xs">Optimized for dark mode</p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  .glass-dark
                </p>
              </div>
            </div>

            {/* Colored Glass Effects */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-primary rounded-lg p-4">
                <h3 className="font-heading text-foreground mb-2 text-sm font-semibold">
                  Primary Glass
                </h3>
                <p className="text-muted-foreground text-xs">Tinted with primary color</p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  .glass-primary
                </p>
              </div>

              <div className="glass-secondary rounded-lg p-4">
                <h3 className="font-heading text-foreground mb-2 text-sm font-semibold">
                  Secondary Glass
                </h3>
                <p className="text-muted-foreground text-xs">
                  Tinted with secondary color
                </p>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  .glass-secondary
                </p>
              </div>
            </div>

            {/* Glass Effect Usage Examples */}
            <div className="glass rounded-lg p-6">
              <h3 className="font-heading text-foreground mb-4 text-lg font-semibold">
                Usage Examples
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-foreground mb-2 text-sm font-medium">
                    Basic Glass Card:
                  </p>
                  <pre className="bg-background/50 border-border/50 overflow-x-auto rounded border p-3 font-mono text-xs">
                    {`<div className="glass rounded-lg p-4">
  Content here
</div>`}
                  </pre>
                </div>

                <div>
                  <p className="text-foreground mb-2 text-sm font-medium">
                    Glass Navigation Bar:
                  </p>
                  <pre className="bg-background/50 border-border/50 overflow-x-auto rounded border p-3 font-mono text-xs">
                    {`<nav className="glass-light fixed top-0 w-full p-4">
  Navigation content
</nav>`}
                  </pre>
                </div>

                <div>
                  <p className="text-foreground mb-2 text-sm font-medium">
                    Glass Modal/Dialog:
                  </p>
                  <pre className="bg-background/50 border-border/50 overflow-x-auto rounded border p-3 font-mono text-xs">
                    {`<div className="glass-strong rounded-xl p-6 max-w-md">
  Modal content
</div>`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Glass Effect Features */}
            <div className="bg-muted/50 border-border/50 rounded-lg border p-4">
              <h4 className="font-heading text-foreground mb-3 text-sm font-semibold">
                🎨 Glass Effect Features
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Backdrop Blur</strong> - 20-40px blur for that frosted glass
                    look
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Saturation Boost</strong> - 180-200% saturation for vibrant
                    colors
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Smart Transparency</strong> - Adapts to light/dark mode
                    automatically
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Subtle Borders</strong> - Semi-transparent borders for
                    definition
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Depth Shadows</strong> - Soft shadows for elevation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Browser Support</strong> - Works in all modern browsers with
                    fallbacks
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <ColorPalette />
        </section>

        {/* Keyboard Navigation Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Keyboard Navigation
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Try these keyboard shortcuts:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <kbd className="bg-muted text-muted-foreground border-border rounded border px-3 py-1 font-mono text-sm">
                Ctrl/Cmd + Shift + T
              </kbd>
              <span className="text-foreground text-sm">Toggle theme</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="bg-muted text-muted-foreground border-border rounded border px-3 py-1 font-mono text-sm">
                Ctrl/Cmd + /
              </kbd>
              <span className="text-foreground text-sm">
                Show keyboard shortcuts help
              </span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="bg-muted text-muted-foreground border-border rounded border px-3 py-1 font-mono text-sm">
                Escape
              </kbd>
              <span className="text-foreground text-sm">Close modals/dropdowns</span>
            </div>
          </div>
          <button
            onClick={() =>
              toastService.info('Keyboard shortcuts: Ctrl+Shift+T (Theme), Ctrl+/ (Help)')
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 font-medium transition-colors"
          >
            Test Keyboard Shortcuts Toast
          </button>
        </section>

        {/* Form Testing Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Form Testing
          </h2>
          <p className="text-muted-foreground text-sm">
            Test form inputs and interactions
          </p>
          <div className="max-w-md space-y-4">
            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Test Input
              </label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type something..."
                className="border-border bg-background text-foreground focus:ring-ring w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                if (testInput.trim()) {
                  toastService.success(`You entered: ${testInput}`)
                  soundService.success()
                  setTestInput('')
                } else {
                  toastService.warning('Please enter something first')
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors"
            >
              Submit with Toast & Sound
            </button>
          </div>
        </section>

        {/* Button Variants Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Button Variants
          </h2>
          <p className="text-muted-foreground text-sm">
            Test different button styles and states
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors">
              Primary Button
            </button>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2 font-medium transition-colors">
              Secondary Button
            </button>
            <button className="bg-status-success hover:bg-status-success/90 rounded-md px-4 py-2 font-medium text-white transition-colors">
              Success Button
            </button>
            <button className="bg-status-error hover:bg-status-error/90 rounded-md px-4 py-2 font-medium text-white transition-colors">
              Error Button
            </button>
            <button className="bg-status-warning hover:bg-status-warning/90 rounded-md px-4 py-2 font-medium text-white transition-colors">
              Warning Button
            </button>
            <button className="bg-status-info hover:bg-status-info/90 rounded-md px-4 py-2 font-medium text-white transition-colors">
              Info Button
            </button>
            <button className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 font-medium transition-colors">
              Outline Button
            </button>
            <button className="bg-muted text-muted-foreground hover:bg-muted/90 rounded-md px-4 py-2 font-medium transition-colors">
              Muted Button
            </button>
          </div>
        </section>

        {/* Typography & Fonts Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            Typography & Fonts
          </h2>
          <p className="text-muted-foreground text-sm">
            Test typography scales and verify fonts are properly loaded
          </p>

          {/* Font Testing */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-heading text-foreground text-lg font-semibold">
                Font Families
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border-border bg-muted/50 rounded-lg border p-4">
                  <p className="text-muted-foreground mb-2 font-mono text-xs">
                    font-heading
                  </p>
                  <p
                    className="font-heading text-foreground text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-heading), system-ui, sans-serif' }}
                  >
                    Red Hat Display
                  </p>
                  <p className="text-muted-foreground mt-2 font-mono text-xs">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-xs">
                    0123456789
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Used for headings and titles
                  </p>
                </div>
                <div className="border-border bg-muted/50 rounded-lg border p-4">
                  <p className="text-muted-foreground mb-2 font-mono text-xs">
                    font-sans / font-body
                  </p>
                  <p
                    className="text-foreground font-sans text-2xl font-normal"
                    style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}
                  >
                    DM Sans
                  </p>
                  <p className="text-muted-foreground mt-2 font-mono text-xs">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-xs">
                    0123456789
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Used for body text and UI elements
                  </p>
                </div>
                <div className="border-border bg-muted/50 rounded-lg border p-4">
                  <p className="text-muted-foreground mb-2 font-mono text-xs">
                    font-mono
                  </p>
                  <p className="text-foreground font-mono text-lg">System Mono Font</p>
                  <p className="text-muted-foreground mt-2 font-mono text-xs">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-xs">
                    0123456789
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Used for code and technical content
                  </p>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="border-border bg-card mt-6 rounded-lg border p-4">
                <h4 className="font-heading text-foreground mb-3 text-sm font-semibold">
                  Side-by-Side Comparison
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground mb-2 font-mono text-xs">
                      font-heading
                    </p>
                    <p className="font-heading text-foreground text-xl font-bold">
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 font-mono text-xs">
                      font-sans
                    </p>
                    <p className="text-foreground font-sans text-xl">
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 font-mono text-xs">
                      font-mono
                    </p>
                    <p className="text-foreground font-mono text-xl">
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Scale */}
            <div className="space-y-3">
              <h3 className="font-heading text-foreground text-lg font-semibold">
                Typography Scale
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-1 font-mono text-xs">
                    text-4xl font-heading font-bold
                  </p>
                  <h1 className="font-heading text-foreground text-4xl font-bold">
                    Heading 1 - Bold
                  </h1>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-mono text-xs">
                    text-3xl font-heading font-semibold
                  </p>
                  <h2 className="font-heading text-foreground text-3xl font-semibold">
                    Heading 2 - Semibold
                  </h2>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-mono text-xs">
                    text-2xl font-heading font-medium
                  </p>
                  <h3 className="font-heading text-foreground text-2xl font-medium">
                    Heading 3 - Medium
                  </h3>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-mono text-xs">
                    text-xl font-heading font-medium
                  </p>
                  <h4 className="font-heading text-foreground text-xl font-medium">
                    Heading 4 - Medium
                  </h4>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-mono text-xs">
                    text-base font-sans
                  </p>
                  <p className="text-foreground text-base">
                    Body text - Regular (DM Sans)
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-mono text-xs">
                    text-sm text-muted-foreground
                  </p>
                  <p className="text-muted-foreground text-sm">Small text - Muted</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 font-mono text-xs">
                    text-xs text-muted-foreground
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Extra small text - Muted
                  </p>
                </div>
              </div>
            </div>

            {/* Font Loading Status */}
            <div className="bg-status-success/10 border-status-success/20 rounded-lg border p-4">
              <p className="text-foreground text-sm">
                ✅ <strong>Fonts Status:</strong> Red Hat Display (heading) and DM Sans
                (body) are loaded via Next.js font optimization. Check browser DevTools →
                Network tab to verify font files are loaded.
              </p>
            </div>
          </div>
        </section>

        {/* What We've Unlocked Section */}
        <section className="border-border bg-card space-y-4 rounded-lg border p-6 shadow-sm">
          <h2 className="font-heading text-foreground text-2xl font-semibold">
            🎉 What We&apos;ve Unlocked
          </h2>
          <p className="text-muted-foreground text-sm">
            Comprehensive overview of all features and capabilities available in this
            setup
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Design System */}
            <div className="space-y-3">
              <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
                <span className="text-accent-theme-purple">🎨</span> Design System
              </h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Centralized Color System</strong> - All colors from tokens.css
                    (single source of truth)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Dark Mode</strong> - Automatic theme switching with system
                    preference detection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Tailwind CSS v4</strong> - Latest version with @theme
                    directive
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>ShadCN UI</strong> - Ready-to-use component library
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Custom Fonts</strong> - Red Hat Display (headings) & DM Sans
                    (body)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Responsive Design</strong> - Mobile-first breakpoints
                  </span>
                </li>
              </ul>
            </div>

            {/* Developer Experience */}
            <div className="space-y-3">
              <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
                <span className="text-accent-theme-blue">⚡</span> Developer Experience
              </h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>TypeScript</strong> - Full type safety across the codebase
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Path Aliases</strong> - @/ imports for cleaner code
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>ESLint + Prettier</strong> - Automated code formatting
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Pre-commit Hooks</strong> - Husky + lint-staged
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Hot Reload</strong> - Instant feedback during development
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Color Generator</strong> - npm run generate:tokens
                  </span>
                </li>
              </ul>
            </div>

            {/* User Experience */}
            <div className="space-y-3">
              <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
                <span className="text-accent-theme-pink">✨</span> User Experience
              </h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Toast Notifications</strong> - Global notification system
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Sound System</strong> - Web Audio API with volume control
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Keyboard Shortcuts</strong> - Theme toggle, help menu
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Theme Toggle</strong> - Light/dark mode switching
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Accessibility</strong> - Semantic HTML & ARIA support
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Responsive UI</strong> - Works on all screen sizes
                  </span>
                </li>
              </ul>
            </div>

            {/* Production Features */}
            <div className="space-y-3">
              <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
                <span className="text-status-success">🚀</span> Production Features
              </h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Sentry</strong> - Error tracking (client, server, edge)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Microsoft Clarity</strong> - User behavior analytics
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Web Vitals</strong> - Performance monitoring
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Error Boundaries</strong> - Graceful error handling
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Environment Validation</strong> - Zod schema validation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>CI/CD Ready</strong> - GitHub Actions workflow
                  </span>
                </li>
              </ul>
            </div>

            {/* State Management */}
            <div className="space-y-3">
              <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
                <span className="text-accent-theme-green">🗄️</span> State Management
              </h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Redux Toolkit</strong> - Modern Redux with best practices
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Type-Safe Hooks</strong> - Typed useSelector & useDispatch
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Async Thunks</strong> - API calls with loading states
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Modular Slices</strong> - Organized by feature
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>DevTools</strong> - Redux DevTools integration
                  </span>
                </li>
              </ul>
            </div>

            {/* API & Data */}
            <div className="space-y-3">
              <h3 className="font-heading text-foreground flex items-center gap-2 text-lg font-semibold">
                <span className="text-status-info">🔌</span> API & Data
              </h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Axios</strong> - HTTP client with interceptors
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>API Client</strong> - Centralized API configuration
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Type-Safe Responses</strong> - Typed API responses
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-status-success mt-1">✓</span>
                  <span>
                    <strong>Error Handling</strong> - Centralized error management
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-muted/50 border-border mt-6 rounded-lg border p-4">
            <h3 className="font-heading text-foreground mb-3 text-lg font-semibold">
              📊 Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              <div>
                <p className="font-heading text-primary text-2xl font-bold">30+</p>
                <p className="text-muted-foreground text-xs">Color Tokens</p>
              </div>
              <div>
                <p className="font-heading text-primary text-2xl font-bold">2</p>
                <p className="text-muted-foreground text-xs">Font Families</p>
              </div>
              <div>
                <p className="font-heading text-primary text-2xl font-bold">100%</p>
                <p className="text-muted-foreground text-xs">Type Safe</p>
              </div>
              <div>
                <p className="font-heading text-primary text-2xl font-bold">∞</p>
                <p className="text-muted-foreground text-xs">Possibilities</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
