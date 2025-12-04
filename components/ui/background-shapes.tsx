'use client'

export function BackgroundShapes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  )
}

