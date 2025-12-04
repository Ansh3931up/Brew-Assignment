'use client'

import { CheckCircle2, Zap, Shield, Users } from 'lucide-react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface AboutSectionProps {
  id: string
  forwardedRef?: React.RefObject<HTMLDivElement | null>
}

export function AboutSection({ id, forwardedRef }: AboutSectionProps) {
  const benefits = [
    {
      icon: Zap,
      title: 'Fast & Simple',
      description: 'Lightning-fast performance with an intuitive interface'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your tasks are stored securely and are private to you'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Designed for everyone, from beginners to power users'
    }
  ]

  return (
    <section
      id={id}
      ref={forwardedRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-4">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-foreground">About Task Tracker</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Organize Your Life,
              <br />
              <span className="text-primary">One Task at a Time</span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Task Tracker is a modern, user-friendly application designed to help you stay organized 
              and productive. Whether you&apos;re managing personal projects, work tasks, or daily to-dos, 
              our intuitive interface makes it easy to create, organize, and complete your tasks.
            </p>

            <div className="space-y-4 pt-4">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 mt-6"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Right: Visual */}
          <div className="glass rounded-2xl p-8 border-2 border-primary/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Task Statistics</h3>
                <span className="text-xs text-muted-foreground">This Week</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Tasks Completed', value: '24', color: 'text-status-success' },
                  { label: 'In Progress', value: '8', color: 'text-status-info' },
                  { label: 'To Do', value: '12', color: 'text-muted-foreground' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-background/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color === 'text-status-success' ? 'bg-status-success' : stat.color === 'text-status-info' ? 'bg-status-info' : 'bg-muted-foreground'}`}
                        style={{ width: `${(parseInt(stat.value) / 44) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

