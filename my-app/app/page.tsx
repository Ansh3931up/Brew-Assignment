'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  Zap,
  Shield,
  BarChart3,
  Rocket,
  Github,
  BookOpen,
  TestTube,
  Sparkles,
  Layers,
  Cpu,
  // Globe,
  Settings,
  Terminal,
  // FileCode,
  Package,
  CheckCircle2,
  TrendingUp,
  Activity,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const widgets = [
    {
      id: 'features',
      title: 'Core Features',
      icon: Sparkles,
      color: 'text-accent-theme-blue',
      bgColor: 'bg-accent-theme-blue/10',
      items: [
        { label: 'Next.js 16', value: 'Latest' },
        { label: 'TypeScript', value: '5.9.3' },
        { label: 'React 19', value: 'Server Components' },
        { label: 'Tailwind v4', value: 'Modern CSS' }
      ]
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: TrendingUp,
      color: 'text-status-success',
      bgColor: 'bg-status-success/10',
      items: [
        { label: 'Build Time', value: '< 3s' },
        { label: 'Lighthouse', value: '100' },
        { label: 'Bundle Size', value: 'Optimized' },
        { label: 'Core Web Vitals', value: 'Excellent' }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      icon: Activity,
      color: 'text-status-info',
      bgColor: 'bg-status-info/10',
      items: [
        { label: 'Sentry', value: 'Active' },
        { label: 'Clarity', value: 'Enabled' },
        { label: 'Web Vitals', value: 'Tracked' },
        { label: 'Errors', value: '0' }
      ]
    },
    {
      id: 'tools',
      title: 'Dev Tools',
      icon: Settings,
      color: 'text-accent-theme-purple',
      bgColor: 'bg-accent-theme-purple/10',
      items: [
        { label: 'ESLint', value: 'Configured' },
        { label: 'Prettier', value: 'Auto-format' },
        { label: 'Husky', value: 'Git Hooks' },
        { label: 'TypeScript', value: 'Strict' }
      ]
    }
  ]

  const quickActions = [
    {
      icon: TestTube,
      label: 'Test Page',
      href: '/test',
      color: 'text-accent-theme-blue'
    },
    { icon: BookOpen, label: 'Docs', href: '#', color: 'text-accent-theme-purple' },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com',
      color: 'text-foreground'
    },
    { icon: Terminal, label: 'Terminal', href: '#', color: 'text-status-success' }
  ]

  const featureCards = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for performance',
      gradient: 'from-accent-theme-blue/20 to-accent-theme-purple/20'
    },
    {
      icon: Shield,
      title: 'Production Ready',
      description: 'Built for scale',
      gradient: 'from-status-success/20 to-status-info/20'
    },
    {
      icon: Layers,
      title: 'Modern Stack',
      description: 'Latest technologies',
      gradient: 'from-accent-theme-pink/20 to-accent-theme-yellow/20'
    },
    {
      icon: Cpu,
      title: 'Type Safe',
      description: 'Full TypeScript',
      gradient: 'from-primary/20 to-secondary/20'
    }
  ]

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Desktop Wallpaper Background */}
      <div className="fixed inset-0 -z-10">
        <div className="from-background via-background to-muted absolute inset-0 bg-linear-to-br opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      </div>

      {/* macOS-style Menu Bar */}
      <header className="glass-light border-border/50 fixed top-0 right-0 left-0 z-50 border-b">
        <div className="container mx-auto flex h-12 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Rocket className="text-primary h-5 w-5" />
              <span className="font-heading text-foreground font-semibold">ECOVA</span>
            </div>
            <nav className="hidden items-center gap-4 md:flex">
              <button className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                File
              </button>
              <button className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Edit
              </button>
              <button className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                View
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/test"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
            >
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Test</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Desktop Content */}
      <main className="min-h-screen pt-12 pb-24">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Widget */}
          <div className="mx-auto mb-8 max-w-4xl">
            <div className="glass relative overflow-hidden rounded-2xl p-8 md:p-12">
              <div className="bg-primary/10 absolute top-0 right-0 -z-10 h-64 w-64 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="glass-light mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                  <Sparkles className="text-primary h-4 w-4" />
                  <span className="text-foreground">Production-Ready Boilerplate</span>
                </div>
                <h1 className="font-heading text-foreground mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                  Build Fast, Ship{' '}
                  <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent">
                    Confidently
                  </span>
                </h1>
                <p className="text-muted-foreground mb-6 max-w-2xl text-lg md:text-xl">
                  A comprehensive Next.js 16 boilerplate with TypeScript, Redux Toolkit,
                  monitoring, analytics, and enterprise-level best practices.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/test"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all hover:scale-105"
                  >
                    <TestTube className="h-4 w-4" />
                    Explore Features
                  </Link>
                  <Link
                    href="#widgets"
                    className="glass text-foreground inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all hover:scale-105"
                  >
                    View Widgets
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Widgets Grid */}
          <div
            id="widgets"
            className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {widgets.map((widget) => {
              const Icon = widget.icon
              return (
                <div
                  key={widget.id}
                  className="glass rounded-xl p-5 transition-transform hover:scale-105"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${widget.bgColor}`}>
                      <Icon className={`h-5 w-5 ${widget.color}`} />
                    </div>
                    <h3 className="font-heading text-foreground text-sm font-semibold">
                      {widget.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {widget.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-foreground font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feature Cards Row */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card, idx) => {
              const Icon = card.icon
              return (
                <div
                  key={idx}
                  className={`glass group relative cursor-pointer overflow-hidden rounded-xl p-6 transition-all hover:scale-105`}
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${card.gradient} -z-10 opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <Icon className="text-primary mb-3 h-8 w-8" />
                  <h3 className="font-heading text-foreground mb-1 font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{card.description}</p>
                </div>
              )
            })}
          </div>

          {/* Large Feature Showcase */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            {/* Left: Tech Stack Widget */}
            <div className="glass rounded-2xl p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Package className="text-primary h-6 w-6" />
                </div>
                <h2 className="font-heading text-foreground text-2xl font-bold">
                  Tech Stack
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Next.js 16',
                  'React 19',
                  'TypeScript',
                  'Tailwind v4',
                  'Redux Toolkit',
                  'Sentry',
                  'Axios',
                  'ShadCN UI'
                ].map((tech, idx) => (
                  <div
                    key={idx}
                    className="bg-muted/50 flex items-center gap-2 rounded-lg p-3"
                  >
                    <CheckCircle2 className="text-status-success h-4 w-4 shrink-0" />
                    <span className="text-foreground text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Stats Widget */}
            <div className="glass rounded-2xl p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-status-success/10 rounded-lg p-2">
                  <BarChart3 className="text-status-success h-6 w-6" />
                </div>
                <h2 className="font-heading text-foreground text-2xl font-bold">
                  Quick Stats
                </h2>
              </div>
              <div className="space-y-4">
                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Star className="text-accent-theme-yellow h-5 w-5" />
                    <span className="text-foreground text-sm font-medium">Features</span>
                  </div>
                  <span className="font-heading text-foreground text-2xl font-bold">
                    30+
                  </span>
                </div>
                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="text-primary h-5 w-5" />
                    <span className="text-foreground text-sm font-medium">
                      Setup Time
                    </span>
                  </div>
                  <span className="font-heading text-foreground text-2xl font-bold">
                    &lt; 5min
                  </span>
                </div>
                <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-status-success h-5 w-5" />
                    <span className="text-foreground text-sm font-medium">
                      Performance
                    </span>
                  </div>
                  <span className="font-heading text-foreground text-2xl font-bold">
                    100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Dock */}
          <div className="mb-8 flex justify-center gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <Link
                  key={idx}
                  href={action.href}
                  className="glass group rounded-xl p-4 transition-all hover:scale-110"
                >
                  <Icon
                    className={`h-6 w-6 ${action.color} transition-transform group-hover:scale-110`}
                  />
                  <div className="text-muted-foreground group-hover:text-foreground mt-2 text-center text-xs transition-colors">
                    {action.label}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      {/* macOS-style Dock */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="glass-strong border-border/50 flex items-center gap-3 rounded-2xl border px-4 py-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <Link
                key={idx}
                href={action.href}
                className="hover:bg-background/50 group relative rounded-lg p-2 transition-all"
                title={action.label}
              >
                <Icon
                  className={`h-5 w-5 ${action.color} transition-transform group-hover:scale-125`}
                />
                <div className="bg-background/90 glass pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  {action.label}
                </div>
              </Link>
            )
          })}
          <div className="bg-border/50 mx-2 h-8 w-px" />
          <Link
            href="/test"
            className="hover:bg-background/50 group relative rounded-lg p-2 transition-all"
            title="Test Page"
          >
            <TestTube className="text-primary h-5 w-5 transition-transform group-hover:scale-125" />
            <div className="bg-background/90 glass pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
              Test Page
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
