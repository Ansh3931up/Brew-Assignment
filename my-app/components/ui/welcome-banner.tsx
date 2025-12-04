'use client'

import Image from 'next/image'
import { CheckCircle2, ArrowRight } from 'lucide-react'

interface WelcomeBannerProps {
  title?: string
  description?: string
  buttonText?: string
  className?: string
  onButtonClick?: () => void
  imageSrc?: string
  imageAlt?: string
}

export function WelcomeBanner({
  className = 'bg-linear-gradient-to-r from-primary to-purple-600',
  title = 'Welcome to Task Tracker!',
  description = 'Organize your tasks, stay productive, and get things done. Simple, fast, and powerful task management.',
  buttonText = 'Get Started',
  onButtonClick,
  imageSrc,
  imageAlt = 'Welcome illustration'
}: WelcomeBannerProps) {
  return (
    <div className={`${className} rounded-xl p-6 relative overflow-hidden shadow-xl border-2 border-primary/20`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
      
      <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-white/90" />
            <h2 className="text-white text-2xl md:text-3xl font-bold">{title}</h2>
          </div>
          <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-xl">
            {description}
          </p>
          {onButtonClick && (
            <button
              onClick={onButtonClick}
              className="mt-4 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              {buttonText}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {imageSrc && (
          <div className="hidden md:block relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl border-4 border-white/20">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={140}
                height={140}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

