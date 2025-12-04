'use client'

import {
  CheckCircle2,
  Calendar,
  Filter,
  
  Edit3,
  Clock,
  Flag
} from 'lucide-react'

interface FeaturesSectionProps {
  id: string
  forwardedRef?: React.RefObject<HTMLDivElement | null>
}

export function FeaturesSection({ id, forwardedRef }: FeaturesSectionProps) {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Create Tasks',
      description: 'Add tasks with title, description, due date, priority, and status',
      color: 'text-status-success',
      bgColor: 'bg-status-success/10'
    },
    {
      icon: Filter,
      title: 'Filter & Search',
      description: 'Filter tasks by status or search by title and description',
      color: 'text-status-info',
      bgColor: 'bg-status-info/10'
    },
    {
      icon: Edit3,
      title: 'Edit Tasks',
      description: 'Update task details anytime with easy editing',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Calendar,
      title: 'Due Dates',
      description: 'Set and track due dates to stay on schedule',
      color: 'text-accent-theme-blue',
      bgColor: 'bg-accent-theme-blue/10'
    },
    {
      icon: Flag,
      title: 'Priorities',
      description: 'Set priority levels (low, medium, high) for better organization',
      color: 'text-status-warning',
      bgColor: 'bg-status-warning/10'
    },
    {
      icon: Clock,
      title: 'Track Progress',
      description: 'Monitor task status from To Do to In Progress to Done',
      color: 'text-accent-theme-purple',
      bgColor: 'bg-accent-theme-purple/10'
    }
  ]

  return (
    <section
      id={id}
      ref={forwardedRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your tasks efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="glass rounded-xl p-6 border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-105"
              >
                <div className={`${feature.bgColor} rounded-lg p-3 w-fit mb-4`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

