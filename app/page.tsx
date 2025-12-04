'use client'

import { useRef, useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import type { RootState } from '@/lib/store'

// Lazy load components for better performance
const Navbar = lazy(() => import('@/components/homePage/Navbar').then(mod => ({ default: mod.Navbar })))
const HeroSection = lazy(() => import('@/components/homePage/HeroSection').then(mod => ({ default: mod.HeroSection })))
const AboutSection = lazy(() => import('@/components/homePage/AboutSection').then(mod => ({ default: mod.AboutSection })))
const FeaturesSection = lazy(() => import('@/components/homePage/FeaturesSection').then(mod => ({ default: mod.FeaturesSection })))
const Footer = lazy(() => import('@/components/homePage/Footer').then(mod => ({ default: mod.Footer })))
const BackgroundShapes = lazy(() => import('@/components/ui/background-shapes').then(mod => ({ default: mod.BackgroundShapes })))

// Skeleton components
const NavbarSkeleton = () => (
  <div className="fixed top-0 left-0 w-full h-16 glass-light border-b border-border z-50">
    <div className="container mx-auto px-4 h-full flex items-center justify-between">
      <div className="h-8 w-32 bg-muted/50 rounded animate-pulse"></div>
      <div className="hidden md:flex space-x-4">
        <div className="h-6 w-16 bg-muted/50 rounded animate-pulse"></div>
        <div className="h-6 w-16 bg-muted/50 rounded animate-pulse"></div>
        <div className="h-6 w-16 bg-muted/50 rounded animate-pulse"></div>
      </div>
      <div className="h-8 w-20 bg-muted/50 rounded animate-pulse"></div>
    </div>
  </div>
)

const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center px-4 pt-20">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="h-12 w-48 bg-muted/50 rounded animate-pulse"></div>
          <div className="h-16 w-full bg-muted/50 rounded animate-pulse"></div>
          <div className="h-6 w-full bg-muted/50 rounded animate-pulse"></div>
          <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-muted/50 rounded animate-pulse"></div>
            <div className="h-12 w-24 bg-muted/50 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="h-96 w-full bg-muted/50 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
)

const SectionSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center px-4 py-20">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <div className="h-10 w-48 bg-muted/50 rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-1 w-20 bg-muted/50 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-muted/50 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse"></div>
        </div>
        <div className="h-64 bg-muted/50 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
)

const FeaturesSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center px-4 py-20">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <div className="h-10 w-64 bg-muted/50 rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-1 w-20 bg-muted/50 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="h-48 bg-muted/50 rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
)

// Lazy component wrapper with intersection observer
const LazySection = ({ 
  children, 
  fallback, 
  id 
}: { 
  children: React.ReactNode
  fallback: React.ReactNode
  id: string 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldLoad) {
          setShouldLoad(true)
          setTimeout(() => setIsVisible(true), 100)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px 0px'
      }
    )

    if (ref.current && observer) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={ref} id={id}>
      {isVisible ? (
        <div className="content-transition">
          {children}
        </div>
      ) : (
        fallback
      )}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // All refs must be declared before any early returns
  const homeRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const sectionRefs = useMemo(() => [
    homeRef.current,
    aboutRef.current,
    featuresRef.current,
  ], [])

  const scrollToSection = useCallback((sectionId: string) => {
    const targetElement = document.getElementById(sectionId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const toggleMobileMenu = useCallback((isOpen: boolean | ((prev: boolean) => boolean)) => {
    setIsMobileMenuOpen(isOpen)
  }, [])

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user && Object.keys(user).length > 0) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router, loading])

  // IntersectionObserver for active section tracking - only set up if not loading/redirecting
  useEffect(() => {
    // Skip observer setup if loading or authenticated (will redirect)
    if (loading || (isAuthenticated && user && Object.keys(user).length > 0)) {
      return
    }

    let observer: IntersectionObserver | null = null
    let timeoutId: NodeJS.Timeout | null = null

    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          })
        },
        {
          threshold: 0.3,
          rootMargin: '-50px 0px -50px 0px'
        }
      )

      sectionRefs.forEach((section) => {
        if (section && observer) observer.observe(section)
      })
    }

    timeoutId = setTimeout(setupObserver, 100)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (observer) {
        sectionRefs.forEach((section) => {
          if (section && observer) observer.unobserve(section)
        })
        observer.disconnect()
      }
    }
  }, [sectionRefs, loading, isAuthenticated, user])

  // Preload components - only if not loading/redirecting
  useEffect(() => {
    if (loading || (isAuthenticated && user && Object.keys(user).length > 0)) {
      return
    }

    const preloadComponents = async () => {
      setTimeout(() => {
        import('@/components/homePage/AboutSection')
        import('@/components/homePage/FeaturesSection')
      }, 1000)
    }
    preloadComponents()
  }, [loading, isAuthenticated, user])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render landing page if authenticated (will redirect)
  if (isAuthenticated && user && Object.keys(user).length > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(var(--theme-tint-rgb, 0, 122, 255), 0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--theme-tint-rgb, 0, 122, 255), 0.5);
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        html, body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Background Shapes */}
      <Suspense fallback={null}>
        <BackgroundShapes />
      </Suspense>

      {/* Navbar */}
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          setMobileMenuOpen={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      </Suspense>

      {/* Main content */}
      <div className={`relative transition-all overflow-hidden flex-1 ${isMobileMenuOpen ? 'blur-sm brightness-75' : ''}`}>
        {/* Hero section loads immediately */}
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection id="home" forwardedRef={homeRef} />
        </Suspense>

        {/* Features section */}
        <LazySection id="features" fallback={<FeaturesSkeleton />}>
          <Suspense fallback={<FeaturesSkeleton />}>
            <FeaturesSection id="features" forwardedRef={featuresRef} />
          </Suspense>
        </LazySection>

        {/* About section */}
        <LazySection id="about" fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <AboutSection id="about" forwardedRef={aboutRef} />
          </Suspense>
        </LazySection>
      </div>

      {/* Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
