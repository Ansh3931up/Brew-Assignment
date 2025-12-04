'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Calendar, Filter } from 'lucide-react'

interface HeroSectionProps {
  id: string
  forwardedRef?: React.RefObject<HTMLDivElement | null>
}

export function HeroSection({ id, forwardedRef }: HeroSectionProps) {
  return (
    <section
      id={id}
      ref={forwardedRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-foreground">Organize Your Life</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Stay Productive with
              <br />
              <span className="text-transparent bg-clip-text bg-linear-gradient-to-r from-primary to-primary/60">
                Task Tracker
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Organize your tasks, set priorities, track progress, and get things done. 
              Simple, intuitive, and powerful task management for everyone.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Create & Organize</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Set Due Dates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-5 w-5 text-primary" />
                <span>Filter & Search</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/25"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 glass border-2 border-primary/20 text-foreground hover:border-primary/40 px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:block">
            <div className="glass rounded-2xl p-8 border-2 border-primary/20">
              <div className="space-y-4">
                {[
                  { title: 'Design Dashboard', status: 'Done', priority: 'High' },
                  { title: 'Implement Auth', status: 'In Progress', priority: 'High' },
                  { title: 'Write Documentation', status: 'To Do', priority: 'Medium' },
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="bg-background/50 rounded-lg p-4 border-2 border-primary/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'Done' ? 'bg-status-success/20 text-status-success' :
                        task.status === 'In Progress' ? 'bg-status-info/20 text-status-info' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Priority: {task.priority}</span>
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

